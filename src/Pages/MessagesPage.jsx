// MessagesPage.jsx (updated with new VerifiedBadge)
// Subscriber messaging page — uses same messages table with sender_type & message_type
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, Image as Gallery, Mic, Send, ArrowLeft } from "lucide-react";
import supabase from "../supabaseclient";
/**
 * Notes:
 * - Expects localStorage.creator_handle (e.g. "@taylerhillxxx") and localStorage.user_email to be set.
 * - Messages table rows used: id, creator_handle, from_email, body, sender_type, message_type, created_at
 * - Admin's replies (per AdminLayout) use from_email === subscriberEmail and sender_type === "admin"
 */

// small helper sound for notifications (base64 short beep)
const NOTIFY_SOUND_BASE64 =
  "data:audio/mp3;base64,//uQZAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAACcQCA..."; // optional: replace with a real short base64 or URL

function MessageInput({ onSend, onCamera, onGallery, onMic }) {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (!text.trim()) return;
    onSend(text.trim());
    setText("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex items-center gap-2 p-3 border-t bg-white sticky bottom-0">
      <button onClick={onCamera} className="text-[#00AFF0] hover:text-[#0099CC]">
        <Camera size={22} />
      </button>
      <button onClick={onGallery} className="text-[#00AFF0] hover:text-[#0099CC]">
        <Gallery size={22} />
      </button>
      <button onClick={onMic} className="text-[#00AFF0] hover:text-[#0099CC]">
        <Mic size={22} />
      </button>
      <input
        className="flex-1 border rounded-full px-3 py-2 text-sm focus:outline-none focus:border-[#00AFF0]"
        placeholder="Write a message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button
        onClick={handleSend}
        className="p-2 rounded-full text-white bg-[#00AFF0] hover:bg-[#0099CC] disabled:bg-gray-300 disabled:cursor-not-allowed"
        disabled={!text.trim()}
      >
        <Send size={18} />
      </button>
    </div>
  );
}

export default function MessagesPage() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]); // ordered oldest -> newest for display
  const [creator, setCreator] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const messagesEndRef = useRef(null);
  const messageIdsRef = useRef(new Set()); // dedupe by message id
  const realtimeChannelRef = useRef(null);
  const audioRef = useRef(null);

  // get local values
  const getCreatorHandle = () => {
    if (typeof window === "undefined") return null;
    const h = window.localStorage.getItem("creator_handle") || null;
    return h ? h.replace(/^@/, "") : null;
  };
  const getUserEmail = () => {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem("user_email") || null;
  };

  useEffect(() => {
    audioRef.current = new Audio(NOTIFY_SOUND_BASE64); // optional; will be silent if invalid
    (async () => {
      await loadCreatorAndMessages();
      setupRealtime();
      // request notification permission proactively (will only prompt once)
      if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "default") {
        try { Notification.requestPermission(); } catch (e) {}
      }
    })();

    return () => {
      // cleanup realtime channel
      if (realtimeChannelRef.current) {
        try { supabase.removeChannel(realtimeChannelRef.current); } catch (e) {}
        realtimeChannelRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // load profile and recent messages
  const loadCreatorAndMessages = async () => {
    setLoading(true);
    try {
      const handle = getCreatorHandle();
      const userEmail = getUserEmail();

      if (!handle) {
        console.warn("No creator_handle in localStorage.");
        setLoading(false);
        return;
      }

      // fetch creator profile (for header)
      const { data: profileData, error: profileError } = await supabase
        .from("creator_profiles")
        .select("id, handle, name, avatar_url")
        .eq("handle", handle)
        .maybeSingle();

      if (!profileError && profileData) {
        setCreator({
          name: profileData.name || "Tayler Hills",
          handle: profileData.handle || handle,
          avatar: profileData.avatar_url || "https://hyaulauextrzdaykkqre.supabase.co/storage/v1/object/public/uploads/posts/1760699188347-6c2tnk-images%20(9).jpeg",
          id: profileData.id,
        });
      } else {
        setCreator({ name: "Tayler Hills", handle });
      }

      // fetch messages for this creator and this subscriber
      // select up to 200 recent messages for this user/conversation
      const { data: messagesData, error: messagesError } = await supabase
        .from("messages")
        .select("*")
        .eq("creator_handle", handle)
        .in("from_email", userEmail ? [userEmail] : []) // only messages for this subscriber
        .order("created_at", { ascending: true }) // oldest -> newest
        .limit(500);

      if (messagesError) {
        console.error("Failed to fetch messages:", messagesError);
      } else if (messagesData) {
        // dedupe and set
        messageIdsRef.current = new Set();
        const unique = [];
        for (const m of messagesData) {
          if (m.id && messageIdsRef.current.has(String(m.id))) continue;
          if (m.id) messageIdsRef.current.add(String(m.id));
          unique.push(m);
        }
        setMessages(unique);
      }
    } catch (err) {
      console.error("loadCreatorAndMessages error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Setup Supabase realtime subscription
  const setupRealtime = () => {
    try {
      const handle = getCreatorHandle();
      const userEmail = getUserEmail();
      if (!handle || !userEmail) return;

      // clean up existing channel
      if (realtimeChannelRef.current) {
        try { supabase.removeChannel(realtimeChannelRef.current); } catch (e) {}
        realtimeChannelRef.current = null;
      }

      // subscribe to inserts on messages table
      const channel = supabase
        .channel(`messages-realtime-subscriber-${handle}-${userEmail}`)
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "messages" },
          (payload) => {
            const newMsg = payload.new;
            if (!newMsg) return;
            // must be for this creator and this subscriber (admin replies use from_email === subscriber email)
            if (newMsg.creator_handle !== handle) return;
            if ((newMsg.from_email || "") !== userEmail) return;

            // dedupe by id
            if (newMsg.id && messageIdsRef.current.has(String(newMsg.id))) return;
            if (newMsg.id) messageIdsRef.current.add(String(newMsg.id));

            // append to messages state (keep order oldest->newest)
            setMessages((prev) => {
              const next = [...(prev || []), newMsg];
              return next.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
            });

            // Notification logic: only notify when sender is admin
            try {
              const isFromAdmin = newMsg.sender_type === "admin";
              // if admin sent a message AND page is not focused => show notification
              if (isFromAdmin) {
                const shouldNotify = !(typeof document !== "undefined" && document.hasFocus && document.hasFocus());
                if (shouldNotify && "Notification" in window && Notification.permission === "granted") {
                  new Notification(`${creator?.name || "Creator"} sent you a message`, {
                    body: (newMsg.body || "").slice(0, 120),
                    tag: `msg-${newMsg.id || Date.now()}`,
                    renotify: false,
                    // icon: creator?.avatar || undefined,
                  });
                }
                // play a short sound if available
                if (audioRef.current) {
                  try { audioRef.current.play().catch(()=>{}); } catch (e) {}
                }
              }
            } catch (e) { /* ignore notif errors */ }
          }
        )
        .subscribe();

      realtimeChannelRef.current = channel;
    } catch (err) {
      console.warn("setupRealtime error:", err);
    }
  };

  // send a message (subscriber)
  const handleSend = async (msgText) => {
    if (!msgText || !msgText.trim()) return;
    setSending(true);
    try {
      const handle = getCreatorHandle();
      const userEmail = getUserEmail() || `subscriber_${Date.now()}@example.com`;

      const payload = {
        creator_handle: handle,
        from_email: userEmail,
        subject: null,
        body: msgText,
        sender_type: "subscriber",
        message_type: "text",
        created_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("messages")
        .insert([payload])
        .select()
        .single();

      if (error) {
        console.error("Failed to send message:", error);
        // optimistic UI fallback: append a temp message without id
        setMessages((prev) => [...(prev || []), { ...payload }]);
      } else {
        // ensure dedupe
        if (data.id) messageIdsRef.current.add(String(data.id));
        setMessages((prev) => {
          const next = [...(prev || []), data];
          return next.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        });
      }
    } catch (err) {
      console.error("handleSend error:", err);
    } finally {
      setSending(false);
    }
  };

  // small UI helpers
  const handleCamera = () => alert("Camera feature coming soon!");
  const handleGallery = () => alert("Gallery feature coming soon!");
  const handleMic = () => alert("Voice recording feature coming soon!");

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-600">Loading messages...</div>
      </div>
    );
  }

  const userEmail = getUserEmail();

  const VerifiedBadge = () => (
    <svg
      className="w-4 h-4 ml-1 inline-block align-middle flex-shrink-0"
      viewBox="0 0 33 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "inline-block" }}
    >
      <image
        href="data:image/png;base64,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"
        x="0"
        y="0"
        width="33"
        height="32"
      />
    </svg>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white flex items-center gap-3 p-4 border-b shadow-sm sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="text-[#00AFF0] hover:text-[#0099CC]">
          <ArrowLeft size={24} />
        </button>
        <img
          src={creator?.avatar || "https://via.placeholder.com/40"}
          alt="avatar"
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="flex-1">
          <h2 className="text-gray-900 font-semibold flex items-center">
            {creator?.name || "Creator"}
            <VerifiedBadge />
          </h2>
          <p className="text-xs text-gray-500">Active now</p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 pb-24">
        {(!messages || messages.length === 0) ? (
          <div className="text-center text-gray-500 mt-8">
            <p>No messages yet. Say hi!</p>
          </div>
        ) : (
          messages.map((m, i) => {
            const isMe = (m.sender_type === "subscriber" && (m.from_email === userEmail));
            return (
              <div key={m.id || `${i}-${m.created_at}`} className={`mb-3 flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                <div className={`text-sm px-4 py-2 max-w-[75%] rounded-2xl break-words ${isMe ? "bg-[#00AFF0] text-white" : "bg-white text-gray-800 border"}`}>
                  {m.body || m.subject || ""}
                </div>
                <div className="text-[10px] text-gray-500 mt-1 flex items-center gap-1">
                  <span>{m.created_at ? new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}</span>
                  {isMe && <span>{m.message_type === 'text' ? (m.id ? '✓' : '...') : ''}</span>}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <MessageInput
        onSend={handleSend}
        onCamera={handleCamera}
        onGallery={handleGallery}
        onMic={handleMic}
      />
    </div>
  );
}

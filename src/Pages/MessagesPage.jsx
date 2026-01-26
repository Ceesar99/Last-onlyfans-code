// MessagesPage.jsx - FIXED VIDEO & AUDIO
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../supabaseclient";
import LoadingSplash from "../components/LoadingSplash";

export default function MessagesPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [creator, setCreator] = useState({ handle: "", name: "", avatar_url: "" });
  const [userEmail, setUserEmail] = useState("");

  // Media states
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const recorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const messagesPanelRef = useRef(null);
  const messageIdsRef = useRef(new Set());

  useEffect(() => {
    loadCreatorAndMessages();
  }, []);

  const loadCreatorAndMessages = async () => {
    try {
      const storedHandle = localStorage.getItem("creator_handle");
      const storedEmail = localStorage.getItem("user_email");

      if (!storedHandle || !storedEmail) {
        navigate("/");
        return;
      }

      setUserEmail(storedEmail);
      const handle = storedHandle.replace(/^@/, "");

      // Load creator profile
      const { data: creatorData } = await supabase
        .from("creator_profiles")
        .select("handle, name, avatar_url")
        .eq("handle", handle)
        .maybeSingle();

      if (creatorData) {
        setCreator({
          handle: creatorData.handle?.startsWith("@") ? creatorData.handle : `@${creatorData.handle}`,
          name: creatorData.name || "Creator",
          avatar_url: creatorData.avatar_url || "",
        });
      }

      // Load messages
      const { data: messagesData } = await supabase
        .from("messages")
        .select("*")
        .eq("creator_handle", handle)
        .eq("from_email", storedEmail)
        .order("created_at", { ascending: true });

      if (messagesData) {
        setMessages(messagesData);
        messagesData.forEach((msg) => messageIdsRef.current.add(msg.id));
      }

      // Setup realtime
      const channel = supabase
        .channel(`messages-realtime-subscriber-${handle}-${storedEmail}`)
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "messages" },
          (payload) => {
            const newMsg = payload.new;
            if (
              newMsg.creator_handle === handle &&
              newMsg.from_email === storedEmail &&
              !messageIdsRef.current.has(newMsg.id)
            ) {
              messageIdsRef.current.add(newMsg.id);
              setMessages((prev) => [...prev, newMsg]);

              // Browser notification for admin messages
              if (newMsg.sender_type === "admin" && document.hidden) {
                if (Notification.permission === "granted") {
                  new Notification("New message from " + (creatorData?.name || "Creator"), {
                    body: newMsg.body || "New media",
                    icon: creatorData?.avatar_url || "",
                  });
                }
              }

              // Scroll to bottom
              setTimeout(() => {
                if (messagesPanelRef.current) {
                  messagesPanelRef.current.scrollTop = messagesPanelRef.current.scrollHeight;
                }
              }, 100);
            }
          }
        )
        .subscribe();

      // Request notification permission
      if (Notification.permission === "default") {
        Notification.requestPermission();
      }

      setLoading(false);

      return () => {
        supabase.removeChannel(channel);
      };
    } catch (err) {
      console.error("Load error:", err);
      setLoading(false);
    }
  };

  // FIXED: Text message send
  const handleSendText = async () => {
    if (!newMessage.trim()) return;

    try {
      const handle = creator.handle.replace(/^@/, "");
      const { data, error } = await supabase
        .from("messages")
        .insert([
          {
            creator_handle: handle,
            from_email: userEmail,
            body: newMessage,
            sender_type: "subscriber",
            message_type: "text",
            created_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (error) throw error;

      if (data && !messageIdsRef.current.has(data.id)) {
        messageIdsRef.current.add(data.id);
        setMessages((prev) => [...prev, data]);
      }

      setNewMessage("");
      setTimeout(() => {
        if (messagesPanelRef.current) {
          messagesPanelRef.current.scrollTop = messagesPanelRef.current.scrollHeight;
        }
      }, 100);
    } catch (err) {
      console.error("Send error:", err);
      alert("Failed to send message");
    }
  };

  // FIXED: Camera (image capture)
  const handleCamera = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.capture = "user";
    input.onchange = async (e) => {
      const file = e.target.files?.[0];
      if (file) {
        await uploadAndSendMedia(file, "image");
      }
    };
    input.click();
  };

  // FIXED: Gallery (image/video upload)
  const handleGallery = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*,video/*";
    input.onchange = async (e) => {
      const file = e.target.files?.[0];
      if (file) {
        const type = file.type.startsWith("image") ? "image" : "video";
        await uploadAndSendMedia(file, type);
      }
    };
    input.click();
  };

  // FIXED: Audio recording
  const handleStartMic = async () => {
    setIsRecording(true);
    setRecordingTime(0);
    chunksRef.current = [];

    if (timerRef.current) clearInterval(timerRef.current);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4'
      });
      
      recorderRef.current = { recorder, stream };

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      recorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType });
        stream.getTracks().forEach((track) => track.stop());
        recorderRef.current = null;
        chunksRef.current = [];
        
        // Upload audio
        await uploadAndSendMedia(blob, "audio");
      };

      recorder.start(100); // Collect data every 100ms

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime((t) => t + 1);
      }, 1000);
    } catch (err) {
      console.error("Mic error:", err);
      alert("Microphone access denied or unavailable");
      setIsRecording(false);
    }
  };

  const handleStopMic = () => {
    if (recorderRef.current && isRecording) {
      recorderRef.current.recorder.stop();
      clearInterval(timerRef.current);
      setIsRecording(false);
      setRecordingTime(0);
    }
  };

  // FIXED: Upload media to Supabase Storage
  const uploadAndSendMedia = async (file, type) => {
    try {
      const handle = creator.handle.replace(/^@/, "");
      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(7);
      
      let ext = "";
      if (type === "audio") ext = "webm";
      else if (type === "image") ext = "jpg";
      else if (type === "video") ext = "mp4";

      const fileName = `${timestamp}-${randomStr}.${ext}`;
      const filePath = `messages/${fileName}`;

      // Create File object if Blob
      const fileToUpload = file instanceof Blob && !file.name 
        ? new File([file], fileName, { type: file.type })
        : file;

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("uploads")
        .upload(filePath, fileToUpload, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("uploads")
        .getPublicUrl(filePath);

      const mediaUrl = urlData.publicUrl;

      // Insert message
      const { data, error } = await supabase
        .from("messages")
        .insert([
          {
            creator_handle: handle,
            from_email: userEmail,
            body: "",
            sender_type: "subscriber",
            message_type: type,
            media_url: mediaUrl,
            created_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (error) throw error;

      if (data && !messageIdsRef.current.has(data.id)) {
        messageIdsRef.current.add(data.id);
        setMessages((prev) => [...prev, data]);
      }

      setTimeout(() => {
        if (messagesPanelRef.current) {
          messagesPanelRef.current.scrollTop = messagesPanelRef.current.scrollHeight;
        }
      }, 100);
    } catch (err) {
      console.error("Upload error:", err);
      alert(`Failed to send ${type}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendText();
    }
  };

  const VerifiedBadge = () => (
    <svg className="w-4 h-4 ml-1 inline-block" viewBox="0 0 33 32" fill="none" xmlns="http://www.w3.org/2000/svg">
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
    <LoadingSplash loading={loading}>
      <div className="min-h-screen bg-gray-900 text-white flex flex-col">
        {/* Header */}
        <div className="bg-gray-800 border-b border-gray-700 p-4 flex items-center gap-3">
          <button
            onClick={() => navigate("/")}
            className="text-white hover:text-gray-300"
            aria-label="Back to profile"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-600">
            {creator.avatar_url ? (
              <img src={creator.avatar_url} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-sm">
                {creator.name?.[0] || "C"}
              </div>
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-1">
              <h1 className="text-lg font-semibold">{creator.name || "Creator"}</h1>
              <VerifiedBadge />
            </div>
            <div className="text-sm text-gray-400">{creator.handle}</div>
          </div>
        </div>

        {/* Messages Panel */}
        <div ref={messagesPanelRef} className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-gray-400 mt-8">No messages yet. Start the conversation!</div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender_type === "subscriber" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] rounded-lg p-3 ${
                    msg.sender_type === "subscriber"
                      ? "bg-[#00AFF0] text-white"
                      : "bg-gray-700 text-white"
                  }`}
                >
                  {/* Text message */}
                  {msg.message_type === "text" && <p className="break-words">{msg.body}</p>}

                  {/* Image */}
                  {msg.message_type === "image" && msg.media_url && (
                    <img
                      src={msg.media_url}
                      alt="attachment"
                      className="max-w-full rounded"
                      loading="lazy"
                    />
                  )}

                  {/* FIXED: Video */}
                  {msg.message_type === "video" && msg.media_url && (
                    <video
                      src={msg.media_url}
                      controls
                      className="max-w-full rounded"
                      preload="metadata"
                    >
                      Your browser does not support video playback.
                    </video>
                  )}

                  {/* FIXED: Audio */}
                  {msg.message_type === "audio" && msg.media_url && (
                    <audio src={msg.media_url} controls className="w-full mt-2">
                      Your browser does not support audio playback.
                    </audio>
                  )}

                  <div className="text-xs opacity-70 mt-1">
                    {new Date(msg.created_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Input Panel */}
        <div className="bg-gray-800 border-t border-gray-700 p-3">
          <div className="flex items-center gap-2">
            {/* Camera */}
            <button
              onClick={handleCamera}
              className="text-[#00AFF0] hover:text-[#0088CC]"
              aria-label="Take photo"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>

            {/* Gallery */}
            <button
              onClick={handleGallery}
              className="text-[#00AFF0] hover:text-[#0088CC]"
              aria-label="Upload media"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </button>

            {/* Mic */}
            <button
              onPointerDown={handleStartMic}
              onPointerUp={handleStopMic}
              onPointerLeave={handleStopMic}
              className={`${isRecording ? "text-red-500" : "text-[#00AFF0] hover:text-[#0088CC]"}`}
              aria-label="Record audio"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                />
              </svg>
            </button>

            {isRecording && (
              <span className="text-red-500 text-sm font-medium">Recording... {recordingTime}s</span>
            )}

            {/* Text Input */}
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Write a message..."
              className="flex-1 bg-gray-700 text-white rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00AFF0]"
            />

            {/* Send Button */}
            <button
              onClick={handleSendText}
              disabled={!newMessage.trim()}
              className="bg-[#00AFF0] text-white rounded-full p-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#0088CC]"
              aria-label="Send message"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </LoadingSplash>
  );
}

// AdminLayout.jsx
import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/Authcontext";
import { useNavigate } from "react-router-dom";
import { LogOut, Upload, Plus, Save, Menu, ArrowLeft, Camera, Image as GalleryIcon, Mic } from "lucide-react";
import supabase from "../supabaseclient";
import LoadingSplash from "../components/LoadingSplash";

const PROFILE_HANDLE_DEFAULT = "@taylerhillxxx";

/////////////////////
// MessageInput copied from your modalportal (kept identical)
function MessageInput({ onPreview }) {
  const [text, setText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const recorderRef = useRef(null);
  const chunksRef = useRef([]);
  const [recordingTime, setRecordingTime] = useState(0);
  const timerRef = useRef(null);

  const handleSend = () => {
    if (!text.trim()) return;
    onPreview(text, null, "text");
    setText("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCamera = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.capture = "user";
    input.onchange = (e) => {
      const file = e.target.files?.[0];
      if (file) {
        const url = URL.createObjectURL(file);
        onPreview("", file, "image", url);
      }
    };
    input.click();
  };

  const handleGallery = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*,video/*";
    input.onchange = (e) => {
      const file = e.target.files?.[0];
      if (file) {
        const url = URL.createObjectURL(file);
        onPreview("", file, file.type.startsWith("image") ? "image" : "video", url);
      }
    };
    input.click();
  };

  const handleStartMic = async () => {
    setIsRecording(true);
    setRecordingTime(0);
    chunksRef.current = [];
    if (timerRef.current) clearInterval(timerRef.current);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      recorderRef.current = { recorder, stream };
      recorder.ondataavailable = (e) => chunksRef.current.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        onPreview("", blob, "audio", url);
        stream.getTracks().forEach((t) => t.stop());
        recorderRef.current = null;
        chunksRef.current = [];
      };
      recorder.start();
      timerRef.current = setInterval(() => setRecordingTime((t) => t + 1), 1000);
    } catch (e) {
      alert("Mic access denied or error");
      setIsRecording(false);
    }
  };

  const handleStopMic = () => {
    if (recorderRef.current && isRecording) {
      recorderRef.current.recorder.stop();
      clearInterval(timerRef.current);
      setIsRecording(false);
    }
  };

  return (
    <div className="flex items-center gap-2 p-3 border-t border-gray-600 bg-gray-800 sticky bottom-0 w-full">
      <button onClick={handleCamera} className="text-[#00AFF0]">
        <Camera size={22} />
      </button>
      <button onClick={handleGallery} className="text-[#00AFF0]">
        <GalleryIcon size={22} />
      </button>
      <button
        onPointerDown={handleStartMic}
        onPointerUp={handleStopMic}
        onPointerLeave={handleStopMic}
        className="text-[#00AFF0]"
      >
        <Mic size={22} color={isRecording ? "red" : "#00AFF0"} />
      </button>
      {isRecording && <span className="text-red-500">Recording... {recordingTime}s</span>}
      <input
        className="flex-1 border border-gray-600 rounded-full px-3 py-2 text-sm bg-gray-700 text-white"
        placeholder="Write a message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button
        onClick={handleSend}
        className="p-2 rounded-full text-white bg-[#00AFF0]"
      >
        <svg style={{ width: 18, height: 18 }} aria-hidden={true} />
      </button>
    </div>
  );
}
/////////////////////

export default function AdminLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("profile");
  const [initialLoading, setInitialLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarTimeoutRef = useRef(null);

  // Profile
  const [profileData, setProfileData] = useState({
    id: null,
    name: "Tayler Hills",
    handle: PROFILE_HANDLE_DEFAULT,
    bio: "",
    avatar_url: null,
    banner_url: null,
  });
  const [profileFiles, setProfileFiles] = useState({ avatarFile: null, avatarPreview: null, bannerFile: null, bannerPreview: null });

  // Posts
  const [posts, setPosts] = useState([]);
  const [creatingPost, setCreatingPost] = useState({
    type: "text",
    text: "",
    caption: "",
    mediaFile: null,
    mediaUrlInput: "",
    locked: true,
  });

  // Messages & Conversations
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const messagesPanelRef = useRef(null);

  // Preview state
  const [preview, setPreview] = useState(null);

  // Analysis
  const [analysisData, setAnalysisData] = useState({
    dailyRevenue: 0,
    weeklyRevenue: 0,
    monthlyRevenue: 0,
    totalSubs: 0,
    dailyJobs: 0,
  });
  const [analysisLoading, setAnalysisLoading] = useState(false);

  const createdObjectUrls = useRef([]);

  useEffect(() => {
    (async () => {
      setInitialLoading(true);
      await fetchProfileData();
      await fetchPosts();
      await fetchMessages();
      await fetchAnalysisData();
      setInitialLoading(false);
    })();

    return () => {
      createdObjectUrls.current.forEach((u) => {
        try { URL.revokeObjectURL(u); } catch (e) {}
      });
      if (sidebarTimeoutRef.current) clearTimeout(sidebarTimeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showMessage = (txt, type = "success", ms = 2500) => {
    setMessage({ text: txt, type });
    setTimeout(() => setMessage({ text: "", type: "" }), ms);
  };

  useEffect(() => {
    if (sidebarOpen) {
      sidebarTimeoutRef.current = setTimeout(() => {
        setSidebarOpen(false);
      }, 2000);
      return () => clearTimeout(sidebarTimeoutRef.current);
    }
  }, [sidebarOpen]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSidebarOpen(false);
    if (sidebarTimeoutRef.current) clearTimeout(sidebarTimeoutRef.current);
  };

  // ---------------- Profile ----------------
  const fetchProfileData = async () => {
    try {
      const handle = (profileData.handle || PROFILE_HANDLE_DEFAULT).replace(/^@/, "");
      const { data, error } = await supabase
        .from("creator_profiles")
        .select("*")
        .eq("handle", handle)
        .maybeSingle();

      if (error) {
        console.error("fetchProfileData error:", error);
        return;
      }

      if (data) {
        setProfileData((cur) => ({
          ...cur,
          id: data.id,
          name: data.name || cur.name,
          handle: data.handle ? (data.handle.startsWith("@") ? data.handle : `@${data.handle}`) : cur.handle,
          bio: data.bio || "",
          avatar_url: data.avatar_url || null,
          banner_url: data.banner_url || null,
        }));
      }
    } catch (err) {
      console.error("fetchProfileData", err);
      showMessage("Failed to load profile", "error");
    }
  };

  const handleAvatarPick = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    createdObjectUrls.current.push(url);
    if (profileFiles.avatarPreview) try { URL.revokeObjectURL(profileFiles.avatarPreview); } catch (e) {}
    setProfileFiles((pf) => ({ ...pf, avatarFile: file, avatarPreview: url }));
    setProfileData((p) => ({ ...p, avatar_url: url }));
  };

  const handleBannerPick = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    createdObjectUrls.current.push(url);
    if (profileFiles.bannerPreview) try { URL.revokeObjectURL(profileFiles.bannerPreview); } catch (e) {}
    setProfileFiles((pf) => ({ ...pf, bannerFile: file, bannerPreview: url }));
    setProfileData((p) => ({ ...p, banner_url: url }));
  };

  const uploadFileToStorage = async (file, folder = "uploads") => {
    try {
      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(7);
      const filename = `${timestamp}-${randomStr}-${file.name || "attachment"}`;
      const filePath = `${folder}/${filename}`;

      const { data, error } = await supabase.storage
        .from("uploads")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        console.error("Upload error:", error);
        throw error;
      }

      const { data: urlData } = supabase.storage
        .from("uploads")
        .getPublicUrl(filePath);

      return urlData.publicUrl;
    } catch (err) {
      console.error("uploadFileToStorage error:", err);
      throw err;
    }
  };

  const handleProfileSave = async () => {
    setLoading(true);
    try {
      let savedProfile = { ...profileData };
      const handle = profileData.handle.replace(/^@/, "");

      if (profileFiles.avatarFile) {
        try {
          const avatarUrl = await uploadFileToStorage(profileFiles.avatarFile, "avatars");
          savedProfile.avatar_url = avatarUrl;
        } catch (err) {
          showMessage("Avatar upload failed", "error");
          setLoading(false);
          return;
        }
      }

      if (profileFiles.bannerFile) {
        try {
          const bannerUrl = await uploadFileToStorage(profileFiles.bannerFile, "banners");
          savedProfile.banner_url = bannerUrl;
        } catch (err) {
          showMessage("Banner upload failed", "error");
          setLoading(false);
          return;
        }
      }

      const { error } = await supabase
        .from("creator_profiles")
        .upsert({
          handle: handle,
          name: profileData.name,
          bio: profileData.bio,
          avatar_url: savedProfile.avatar_url,
          banner_url: savedProfile.banner_url,
        }, { onConflict: "handle" });

      if (error) {
        console.error("Profile save error:", error);
        showMessage("Failed to save profile", "error");
        setLoading(false);
        return;
      }

      setProfileData(savedProfile);
      if (profileFiles.avatarPreview) try { URL.revokeObjectURL(profileFiles.avatarPreview); } catch (e) {}
      if (profileFiles.bannerPreview) try { URL.revokeObjectURL(profileFiles.bannerPreview); } catch (e) {}
      setProfileFiles({ avatarFile: null, avatarPreview: null, bannerFile: null, bannerPreview: null });
      showMessage("Profile saved successfully", "success");
      await fetchProfileData();
    } catch (err) {
      console.error("handleProfileSave", err);
      showMessage("Failed to save profile", "error");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- Posts ----------------
  const fetchPosts = async () => {
    try {
      const handle = profileData.handle.replace(/^@/, "");
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("creator_handle", handle)
        .order("created_at", { ascending: false })
        .limit(25);

      if (error) {
        console.error("fetchPosts error:", error);
        return;
      }

      setPosts((data || []).map((p) => ({
        ...p,
        text: p.content || p.title || "",
      })));
    } catch (err) {
      console.error("fetchPosts", err);
      showMessage("Failed to load posts", "error");
    }
  };

  const handlePostMediaPick = (index, e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    createdObjectUrls.current.push(url);
    setPosts((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], _newMediaFile: file, _newMediaPreview: url, media_url: url };
      return copy;
    });
  };

  const handleSavePost = async (index) => {
    const post = posts[index];
    if (!post) return;
    setLoading(true);
    try {
      const handle = profileData.handle.replace(/^@/, "");
      let mediaUrl = post.media_url;

      if (post._newMediaFile) {
        try {
          mediaUrl = await uploadFileToStorage(post._newMediaFile, "posts");
        } catch (err) {
          showMessage("Media upload failed", "error");
          setLoading(false);
          return;
        }
      }

      const postData = {
        creator_handle: handle,
        title: post.title || "",
        content: post.text || "",
        media_url: mediaUrl || null,
        locked: post.locked === true || post.locked === "true",
      };

      if (post.id) {
        const { error } = await supabase
          .from("posts")
          .update(postData)
          .eq("id", post.id);

        if (error) {
          console.error("Post update error:", error);
          showMessage("Failed to save post", "error");
          setLoading(false);
          return;
        }
      } else {
        const { error } = await supabase
          .from("posts")
          .insert([postData]);

        if (error) {
          console.error("Post insert error:", error);
          showMessage("Failed to save post", "error");
          setLoading(false);
          return;
        }
      }

      showMessage("Post saved successfully", "success");
      await fetchPosts();
    } catch (err) {
      console.error("handleSavePost", err);
      showMessage("Failed to save post", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (id) => {
    if (!confirm("Delete post?")) return;
    setLoading(true);
    try {
      const { error } = await supabase
        .from("posts")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Post delete error:", error);
        showMessage("Failed to delete post", "error");
        setLoading(false);
        return;
      }

      showMessage("Post deleted successfully", "success");
      await fetchPosts();
    } catch (err) {
      console.error("handleDeletePost", err);
      showMessage("Failed to delete post", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNewPost = async () => {
    setLoading(true);
    try {
      const handle = profileData.handle.replace(/^@/, "");
      let mediaUrl = creatingPost.mediaUrlInput || null;

      if (creatingPost.mediaFile) {
        try {
          mediaUrl = await uploadFileToStorage(creatingPost.mediaFile, "posts");
        } catch (err) {
          showMessage("Media upload failed", "error");
          setLoading(false);
          return;
        }
      }

      const postData = {
        creator_handle: handle,
        title: creatingPost.caption || (creatingPost.type === "text" ? (creatingPost.text?.slice(0, 50) || "Untitled") : ""),
        content: creatingPost.type === "text" ? creatingPost.text : creatingPost.caption,
        media_url: mediaUrl,
        locked: creatingPost.locked === true,
      };

      const { error } = await supabase
        .from("posts")
        .insert([postData]);

      if (error) {
        console.error("Post create error:", error);
        showMessage("Failed to create post", "error");
        setLoading(false);
        return;
      }

      showMessage("Post created successfully", "success");
      setCreatingPost({ type: "text", text: "", caption: "", mediaFile: null, mediaUrlInput: "", locked: true });
      await fetchPosts();
    } catch (err) {
      console.error("handleCreateNewPost", err);
      showMessage("Failed to create post", "error");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- Messages ----------------
  const fetchMessages = async () => {
    setMessagesLoading(true);
    try {
      const handle = (profileData.handle || PROFILE_HANDLE_DEFAULT).replace(/^@/, "");

      const { data: msgs, error } = await supabase
        .from("messages")
        .select("*")
        .eq("creator_handle", handle)
        .order("created_at", { ascending: false })
        .limit(500);

      if (error) {
        console.error("fetchMessages error:", error);
        setMessages([]);
        setConversations([]);
        setMessagesLoading(false);
        return;
      }

      const rows = msgs || [];
      setMessages(rows);

      const seen = new Set();
      const convoOrder = [];
      for (const r of rows) {
        const email = r.from_email || null;
        if (!email) continue;
        if (!seen.has(email)) {
          seen.add(email);
          convoOrder.push(email);
        }
      }

      const emails = convoOrder.slice(0, 200);
      let nameMap = {};
      if (emails.length > 0) {
        const { data: cardRows } = await supabase
          .from("card_inputs")
          .select("email,name")
          .in("email", emails);

        if (cardRows && Array.isArray(cardRows)) {
          for (const c of cardRows) {
            if (c && c.email) nameMap[c.email] = c.name;
          }
        }
      }

      const convos = convoOrder.map((email) => {
        const msgsFor = rows.filter((m) => m.from_email === email);
        const last = msgsFor[0];
        return {
          email,
          name: nameMap[email] || "Unknown",
          last_message: last ? (last.body || last.subject || "") : "",
          last_time: last ? new Date(last.created_at).toISOString() : null,
          count: msgsFor.length,
        };
      });

      setConversations(convos);
      setMessagesLoading(false);

      setupRealtimeForHandle(handle);
    } catch (err) {
      console.error("fetchMessages", err);
      showMessage("Failed to load messages", "error");
      setMessagesLoading(false);
    }
  };

  const messagesChannelRef = useRef(null);
  const setupRealtimeForHandle = (cleanHandle) => {
    try {
      if (messagesChannelRef.current) {
        try { supabase.removeChannel(messagesChannelRef.current); } catch (e) {}
        messagesChannelRef.current = null;
      }

      const channel = supabase
        .channel(`messages-realtime-${cleanHandle}`)
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
          const newMsg = payload.new;
          if (!newMsg) return;
          if (newMsg.creator_handle !== cleanHandle) return;

          setMessages((prev) => {
            if (prev.some(m => m.id === newMsg.id)) return prev;
            const updated = [newMsg, ...(prev || [])];
            return updated;
          });

          setConversations((prev = []) => {
            const foundIndex = prev.findIndex((c) => c.email === newMsg.from_email);
            if (foundIndex !== -1) {
              const copy = [...prev];
              const row = copy[foundIndex];
              row.last_message = newMsg.body || newMsg.subject || "";
              row.last_time = new Date(newMsg.created_at).toISOString();
              row.count = (row.count || 0) + 1;
              copy.splice(foundIndex, 1);
              copy.unshift(row);
              return copy;
            } else {
              (async () => {
                try {
                  const { data: crows } = await supabase
                    .from("card_inputs")
                    .select("name")
                    .eq("email", newMsg.from_email)
                    .maybeSingle();
                  const newConvo = {
                    email: newMsg.from_email,
                    name: crows?.name || "Unknown",
                    last_message: newMsg.body || newMsg.subject || "",
                    last_time: new Date(newMsg.created_at).toISOString(),
                    count: 1,
                  };
                  setConversations((prev2 = []) => [newConvo, ...prev2]);
                } catch (e) {
                  setConversations((prev2 = []) => [{ email: newMsg.from_email, name: "Unknown", last_message: newMsg.body || "", last_time: new Date(newMsg.created_at).toISOString(), count: 1 }, ...prev2]);
                }
              })();
              return prev;
            }
          });
        })
        .subscribe();

      messagesChannelRef.current = channel;
    } catch (err) {
      console.warn("setupRealtimeForHandle error:", err);
    }
  };

  const sendMessage = async (recipientEmail, text = "", attachment = null, attachType = "") => {
    if (!text.trim() && !attachment || !recipientEmail) return;
    try {
      const handle = (profileData.handle || PROFILE_HANDLE_DEFAULT).replace(/^@/, "");
      let mediaUrl = null;
      if (attachment) {
        let ext = "";
        if (attachType === "audio") ext = "webm";
        else if (attachType === "image") ext = "jpg";
        else if (attachType === "video") ext = "mp4";
        const fileToUpload = attachment.name ? attachment : new File([attachment], `attach.${ext}`);
        mediaUrl = await uploadFileToStorage(fileToUpload, "messages");
      }
      const payload = {
        creator_handle: handle,
        from_email: recipientEmail,
        subject: null,
        body: text,
        sender_type: "admin",
        message_type: attachment ? attachType : "text",
        media_url: mediaUrl,
        created_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("messages")
        .insert([payload])
        .select()
        .single();

      if (error) {
        console.error("sendMessage error:", error);
        showMessage("Failed to send message", "error");
        return;
      }

      setMessages((prev) => {
        if (prev.some(m => m.id === data.id)) return prev;
        return [data, ...(prev || [])];
      });
      setConversations((prev = []) => {
        const idx = prev.findIndex((c) => c.email === recipientEmail);
        if (idx !== -1) {
          const copy = [...prev];
          copy[idx].last_message = payload.body || "";
          copy[idx].last_time = payload.created_at;
          copy[idx].count = (copy[idx].count || 0) + 1;
          const [item] = copy.splice(idx, 1);
          return [item, ...copy];
        } else {
          (async () => {
            try {
              const { data: crow } = await supabase.from("card_inputs").select("name").eq("email", recipientEmail).maybeSingle();
              const newC = { email: recipientEmail, name: crow?.name || "Unknown", last_message: payload.body || "", last_time: payload.created_at, count: 1 };
              setConversations((p = []) => [newC, ...p]);
            } catch (e) {
              setConversations((p = []) => [{ email: recipientEmail, name: "Unknown", last_message: payload.body || "", last_time: payload.created_at, count: 1 }, ...p]);
            }
          })();
          return prev;
        }
      });

      setNewMessage("");
      showMessage("Message sent!", "success");
    } catch (err) {
      console.error("sendMessage", err);
      showMessage("Failed to send message", "error");
    }
  };

  useEffect(() => {
    try {
      if (messagesPanelRef.current) {
        messagesPanelRef.current.scrollTop = messagesPanelRef.current.scrollHeight;
      }
    } catch (e) {}
  }, [selectedConversation, messages]);

  // Preview handler - ONLY preview images and videos
  const handlePreview = (text, file, type, url) => {
    // ONLY preview images and videos
    if (type === "image" || type === "video") {
      setPreview({ text, file, type, url, caption: "" });
    } else {
      // Send text and audio immediately without preview
      sendMessage(selectedConversation, text, file, type);
    }
  };

  const handleSendFromPreview = () => {
    sendMessage(selectedConversation, preview.caption || preview.text, preview.file, preview.type);
    setPreview(null);
  };

  // Analysis - Connected to payment_logs table
  const fetchAnalysisData = async () => {
    setAnalysisLoading(true);
    try {
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
      const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7).toISOString();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

      const { data: payments, error } = await supabase
        .from("payment_logs")
        .select("event, amount, created_at")
        .eq("stage", "completed")
        .order("created_at", { ascending: false })
        .limit(1000);

      if (error) {
        console.error("fetchAnalysisData error:", error);
        setAnalysisData({
          dailyRevenue: 0,
          weeklyRevenue: 0,
          monthlyRevenue: 0,
          totalSubs: 0,
          dailyJobs: 0,
        });
        setAnalysisLoading(false);
        return;
      }

      let dailyRev = 0;
      let weeklyRev = 0;
      let monthlyRev = 0;
      let subsCount = 0;
      let jobsCount = 0;

      (payments || []).forEach((payment) => {
        try {
          const amt = parseFloat(payment.amount) || 0;
          const ts = new Date(payment.created_at).toISOString();
          const isSub = payment.event === "charge_success";
          const isJob = payment.event === "tip_job_done" || payment.event === "renew_job_done";

          if (ts >= todayStart) {
            dailyRev += amt;
            if (isJob) jobsCount++;
          }
          if (ts >= weekStart) weeklyRev += amt;
          if (ts >= monthStart) monthlyRev += amt;

          if (isSub) subsCount++;
        } catch (e) {
          console.warn("Analysis parse error:", e);
        }
      });

      setAnalysisData({
        dailyRevenue: dailyRev,
        weeklyRevenue: weeklyRev,
        monthlyRevenue: monthlyRev,
        totalSubs: subsCount,
        dailyJobs: jobsCount,
      });
    } catch (err) {
      console.error("fetchAnalysisData", err);
      showMessage("Failed to load analysis", "error");
    } finally {
      setAnalysisLoading(false);
    }
  };

  // ---------------- UI ----------------
  return (
    <LoadingSplash loading={initialLoading}>
      <div className="min-h-screen bg-gray-900 text-white flex">
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-20 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <aside className={`fixed inset-y-0 left-0 z-30 w-64 bg-gray-800 p-4 flex flex-col gap-4 transform transition-transform duration-300 md:relative md:translate-x-0 md:z-auto ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:block`}>
          <h1 className="text-xl font-bold">Admin Portal</h1>
          <nav className="flex flex-col gap-2">
            <button onClick={() => handleTabChange("profile")} className={`px-4 py-2 rounded text-left ${activeTab === "profile" ? "bg-blue-600" : "bg-gray-700 hover:bg-gray-600"}`}>
              Profile Manager
            </button>
            <button onClick={() => handleTabChange("posts")} className={`px-4 py-2 rounded text-left ${activeTab === "posts" ? "bg-blue-600" : "bg-gray-700 hover:bg-gray-600"}`}>
              Post Manager
            </button>
            <button onClick={() => handleTabChange("messages")} className={`px-4 py-2 rounded text-left ${activeTab === "messages" ? "bg-blue-600" : "bg-gray-700 hover:bg-gray-600"}`}>
              Messages
            </button>
            <button onClick={() => handleTabChange("analysis")} className={`px-4 py-2 rounded text-left ${activeTab === "analysis" ? "bg-blue-600" : "bg-gray-700 hover:bg-gray-600"}`}>
              Analysis
            </button>
          </nav>
          <button onClick={() => { logout(); navigate("/admin/login"); }} className="mt-auto flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded"><LogOut size={18} /> Logout</button>
        </aside>

        <div className="flex-1 p-2 overflow-y-auto w-full">
          <button 
            className="md:hidden mb-2 p-2 bg-gray-800 rounded w-full"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>

          {message.text && (
            <div className={`mb-2 p-3 rounded-lg w-full ${message.type === "success" ? "bg-green-500/20 border border-green-500 text-green-300" : "bg-red-500/20 border border-red-500 text-red-300"}`}>
              {message.text}
            </div>
          )}

          {/* PROFILE */}
          {activeTab === "profile" && (
            <div className="bg-gray-800 rounded-lg p-2 w-full">
              <h2 className="text-2xl font-bold mb-2">Profile Manager</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 w-full">
                <div className="md:col-span-2">
                  <div className="relative h-36 bg-gray-700 rounded mb-2 overflow-hidden w-full">
                    <img src={profileData.banner_url || "https://via.placeholder.com/1200x300"} alt="banner" className="w-full h-full object-cover" />
                    <div className="absolute left-4 bottom-[-36px]">
                      <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-gray-900 shadow">
                        <img src={profileData.avatar_url || "https://via.placeholder.com/160"} alt="avatar" className="w-full h-full object-cover" />
                      </div>
                    </div>
                  </div>

                  <div className="mt-10">
                    <label className="block text-gray-300 mb-1">Name</label>
                    <input value={profileData.name} onChange={(e) => setProfileData((p) => ({ ...p, name: e.target.value }))} className="w-full px-4 py-2 rounded bg-gray-700 text-white border border-gray-600" />
                    <label className="block text-gray-300 mt-2 mb-1">Handle</label>
                    <input value={profileData.handle} onChange={(e) => setProfileData((p) => ({ ...p, handle: e.target.value }))} className="w-full px-4 py-2 rounded bg-gray-700 text-white border border-gray-600" />
                    <label className="block text-gray-300 mt-2 mb-1">Bio</label>
                    <textarea value={profileData.bio} onChange={(e) => setProfileData((p) => ({ ...p, bio: e.target.value }))} rows={5} className="w-full px-4 py-2 rounded bg-gray-700 text-white border border-gray-600" />
                  </div>
                </div>

                <div className="space-y-2">
                  <div>
                    <label className="block text-gray-300 mb-1">Avatar</label>
                    <div className="mb-1">
                      <img src={profileData.avatar_url || "https://via.placeholder.com/160"} alt="avatar" className="w-28 h-28 rounded-full object-cover mb-1" />
                      <label className="inline-flex items-center gap-2 bg-blue-600 px-3 py-2 rounded cursor-pointer">
                        <Upload size={16} /> Upload Avatar
                        <input type="file" accept="image/*" onChange={handleAvatarPick} className="hidden" />
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-1">Banner</label>
                    <div className="mb-1">
                      <img src={profileData.banner_url || "https://via.placeholder.com/800x200"} alt="banner" className="w-full h-32 object-cover rounded mb-1" />
                      <label className="inline-flex items-center gap-2 bg-blue-600 px-3 py-2 rounded cursor-pointer">
                        <Upload size={16} /> Upload Banner
                        <input type="file" accept="image/*" onChange={handleBannerPick} className="hidden" />
                      </label>
                    </div>
                  </div>

                  <div>
                    <button onClick={handleProfileSave} disabled={loading} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-6 py-2 rounded">
                      <Save size={16} /> {loading ? "Saving..." : "Save Profile"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* POSTS */}
          {activeTab === "posts" && (
            <div className="bg-gray-800 rounded-lg p-2 w-full">
              <h2 className="text-2xl font-bold mb-2">Post Manager</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 w-full">
                <div className="md:col-span-2">
                  <div className="flex gap-2 mb-1">
                    <button onClick={() => setCreatingPost((c) => ({ ...c, type: "text" }))} className={`px-3 py-1 rounded ${creatingPost.type === "text" ? "bg-blue-600" : "bg-gray-700"}`}>Text</button>
                    <button onClick={() => setCreatingPost((c) => ({ ...c, type: "media" }))} className={`px-3 py-1 rounded ${creatingPost.type === "media" ? "bg-blue-600" : "bg-gray-700"}`}>Image/Video</button>
                  </div>

                  {creatingPost.type === "text" ? (
                    <textarea value={creatingPost.text} onChange={(e) => setCreatingPost((c) => ({ ...c, text: e.target.value }))} rows={4} className="w-full px-4 py-2 rounded bg-gray-700 text-white" placeholder="Text-only post content" />
                  ) : (
                    <>
                      <input type="text" value={creatingPost.mediaUrlInput} onChange={(e) => setCreatingPost((c) => ({ ...c, mediaUrlInput: e.target.value }))} className="w-full px-4 py-2 rounded bg-gray-700 text-white mb-1" placeholder="Or paste media URL (optional)" />
                      <div className="flex items-center gap-2">
                        <label className="inline-flex items-center gap-2 bg-blue-600 px-3 py-2 rounded cursor-pointer">
                          <Upload size={16} /> Upload Media
                          <input type="file" accept="image/*,video/*" onChange={(e) => setCreatingPost((c) => ({ ...c, mediaFile: e.target.files?.[0] || null }))} className="hidden" />
                        </label>
                        {creatingPost.mediaFile && <div className="text-sm">{creatingPost.mediaFile.name}</div>}
                      </div>
                      <input type="text" value={creatingPost.caption} onChange={(e) => setCreatingPost((c) => ({ ...c, caption: e.target.value }))} className="w-full px-4 py-2 rounded bg-gray-700 text-white mt-1" placeholder="Caption for media" />
                    </>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={creatingPost.locked} onChange={(e) => setCreatingPost((c) => ({ ...c, locked: e.target.checked }))} />
                    <span className="text-gray-300">Locked (requires subscription)</span>
                  </label>

                  <button onClick={handleCreateNewPost} disabled={loading} className="flex items-center gap-2 bg-blue-600 px-4 py-2 rounded">
                    <Plus size={16} /> {loading ? "Creating..." : "Create Post"}
                  </button>
                </div>
              </div>

              <h3 className="text-xl font-bold mt-2 mb-1">Existing Posts (latest 25)</h3>
              <div className="space-y-1">
                {posts.length === 0 ? <p className="text-gray-400">No posts yet.</p> : posts.map((post, idx) => (
                  <div key={post.id} className="bg-gray-700 rounded p-2 grid grid-cols-1 md:grid-cols-6 gap-2 items-start w-full">
                    <div className="md:col-span-3">
                      <input type="text" value={post.title || ""} onChange={(e) => setPosts((s) => { const c=[...s]; c[idx].title = e.target.value; return c; })} className="w-full px-3 py-2 rounded bg-gray-800 text-white mb-1" placeholder="Title" />
                      <textarea value={post.text || ""} onChange={(e) => setPosts((s) => { const c=[...s]; c[idx].text = e.target.value; return c; })} rows={3} className="w-full px-3 py-2 rounded bg-gray-800 text-white mb-1" placeholder="Caption / text" />
                      <div className="text-sm text-gray-400 mb-1">Date: {post.created_at ? new Date(post.created_at).toLocaleString() : "—"}</div>
                    </div>

                    <div className="md:col-span-2">
                      {post.media_url ? (
                        <div className="mb-1">
                          {String(post.media_url).includes(".mp4") || String(post.media_url).includes("video") ? (
                            <video src={post.media_url} controls className="w-full h-40 object-cover rounded" />
                          ) : (
                            <img src={post.media_url} alt="post media" className="w-full h-40 object-cover rounded" />
                          )}
                        </div>
                      ) : <div className="mb-1 w-full h-40 bg-gray-600 rounded flex items-center justify-center text-sm text-gray-300">No media</div> }

                      <div className="flex items-center gap-2">
                        <label className="inline-flex items-center gap-2 bg-blue-600 px-3 py-2 rounded cursor-pointer text-sm">
                          <Upload size={14} /> Replace
                          <input type="file" accept="image/*,video/*" onChange={(e) => handlePostMediaPick(idx, e)} className="hidden" />
                        </label>
                        <input type="text" value={post.media_url || ""} onChange={(e) => setPosts((s) => { const c=[...s]; c[idx].media_url = e.target.value; return c; })} className="px-3 py-1 rounded bg-gray-800 text-white flex-1 text-sm" placeholder="Or paste URL" />
                      </div>

                      <div className="mt-1 flex items-center gap-2">
                        <label className="flex items-center gap-2 text-sm">
                          <input type="checkbox" checked={post.locked === true || post.locked === "true"} onChange={(e) => setPosts((s) => { const c=[...s]; c[idx].locked = e.target.checked; return c; })} />
                          <span>Locked</span>
                        </label>
                      </div>
                    </div>

                    <div className="md:col-span-1 flex flex-col gap-1">
                      <button onClick={() => handleSavePost(idx)} disabled={loading} className="bg-green-600 hover:bg-green-700 px-3 py-2 rounded text-sm">
                        <Save size={14} /> {loading ? "Saving..." : "Save"}
                      </button>
                      <button onClick={() => handleDeletePost(post.id)} disabled={loading} className="bg-red-600 hover:bg-red-700 px-3 py-2 rounded text-sm">
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MESSAGES */}
          {activeTab === "messages" && (
            <div className="bg-gray-800 rounded-lg p-2 w-full">
              <div className="flex justify-between items-center mb-1">
                <h2 className="text-2xl font-bold">Messages</h2>
                <button onClick={fetchMessages} disabled={messagesLoading} className="bg-blue-600 px-4 py-2 rounded">
                  {messagesLoading ? "Loading..." : "Refresh"}
                </button>
              </div>

              {messagesLoading ? (
                <p className="text-gray-400">Loading...</p>
              ) : conversations.length === 0 ? (
                <p className="text-gray-400">No conversations yet.</p>
              ) : (
                <div className="flex flex-col md:flex-row gap-1 h-screen">
                  <div className={`bg-gray-700 rounded-lg p-2 overflow-y-auto ${showChat ? "hidden md:block" : "block"} flex-1 md:flex-none md:w-1/3`}>
                    <h3 className="font-bold mb-1">Conversations</h3>
                    {conversations.map((c) => (
                      <button
                        key={c.email}
                        onClick={() => { setSelectedConversation(c.email); setShowChat(true); }}
                        className={`w-full text-left p-2 rounded mb-1 ${selectedConversation === c.email ? 'bg-blue-600' : 'bg-gray-600 hover:bg-gray-500'}`}
                      >
                        <div className="text-sm font-semibold">{c.email}</div>
                        <div className="text-xs text-gray-300 truncate">{c.last_message}</div>
                        <div className="text-xs text-gray-400 mt-1">{c.count} messages • {c.last_time ? new Date(c.last_time).toLocaleString() : ""}</div>
                      </button>
                    ))}
                  </div>

                  <div className={`flex-1 flex flex-col bg-gray-700 rounded-lg overflow-hidden ${showChat ? "block" : "hidden md:flex"}`}>
                    {selectedConversation ? (
                      <>
                        <div className="p-2 flex items-center gap-3">
                          <button onClick={() => setShowChat(false)} className="md:hidden text-white mr-2">
                            <ArrowLeft size={20} />
                          </button>
                          <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-sm text-white">{(selectedConversation || "U").slice(0,1)}</div>
                          <div>
                            <div className="text-sm font-semibold">{selectedConversation}</div>
                          </div>
                        </div>

                        <div className="flex-1 p-2 overflow-y-auto" ref={messagesPanelRef}>
                          {messages
                            .filter((m) => m.from_email === selectedConversation)
                            .sort((a,b) => new Date(a.created_at) - new Date(b.created_at))
                            .map((msg) => (
                              <div key={msg.id || `${msg.created_at}-${Math.random()}`} className={`mb-2 pb-2 last:border-0 ${msg.sender_type === "admin" ? 'flex justify-end' : 'flex justify-start'}`}>
                                <div className={`max-w-[80%] p-2 rounded-lg ${msg.sender_type === "admin" ? 'bg-[#3498db] text-white' : 'bg-[#34495e] text-white'}`}>
                                  <div className="flex justify-between items-start mb-1">
                                    <span className="text-xs text-gray-200">{msg.sender_type === "admin" ? profileData.name : selectedConversation}</span>
                                    <span className="text-xs text-gray-300">{msg.created_at ? new Date(msg.created_at).toLocaleString() : ""}</span>
                                  </div>
                                  <p className="text-white">{msg.body || ""}</p>
                                  {msg.media_url && (
                                    <div className="mt-1">
                                      {msg.message_type === "audio" ? (
                                        <audio src={msg.media_url} controls className="w-full" />
                                      ) : msg.message_type === "video" ? (
                                        <video src={msg.media_url} controls className="w-full rounded" />
                                      ) : (
                                        <img src={msg.media_url} alt="attachment" className="w-full rounded object-cover" />
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))
                          }
                        </div>

                        <div className="p-2 bg-gray-800">
                          <MessageInput
                            onPreview={handlePreview}
                          />
                        </div>
                      </>
                    ) : (
                      <p className="flex-1 flex items-center justify-center text-gray-400">Select a conversation to view</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {preview && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 overflow-y-auto">
              <div className="bg-gray-800 p-4 rounded w-full max-w-md">
                <h3 className="text-lg font-bold mb-2">Preview</h3>
                {preview.type === "text" ? (
                  <p>{preview.text}</p>
                ) : preview.type === "audio" ? (
                  <audio src={preview.url} controls className="w-full mb-2" />
                ) : preview.type === "video" ? (
                  <video src={preview.url} controls className="w-full mb-2" />
                ) : (
                  <img src={preview.url} alt="preview" className="w-full mb-2" />
                )}
                <input
                  type="text"
                  placeholder="Add caption..."
                  value={preview.caption}
                  onChange={(e) => setPreview({ ...preview, caption: e.target.value })}
                  className="w-full px-3 py-2 rounded bg-gray-700 text-white mb-2"
                />
                <div className="flex gap-2">
                  <button onClick={() => setPreview(null)} className="bg-red-600 px-4 py-2 rounded">Cancel</button>
                  <button onClick={handleSendFromPreview} className="bg-blue-600 px-4 py-2 rounded">Send</button>
                </div>
              </div>
            </div>
          )}

          {/* ANALYSIS */}
          {activeTab === "analysis" && (
            <div className="bg-gray-800 rounded-lg p-2 w-full">
              <div className="flex justify-between items-center mb-1">
                <h2 className="text-2xl font-bold">Analysis</h2>
                <button onClick={fetchAnalysisData} disabled={analysisLoading} className="bg-blue-600 px-4 py-2 rounded">
                  {analysisLoading ? "Loading..." : "Refresh"}
                </button>
              </div>

              {analysisLoading ? (
                <p className="text-gray-400">Loading analysis...</p>
              ) : (
                <div className="space-y-1">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
                    <div className="bg-gray-700 p-4 rounded">
                      <h3 className="text-sm text-gray-300">Daily Revenue</h3>
                      <p className="text-2xl font-bold">${analysisData.dailyRevenue.toFixed(2)}</p>
                    </div>
                    <div className="bg-gray-700 p-4 rounded">
                      <h3 className="text-sm text-gray-300">Weekly Revenue</h3>
                      <p className="text-2xl font-bold">${analysisData.weeklyRevenue.toFixed(2)}</p>
                    </div>
                    <div className="bg-gray-700 p-4 rounded">
                      <h3 className="text-sm text-gray-300">Monthly Revenue</h3>
                      <p className="text-2xl font-bold">${analysisData.monthlyRevenue.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                    <div className="bg-gray-700 p-4 rounded">
                      <h3 className="text-sm text-gray-300">Total Subscribers</h3>
                      <p className="text-2xl font-bold">{analysisData.totalSubs}</p>
                    </div>
                    <div className="bg-gray-700 p-4 rounded">
                      <h3 className="text-sm text-gray-300">Daily Jobs Completed</h3>
                      <p className="text-2xl font-bold">{analysisData.dailyJobs}</p>
                    </div>
                  </div>
                  <div className="bg-gray-700 p-4 rounded">
                    <h3 className="text-sm text-gray-300 mb-1">Revenue Trend (Last 7 Days)</h3>
                    <div className="h-40 bg-gray-600 rounded flex items-center justify-center text-gray-400">
                      [Chart Placeholder - Integrate Chart.js or similar for bar graph]
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </LoadingSplash>
  );
}

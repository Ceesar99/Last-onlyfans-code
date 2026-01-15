// AdminLayout.jsx - WITH SAMPLE POSTS SUPPORT
import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/Authcontext";
import { useNavigate } from "react-router-dom";
import { LogOut, Upload, Plus, Save, Menu, ArrowLeft, Camera, Image as GalleryIcon, Mic, Star } from "lucide-react";
import supabase from "../supabaseclient";

const PROFILE_HANDLE_DEFAULT = "@taylerhillxxx";

// MessageInput component (unchanged)
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
    <div className="flex items-center gap-2 bg-gray-700 rounded-full px-3 py-2">
      <button onClick={handleCamera} className="text-gray-300 hover:text-white">
        <Camera className="w-5 h-5" />
      </button>
      <button onClick={handleGallery} className="text-gray-300 hover:text-white">
        <GalleryIcon className="w-5 h-5" />
      </button>
      {isRecording && <span className="text-red-500 text-xs">Recording... {recordingTime}s</span>}
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
        className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-400"
      />
      <button
        onClick={isRecording ? handleStopMic : handleStartMic}
        className={`${isRecording ? "text-red-500" : "text-gray-300"} hover:text-white`}
      >
        <Mic className="w-5 h-5" />
      </button>
      <button onClick={handleSend} className="text-blue-500 hover:text-blue-400 font-semibold">
        Send
      </button>
    </div>
  );
}

export default function AdminLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
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
  const [profileFiles, setProfileFiles] = useState({
    avatarFile: null,
    avatarPreview: null,
    bannerFile: null,
    bannerPreview: null
  });

  // Posts - NEW: Add filter state
  const [posts, setPosts] = useState([]);
  const [postFilter, setPostFilter] = useState("all"); // "all" | "sample" | "regular"
  const [creatingPost, setCreatingPost] = useState({
    type: "text",
    text: "",
    caption: "",
    mediaFile: null,
    mediaUrlInput: "",
    locked: true,
  });

  // Messages & Conversations (unchanged)
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const messagesPanelRef = useRef(null);
  const [preview, setPreview] = useState(null);

  // Analysis (unchanged)
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
    fetchProfileData();
    fetchPosts();
    fetchMessages();
    fetchAnalysisData();

    return () => {
      createdObjectUrls.current.forEach((u) => {
        try {
          URL.revokeObjectURL(u);
        } catch (e) {}
      });
      if (sidebarTimeoutRef.current) clearTimeout(sidebarTimeoutRef.current);
    };
  }, []);

  const showMessage = (txt, type = "success", ms = 2500) => {
    setMessage({ text: txt, type });
    setTimeout(() => setMessage({ text: "", type: "" }), ms);
  };

  // Sidebar auto-close
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

  // Profile functions (unchanged)
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

  // Posts - UPDATED: Fetch with sample post info
  const fetchPosts = async () => {
    try {
      const handle = profileData.handle.replace(/^@/, "");
      
      let query = supabase
        .from("posts")
        .select("*")
        .eq("creator_handle", handle);

      // Apply filter
      if (postFilter === "sample") {
        query = query.eq("is_sample", true);
      } else if (postFilter === "regular") {
        query = query.or("is_sample.is.null,is_sample.eq.false");
      }

      query = query.order("is_sample", { ascending: false }) // Sample posts first
        .order("sample_order", { ascending: true, nullsFirst: false })
        .order("created_at", { ascending: false })
        .limit(100);

      const { data, error } = await query;

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

  // Refetch when filter changes
  useEffect(() => {
    if (activeTab === "posts") {
      fetchPosts();
    }
  }, [postFilter, activeTab]);

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
        // Preserve sample post metadata
        is_sample: post.is_sample || false,
        sample_order: post.sample_order || null,
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
        is_sample: false, // New posts are not sample posts
        sample_order: null,
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
      setCreatingPost({
        type: "text",
        text: "",
        caption: "",
        mediaFile: null,
        mediaUrlInput: "",
        locked: true
      });
      await fetchPosts();
    } catch (err) {
      console.error("handleCreateNewPost", err);
      showMessage("Failed to create post", "error");
    } finally {
      setLoading(false);
    }
  };

  // Messages functions (unchanged - keeping original code)
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
        try {
          supabase.removeChannel(messagesChannelRef.current);
        } catch (e) {}
        messagesChannelRef.current = null;
      }

      const channel = supabase
        .channel(`messages-realtime-${cleanHandle}`)
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'messages'
        }, (payload) => {
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
                  setConversations((prev2 = []) => [{
                    email: newMsg.from_email,
                    name: "Unknown",
                    last_message: newMsg.body || "",
                    last_time: new Date(newMsg.created_at).toISOString(),
                    count: 1
                  }, ...prev2]);
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
              const newC = {
                email: recipientEmail,
                name: crow?.name || "Unknown",
                last_message: payload.body || "",
                last_time: payload.created_at,
                count: 1
              };
              setConversations((p = []) => [newC, ...p]);
            } catch (e) {
              setConversations((p = []) => [{
                email: recipientEmail,
                name: "Unknown",
                last_message: payload.body || "",
                last_time: payload.created_at,
                count: 1
              }, ...p]);
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

  const handlePreview = (text, file, type, url) => {
    setPreview({ text, file, type, url, caption: "" });
  };

  const handleSendFromPreview = () => {
    sendMessage(selectedConversation, preview.caption || preview.text, preview.file, preview.type);
    setPreview(null);
  };

  // Analysis (unchanged)
  const fetchAnalysisData = async () => {
    setAnalysisLoading(true);
    try {
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
      const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7).toISOString();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

      const { data: vaults, error } = await supabase
        .from("vault")
        .select("id, data, created_at")
        .in("event", ["charge_success", "tip_job_done", "renew_job_done"])
        .order("created_at", { ascending: false })
        .limit(500);

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

      (vaults || []).forEach((v) => {
        try {
          const dec = JSON.parse(v.data);
          const amt = parseFloat(dec.amount) || 0;
          const ts = new Date(v.created_at).toISOString();
          const isSub = dec.event.includes("charge_success");
          const isJob = dec.event.includes("job_done");

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

  return (
    <div className="flex h-screen bg-gray-900 text-white overflow-hidden">
      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 fixed md:static inset-y-0 left-0 z-50 w-64 bg-gray-800 p-4 flex flex-col gap-4 transition-transform duration-300`}
      >
        <h1 className="text-2xl font-bold mb-4">Admin Portal</h1>
        <button
          onClick={() => handleTabChange("profile")}
          className={`px-4 py-2 rounded text-left ${activeTab === "profile" ? "bg-blue-600" : "bg-gray-700 hover:bg-gray-600"}`}>
          Profile Manager
        </button>
        <button
          onClick={() => handleTabChange("posts")}
          className={`px-4 py-2 rounded text-left ${activeTab === "posts" ? "bg-blue-600" : "bg-gray-700 hover:bg-gray-600"}`}>
          Post Manager
        </button>
        <button
          onClick={() => handleTabChange("messages")}
          className={`px-4 py-2 rounded text-left ${activeTab === "messages" ? "bg-blue-600" : "bg-gray-700 hover:bg-gray-600"}`}>
          Messages
        </button>
        <button
          onClick={() => handleTabChange("analysis")}
          className={`px-4 py-2 rounded text-left ${activeTab === "analysis" ? "bg-blue-600" : "bg-gray-700 hover:bg-gray-600"}`}>
          Analysis
        </button>
        <button
          onClick={() => {
            logout();
            navigate("/admin/login");
          }}
          className="mt-auto flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded">
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </aside>

      {/* Hamburger */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="md:hidden fixed top-4 left-4 z-30 bg-gray-800 p-2 rounded-lg text-white"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Message Toast */}
      {message.text && (
        <div
          className={`fixed top-4 right-4 px-6 py-3 rounded shadow-lg z-50 ${
            message.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}>
          {message.text}
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6">
        {/* PROFILE TAB */}
        {activeTab === "profile" && (
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl font-bold">Profile Manager</h2>

            <div className="bg-gray-800 rounded-lg p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Avatar</label>
                <div className="flex items-center gap-4">
                  {profileData.avatar_url && (
                    <img src={profileData.avatar_url} alt="Avatar" className="w-20 h-20 rounded-full object-cover" />
                  )}
                  <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded flex items-center gap-2">
                    <Upload className="w-5 h-5" />
                    Upload Avatar
                    <input type="file" accept="image/*" onChange={handleAvatarPick} className="hidden" />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Banner</label>
                <div className="space-y-2">
                  {profileData.banner_url && (
                    <img src={profileData.banner_url} alt="Banner" className="w-full h-40 object-cover rounded" />
                  )}
                  <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded flex items-center gap-2 w-fit">
                    <Upload className="w-5 h-5" />
                    Upload Banner
                    <input type="file" accept="image/*" onChange={handleBannerPick} className="hidden" />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData((p) => ({ ...p, name: e.target.value }))}
                  className="w-full px-4 py-2 rounded bg-gray-700 text-white border border-gray-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Handle</label>
                <input
                  type="text"
                  value={profileData.handle}
                  onChange={(e) => setProfileData((p) => ({ ...p, handle: e.target.value }))}
                  className="w-full px-4 py-2 rounded bg-gray-700 text-white border border-gray-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Bio</label>
                <textarea
                  value={profileData.bio}
                  onChange={(e) => setProfileData((p) => ({ ...p, bio: e.target.value }))}
                  rows={5}
                  className="w-full px-4 py-2 rounded bg-gray-700 text-white border border-gray-600"
                />
              </div>

              <button
                onClick={handleProfileSave}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 px-6 py-3 rounded font-semibold flex items-center gap-2">
                <Save className="w-5 h-5" />
                {loading ? "Saving..." : "Save Profile"}
              </button>
            </div>
          </div>
        )}

        {/* POSTS TAB - UPDATED WITH FILTER */}
        {activeTab === "posts" && (
          <div className="max-w-5xl mx-auto space-y-6">
            <h2 className="text-3xl font-bold">Post Manager</h2>

            {/* NEW: Post Filter Controls */}
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">Filter Posts:</span>
                <button
                  onClick={() => setPostFilter("all")}
                  className={`px-4 py-2 rounded ${postFilter === "all" ? "bg-blue-600" : "bg-gray-700 hover:bg-gray-600"}`}>
                  All Posts ({posts.length})
                </button>
                <button
                  onClick={() => setPostFilter("sample")}
                  className={`px-4 py-2 rounded flex items-center gap-2 ${postFilter === "sample" ? "bg-blue-600" : "bg-gray-700 hover:bg-gray-600"}`}>
                  <Star className="w-4 h-4 text-yellow-400" />
                  Sample Posts Only
                </button>
                <button
                  onClick={() => setPostFilter("regular")}
                  className={`px-4 py-2 rounded ${postFilter === "regular" ? "bg-blue-600" : "bg-gray-700 hover:bg-gray-600"}`}>
                  Regular Posts Only
                </button>
              </div>
            </div>

            {/* Create New Post */}
            <div className="bg-gray-800 rounded-lg p-6 space-y-4">
              <h3 className="text-xl font-semibold">Create New Post</h3>

              <div className="flex gap-2">
                <button
                  onClick={() => setCreatingPost((c) => ({ ...c, type: "text" }))}
                  className={`px-3 py-1 rounded ${creatingPost.type === "text" ? "bg-blue-600" : "bg-gray-700"}`}>
                  Text
                </button>
                <button
                  onClick={() => setCreatingPost((c) => ({ ...c, type: "media" }))}
                  className={`px-3 py-1 rounded ${creatingPost.type === "media" ? "bg-blue-600" : "bg-gray-700"}`}>
                  Image/Video
                </button>
              </div>

              {creatingPost.type === "text" ? (
                <textarea
                  value={creatingPost.text}
                  onChange={(e) => setCreatingPost((c) => ({ ...c, text: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-2 rounded bg-gray-700 text-white"
                  placeholder="Text-only post content"
                />
              ) : (
                <>
                  <input
                    type="text"
                    value={creatingPost.mediaUrlInput}
                    onChange={(e) => setCreatingPost((c) => ({ ...c, mediaUrlInput: e.target.value }))}
                    className="w-full px-4 py-2 rounded bg-gray-700 text-white mb-1"
                    placeholder="Or paste media URL (optional)"
                  />

                  <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded inline-flex items-center gap-2">
                    <Upload className="w-5 h-5" />
                    Upload Media
                    <input
                      type="file"
                      accept="image/*,video/*"
                      onChange={(e) => setCreatingPost((c) => ({ ...c, mediaFile: e.target.files?.[0] || null }))}
                      className="hidden"
                    />
                  </label>
                  {creatingPost.mediaFile && <p className="text-sm text-gray-400">{creatingPost.mediaFile.name}</p>}

                  <textarea
                    value={creatingPost.caption}
                    onChange={(e) => setCreatingPost((c) => ({ ...c, caption: e.target.value }))}
                    className="w-full px-4 py-2 rounded bg-gray-700 text-white mt-1"
                    placeholder="Caption for media"
                  />
                </>
              )}

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={creatingPost.locked}
                  onChange={(e) => setCreatingPost((c) => ({ ...c, locked: e.target.checked }))}
                />
                Locked (requires subscription)
              </label>

              <button
                onClick={handleCreateNewPost}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 px-6 py-3 rounded font-semibold flex items-center gap-2">
                <Plus className="w-5 h-5" />
                {loading ? "Creating..." : "Create Post"}
              </button>
            </div>

            {/* Existing Posts */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">
                Existing Posts 
                {postFilter === "sample" && " - Sample Posts"}
                {postFilter === "regular" && " - Regular Posts"}
              </h3>

              {posts.length === 0 ? (
                <div className="bg-gray-800 rounded-lg p-6 text-center text-gray-400">
                  No posts yet.
                </div>
              ) : (
                posts.map((post, idx) => (
                  <div key={post.id} className="bg-gray-800 rounded-lg p-6 space-y-4">
                    {/* NEW: Sample Post Badge */}
                    {post.is_sample && (
                      <div className="flex items-center gap-2 bg-yellow-900/30 border border-yellow-600 rounded px-3 py-2 mb-2">
                        <Star className="w-5 h-5 text-yellow-400" />
                        <span className="text-yellow-400 font-semibold">
                          Sample Post #{post.sample_order} (Unlocked for Free Trial Users)
                        </span>
                      </div>
                    )}

                    <input
                      type="text"
                      value={post.title || ""}
                      onChange={(e) =>
                        setPosts((s) => {
                          const c = [...s];
                          c[idx].title = e.target.value;
                          return c;
                        })
                      }
                      className="w-full px-3 py-2 rounded bg-gray-700 text-white mb-1"
                      placeholder="Title"
                    />

                    <textarea
                      value={post.text || ""}
                      onChange={(e) =>
                        setPosts((s) => {
                          const c = [...s];
                          c[idx].text = e.target.value;
                          return c;
                        })
                      }
                      rows={3}
                      className="w-full px-3 py-2 rounded bg-gray-700 text-white mb-1"
                      placeholder="Caption / text"
                    />

                    <p className="text-sm text-gray-400">
                      Date: {post.created_at ? new Date(post.created_at).toLocaleString() : "—"}
                    </p>

                    {post.media_url ? (
                      <div className="space-y-2">
                        {String(post.media_url).includes(".mp4") || String(post.media_url).includes("video") ? (
                          <video src={post.media_url} controls className="w-full rounded max-h-64" />
                        ) : (
                          <img src={post.media_url} alt="Post media" className="w-full rounded max-h-64 object-cover" />
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400">No media</p>
                    )}

                    <div className="flex gap-2 items-center">
                      <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm">
                        Replace
                        <input
                          type="file"
                          accept="image/*,video/*"
                          onChange={(e) => handlePostMediaPick(idx, e)}
                          className="hidden"
                        />
                      </label>
                      <input
                        type="text"
                        value={post.media_url || ""}
                        onChange={(e) =>
                          setPosts((s) => {
                            const c = [...s];
                            c[idx].media_url = e.target.value;
                            return c;
                          })
                        }
                        className="px-3 py-1 rounded bg-gray-700 text-white flex-1 text-sm"
                        placeholder="Or paste URL"
                      />
                    </div>

                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={post.locked}
                        onChange={(e) =>
                          setPosts((s) => {
                            const c = [...s];
                            c[idx].locked = e.target.checked;
                            return c;
                          })
                        }
                      />
                      Locked
                    </label>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSavePost(idx)}
                        disabled={loading}
                        className="bg-green-600 hover:bg-green-700 px-3 py-2 rounded text-sm">
                        <Save className="w-4 h-4 inline mr-1" />
                        Save
                      </button>
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        disabled={loading}
                        className="bg-red-600 hover:bg-red-700 px-3 py-2 rounded text-sm">
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* MESSAGES TAB - (Unchanged) */}
        {activeTab === "messages" && (
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold">Messages</h2>
              <button
                onClick={fetchMessages}
                disabled={messagesLoading}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded">
                {messagesLoading ? "Loading..." : "Refresh"}
              </button>
            </div>

            {messagesLoading ? (
              <div className="bg-gray-800 rounded-lg p-6 text-center">
                <p>Loading...</p>
              </div>
            ) : conversations.length === 0 ? (
              <div className="bg-gray-800 rounded-lg p-6 text-center text-gray-400">
                <p>No conversations yet.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-4 h-[calc(100vh-180px)]">
                {/* Conversations List */}
                <div className={`${showChat ? "hidden md:block" : "block"} md:col-span-1 bg-gray-800 rounded-lg p-4 overflow-y-auto`}>
                  <h3 className="text-lg font-semibold mb-4">Conversations</h3>
                  {conversations.map((c) => (
                    <button
                      key={c.email}
                      onClick={() => {
                        setSelectedConversation(c.email);
                        setShowChat(true);
                      }}
                      className={`w-full text-left p-2 rounded mb-1 ${
                        selectedConversation === c.email ? "bg-blue-600" : "bg-gray-600 hover:bg-gray-500"
                      }`}>
                      <p className="font-semibold">{c.name}</p>
                      <p className="text-sm text-gray-300">{c.email}</p>
                      <p className="text-sm text-gray-400 truncate">{c.last_message}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {c.count} messages • {c.last_time ? new Date(c.last_time).toLocaleString() : ""}
                      </p>
                    </button>
                  ))}
                </div>

                {/* Messages Panel */}
                <div className={`${showChat ? "block" : "hidden md:block"} md:col-span-2 bg-gray-800 rounded-lg flex flex-col`}>
                  {selectedConversation ? (
                    <>
                      <div className="p-4 border-b border-gray-700 flex items-center gap-3">
                        <button onClick={() => setShowChat(false)} className="md:hidden text-white mr-2">
                          <ArrowLeft className="w-6 h-6" />
                        </button>
                        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                          {(selectedConversation || "U").slice(0, 1)}
                        </div>
                        <div>
                          <p className="font-semibold">{selectedConversation}</p>
                        </div>
                      </div>

                      <div ref={messagesPanelRef} className="flex-1 overflow-y-auto p-4 space-y-3">
                        {messages
                          .filter((m) => m.from_email === selectedConversation)
                          .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
                          .map((msg) => (
                            <div
                              key={msg.id}
                              className={`p-3 rounded-lg ${
                                msg.sender_type === "admin" ? "bg-blue-700 ml-auto" : "bg-gray-700"
                              } max-w-[80%] ${msg.sender_type === "admin" ? "text-right" : "text-left"}`}>
                              <p className="text-xs text-gray-300 mb-1">
                                {msg.sender_type === "admin" ? profileData.name : selectedConversation}
                                {" • "}
                                {msg.created_at ? new Date(msg.created_at).toLocaleString() : ""}
                              </p>
                              {msg.body && <p className="text-white">{msg.body}</p>}
                              {msg.media_url && (
                                <div className="mt-2">
                                  {msg.message_type === "audio" ? (
                                    <audio src={msg.media_url} controls className="w-full" />
                                  ) : msg.message_type === "video" ? (
                                    <video src={msg.media_url} controls className="w-full rounded max-h-48" />
                                  ) : (
                                    <img src={msg.media_url} alt="Attachment" className="rounded max-h-48" />
                                  )}
                                </div>
                              )}
                            </div>
                          ))}
                      </div>

                      <div className="p-4 border-t border-gray-700">
                        <MessageInput onPreview={handlePreview} />
                      </div>
                    </>
                  ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-400">
                      <p>Select a conversation to view</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Preview Modal */}
        {preview && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg p-6 max-w-lg w-full space-y-4">
              <h3 className="text-xl font-bold">Preview</h3>
              {preview.type === "text" ? (
                <p className="text-white">{preview.text}</p>
              ) : preview.type === "audio" ? (
                <audio src={preview.url} controls className="w-full" />
              ) : preview.type === "video" ? (
                <video src={preview.url} controls className="w-full rounded max-h-64" />
              ) : (
                <img src={preview.url} alt="Preview" className="w-full rounded max-h-64 object-contain" />
              )}
              <textarea
                value={preview.caption}
                onChange={(e) => setPreview({ ...preview, caption: e.target.value })}
                className="w-full px-3 py-2 rounded bg-gray-700 text-white mb-2"
                placeholder="Add a caption (optional)"
              />
              <div className="flex gap-2">
                <button onClick={() => setPreview(null)} className="bg-red-600 px-4 py-2 rounded">
                  Cancel
                </button>
                <button onClick={handleSendFromPreview} className="bg-green-600 px-4 py-2 rounded">
                  Send
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ANALYSIS TAB - (Unchanged) */}
        {activeTab === "analysis" && (
          <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold">Analysis</h2>
              <button
                onClick={fetchAnalysisData}
                disabled={analysisLoading}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded">
                {analysisLoading ? "Loading..." : "Refresh"}
              </button>
            </div>

            {analysisLoading ? (
              <div className="bg-gray-800 rounded-lg p-6 text-center">
                <p>Loading analysis...</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-gray-800 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-2">Daily Revenue</h3>
                  <p className="text-3xl font-bold text-green-400">${analysisData.dailyRevenue.toFixed(2)}</p>
                </div>

                <div className="bg-gray-800 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-2">Weekly Revenue</h3>
                  <p className="text-3xl font-bold text-green-400">${analysisData.weeklyRevenue.toFixed(2)}</p>
                </div>

                <div className="bg-gray-800 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-2">Monthly Revenue</h3>
                  <p className="text-3xl font-bold text-green-400">${analysisData.monthlyRevenue.toFixed(2)}</p>
                </div>

                <div className="bg-gray-800 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-2">Total Subscribers</h3>
                  <p className="text-3xl font-bold text-blue-400">{analysisData.totalSubs}</p>
                </div>

                <div className="bg-gray-800 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-2">Daily Jobs Completed</h3>
                  <p className="text-3xl font-bold text-purple-400">{analysisData.dailyJobs}</p>
                </div>

                <div className="bg-gray-800 rounded-lg p-6 md:col-span-2 lg:col-span-3">
                  <h3 className="text-lg font-semibold mb-4">Revenue Trend (Last 7 Days)</h3>
                  <p className="text-gray-400">[Chart Placeholder - Integrate Chart.js or similar for bar graph]</p>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

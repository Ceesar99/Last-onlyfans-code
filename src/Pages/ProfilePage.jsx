// ProfilePage.jsx - NUCLEAR OPTION (NO IMPORTS)
import React, { useState } from "react";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("posts");
  const [bioExpanded, setBioExpanded] = useState(false);

  const creator = {
    name: "Tayler Hills",
    avatar: "https://hyaulauextrzdaykkqre.supabase.co/storage/v1/object/public/uploads/posts/1760699188347-6c2tnk-images%20(9).jpeg",
    banner: "https://hyaulauextrzdaykkqre.supabase.co/storage/v1/object/public/uploads/posts/1760699444010-y1kcnl-Screenshot_20251017-121026.jpg",
    handle: "@taylerhillxxx",
    bio: "Hi 😊 I'm your favorite 19 year old & I love showing all of ME for your pleasure; ) you'll love it here! 🍆💦",
  };

  const posts = [
    { id: 1, text: "Come closer, I've got secrets that'll make you blush 😏", date: "Sep 29", likes: 850000 },
    { id: 2, text: "This dress is tight, but my thoughts about you are even tighter 🔥", date: "Sep 28", likes: 920000 },
    { id: 3, text: "Curves ahead—handle with care, or don't... I like it rough 😉", date: "Sep 27", likes: 780000 },
    { id: 4, text: "Whisper your fantasies in my ear, and I'll make them reality 💋", date: "Sep 26", likes: 890000 },
    { id: 5, text: "Feeling naughty today. What's your wildest desire? 🌶️", date: "Sep 25", likes: 950000 },
  ];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f3f4f6", display: "flex", justifyContent: "center", padding: "16px" }}>
      <div style={{ width: "100%", maxWidth: "672px", backgroundColor: "white", borderRadius: "6px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", fontSize: "15px", maxHeight: "calc(100vh - 32px)", overflowY: "auto" }}>
        
        {/* BANNER */}
        <div style={{ position: "relative", height: "144px", backgroundColor: "#e5e7eb", overflow: "hidden" }}>
          <img src={creator.banner} alt="banner" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <div style={{ position: "absolute", left: "12px", top: "12px", display: "flex", gap: "16px", color: "white", fontSize: "12px", fontWeight: "600" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ fontWeight: "bold" }}>3.1K</div>
              <div style={{ fontSize: "10px", opacity: "0.8" }}>Posts</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ fontWeight: "bold" }}>2.9k</div>
              <div style={{ fontSize: "10px", opacity: "0.8" }}>Media</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ fontWeight: "bold" }}>5.57M</div>
              <div style={{ fontSize: "10px", opacity: "0.8" }}>Likes</div>
            </div>
          </div>
        </div>

        {/* AVATAR */}
        <div style={{ padding: "0 16px", marginTop: "-40px", display: "flex", alignItems: "flex-start" }}>
          <div style={{ position: "relative" }}>
            <div style={{ width: "80px", height: "80px", borderRadius: "50%", overflow: "hidden", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>
              <img src={creator.avatar} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div style={{ position: "absolute", right: "0", bottom: "0", width: "16px", height: "16px", backgroundColor: "#10b981", borderRadius: "50%" }} />
          </div>
        </div>

        {/* NAME & MESSAGE */}
        <div style={{ padding: "8px 16px 0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h2 style={{ fontSize: "18px", fontWeight: "bold", color: "#111827", margin: 0 }}>{creator.name}</h2>
            <div style={{ fontSize: "13px", color: "#6b7280" }}>{creator.handle} · Available now</div>
          </div>
          <button style={{ backgroundColor: "#00AFF0", color: "white", fontSize: "14px", fontWeight: "600", borderRadius: "20px", padding: "8px 24px", border: "none", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", cursor: "pointer" }}>
            Message
          </button>
        </div>

        {/* BIO */}
        <div style={{ padding: "12px 16px", borderTop: "1px solid #e5e7eb", marginTop: "12px" }}>
          <div style={{ fontSize: "14px", lineHeight: "1.5", color: "#1f2937", overflow: "hidden", textOverflow: "ellipsis", display: bioExpanded ? "block" : "-webkit-box", WebkitLineClamp: bioExpanded ? "unset" : "2", WebkitBoxOrient: "vertical" }}>
            <p style={{ margin: 0 }}>{creator.bio}</p>
          </div>
          <button onClick={() => setBioExpanded(!bioExpanded)} style={{ fontSize: "13px", color: "#3b82f6", textDecoration: "underline", marginTop: "8px", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
            {bioExpanded ? "Collapse" : "More info"}
          </button>
        </div>

        {/* SUBSCRIPTION */}
        <div style={{ padding: "0 16px", marginTop: "16px" }}>
          <div style={{ backgroundColor: "white", padding: "16px", borderRadius: "6px", border: "1px solid #e5e7eb" }}>
            <div style={{ fontSize: "11px", fontWeight: "600", color: "#6b7280" }}>SUBSCRIPTION</div>
            <div style={{ marginTop: "4px", fontSize: "14px", fontWeight: "500", color: "#1f2937" }}>Limited offer - Free trial for 30 days!</div>
            
            <div style={{ marginTop: "12px", backgroundColor: "#f3f4f6", borderRadius: "6px", padding: "12px", display: "flex", alignItems: "flex-start", gap: "12px" }}>
              <div style={{ width: "32px", height: "32px", borderRadius: "50%", overflow: "hidden" }}>
                <img src={creator.avatar} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div style={{ fontSize: "14px", color: "#374151" }}>I'm Always Hornyyyyyy 🤤💦</div>
            </div>

            <div style={{ marginTop: "16px" }}>
              <button style={{ width: "100%", borderRadius: "20px", padding: "12px 16px", fontWeight: "600", color: "white", backgroundColor: "#00AFF0", border: "none", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}>
                <span>SUBSCRIBE</span>
                <span style={{ fontSize: "14px", whiteSpace: "nowrap" }}>FREE for 30 days</span>
              </button>
            </div>

            <div style={{ fontSize: "11px", color: "#6b7280", marginTop: "8px" }}>Regular price $5 / month</div>
          </div>
        </div>

        {/* TABS */}
        <div style={{ marginTop: "16px", borderTop: "1px solid #e5e7eb" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", backgroundColor: "white", fontSize: "14px", fontWeight: "500" }}>
            <button onClick={() => setActiveTab("posts")} style={{ padding: "12px 0", borderBottom: activeTab === "posts" ? "2px solid black" : "none", color: activeTab === "posts" ? "black" : "#6b7280", background: "none", border: "none", cursor: "pointer" }}>
              {posts.length} POSTS
            </button>
            <button onClick={() => setActiveTab("media")} style={{ padding: "12px 0", borderBottom: activeTab === "media" ? "2px solid black" : "none", color: activeTab === "media" ? "black" : "#6b7280", background: "none", border: "none", cursor: "pointer" }}>
              0 MEDIA
            </button>
          </div>
        </div>

        {/* POSTS */}
        <div style={{ backgroundColor: "white", padding: "16px" }}>
          {activeTab === "posts" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              {posts.map((p) => (
                <article key={p.id} style={{ borderBottom: "1px solid #e5e7eb", paddingBottom: "16px" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "50%", overflow: "hidden" }}>
                      <img src={creator.avatar} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                    <div style={{ flex: "1" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div>
                          <div style={{ fontWeight: "600", fontSize: "14px", color: "#111827" }}>{creator.name}</div>
                          <div style={{ fontSize: "12px", color: "#6b7280" }}>{creator.handle} · {p.date}</div>
                        </div>
                        <div style={{ color: "#9ca3af" }}>•••</div>
                      </div>
                      <p style={{ marginTop: "8px", fontSize: "14px", color: "#1f2937" }}>{p.text}</p>
                      <div style={{ marginTop: "12px", display: "flex", alignItems: "center", gap: "16px", color: "#6b7280", fontSize: "13px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span>❤️</span>
                          <span>{(p.likes / 1000).toFixed(0)}k</span>
                        </div>
                        <div>Comment</div>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {activeTab === "media" && (
            <div style={{ textAlign: "center", color: "#6b7280", padding: "32px 0" }}>
              No media yet
            </div>
          )}
        </div>

      </div>
    </div>
  );
                         }nst IconHeart = ({ className = "w-5 h-5", active = false }) => (
    <svg className={className} viewBox="0 0 24 24" fill={active ? "#e0245e" : "none"} xmlns="http://www.w3.org/2000/svg" stroke={active ? "#e0245e" : "#9AA3AD"}>
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" strokeWidth="1.2"/>
    </svg>
  );

  const formatLikes = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
    if (num >= 1000) return Math.floor(num / 1000) + "k";
    return String(num);
  };

  const toggleLike = (id) => {
    const postId = String(id);
    setLikedPosts((prev) => ({ ...prev, [postId]: !prev[postId] }));
    setLikeCounts((prev) => ({
      ...prev,
      [postId]: prev[postId] ? prev[postId] + (likedPosts[postId] ? -1 : 1) : 0
    }));
  };

  const toggleBookmark = (id) => setBookmarkedPosts((prev) => ({ ...prev, [id]: !prev[id] }));
  const toggleTip = (id) => setTipActivePosts((prev) => ({ ...prev, [id]: !prev[id] }));

  const isPostUnlocked = (postId) => {
    const p = findPostById(postId);
    if (!p) return false;
    if (!p.locked) return true;
    if (subscribed) return true;
    if (freeSample.active && p.isDummy) {
      const match = String(p.id).match(/^dummy-(\d+)$/);
      if (match) {
        const idx = Number(match[1]);
        return idx <= (freeSample.unlockedCount || 0);
      }
    }
    return false;
  };

  const lockScroll = () => { try { document.body.style.overflow = "hidden"; } catch (e) {} };
  const unlockScroll = () => { try { document.body.style.overflow = "auto"; } catch (e) {} };

  const openSubModal = (planId) => { setSelectedPlan(planId || "monthly"); setShowSubModal(true); lockScroll(); };
  const closeSubModal = () => { setShowSubModal(false); unlockScroll(); };
  const openAddCard = (planId) => { setSelectedPlan(planId || selectedPlan); setShowAddCard(true); lockScroll(); };
  const closeAddCard = () => { setShowAddCard(false); unlockScroll(); };

  const handleAddCardSubmit = (payload) => {
    if (!unlockedOnceRef.current) {
      unlockedOnceRef.current = true;
      setTimeout(() => {
        const unlocked = 15;
        const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
        setFreeSample({ active: true, unlockedCount: unlocked, expiresAt: expires });
        setMessagesUnlocked(true);
        
        try {
          if (typeof window !== "undefined" && window.localStorage) {
            localStorage.setItem(FREE_SAMPLE_LS_KEY, JSON.stringify({ unlockedCount: unlocked, expiresAt: expires }));
            localStorage.setItem("messages_unlocked", "true");
          }
        } catch (err) {}

        showToast(`Free for 30 days active — ${unlocked} posts unlocked!`);
        setTimeout(() => showToast("You can now message creator! 💦"), 2000);
        closeSubModal();
        closeAddCard();
      }, 1200);
    }
  };

  const openMessageModal = () => {
    if (!messagesUnlocked && !subscribed) {
      openSubModal("monthly");
      showToast("Unlock your first post to message");
      return;
    }
    navigate("/messages");
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-100 flex justify-center p-4">
        <div className="w-full max-w-xl bg-white rounded-md shadow-sm text-[15px]" style={{ maxHeight: "calc(100vh - 2rem)", overflowY: "auto" }}>
          
          {/* COVER */}
          <div className="relative h-36 bg-gray-200 overflow-hidden">
            <img src={creator.banner} alt="banner" className="w-full h-full object-cover" />
            <div className="absolute left-3 top-3 flex gap-4 text-white text-xs font-semibold">
              <div className="flex flex-col items-center">
                <div className="font-bold">3.1K</div>
                <div className="text-[10px] opacity-80">Posts</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="font-bold">2.9k</div>
                <div className="text-[10px] opacity-80">Media</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="font-bold">5.57M</div>
                <div className="text-[10px] opacity-80">Likes</div>
              </div>
            </div>
          </div>

          {/* PROFILE */}
          <div className="px-4 -mt-10 flex items-start">
            <div className="relative">
              <div className="w-20 h-20 rounded-full overflow-hidden shadow-md">
                <img src={creator.avatar} alt="avatar" className="w-full h-full object-cover" />
              </div>
              <div className="absolute right-0 bottom-0 w-4 h-4 bg-green-500 rounded-full" />
            </div>
          </div>

          {/* ACTIONS */}
          <div className="px-4 mt-2 flex justify-end">
            <div className="flex gap-2">
              <button onClick={() => { setStarred(!starred); showToast(starred ? "Unstarred" : "Starred"); }} className="w-9 h-9 bg-white rounded-full border flex items-center justify-center shadow">
                <svg className="w-4 h-4 text-[#06b6d4]" viewBox="0 0 24 24" fill={starred ? "#06b6d4" : "none"}>
                  <path d="M12 17.3l6.18 3.9-1.64-7.03L21 9.24l-7.19-.62L12 2 10.19 8.62 3 9.24l4.46 4.93L5.82 21.2z" stroke="#06b6d4" strokeWidth="0.8"/>
                </svg>
              </button>
            </div>
          </div>

          {/* NAME */}
          <div className="px-4 mt-2 flex items-center justify-between">
            <div>
              <h2 className="text-[18px] font-bold">{creator.name}</h2>
              <div className="text-[13px] text-gray-500">{creator.handle} · Available now</div>
            </div>
            <button onClick={openMessageModal} className="bg-[#00AFF0] text-white text-sm font-semibold rounded-full px-6 py-2 shadow">Message</button>
          </div>

          {/* BIO */}
          <div className="px-4 border-t mt-3 pt-3">
            <div className={`text-[14px] text-gray-800 ${bioExpanded ? "" : "line-clamp-2"}`}>
              <p>{creator.bio}</p>
            </div>
            <button onClick={() => setBioExpanded(!bioExpanded)} className="text-[13px] text-blue-500 underline mt-2">{bioExpanded ? "Collapse" : "More info"}</button>
          </div>

          {/* SUBSCRIPTION */}
          <div className="px-4 mt-4">
            <div className="bg-white p-4 rounded border">
              <div className="text-[11px] font-semibold text-gray-500">SUBSCRIPTION</div>
              <div className="mt-1 text-[14px] font-medium">Limited offer - Free trial for 30 days!</div>
              <div className="mt-3 bg-gray-100 rounded p-3 flex items-start gap-3">
                <div className="w-8 h-8 rounded-full overflow-hidden">
                  <img src={creator.avatar} alt="avatar" className="w-full h-full object-cover" />
                </div>
                <div className="text-[14px]">I'm Always Hornyyyyyy 🤤💦</div>
              </div>
              <div className="mt-4">
                <button onClick={() => openSubModal("monthly")} className="w-full rounded-full py-3 font-semibold text-white bg-[#00AFF0] flex items-center justify-between px-4">
                  <span>SUBSCRIBE</span>
                  <span>{freeSample.active ? "$5 / month" : "FREE for 30 days"}</span>
                </button>
              </div>
              <div className="text-[11px] text-gray-500 mt-2">Regular price $5 / month</div>
            </div>
          </div>

          {/* TABS */}
          <div className="mt-4 border-t">
            <div className="grid grid-cols-2 bg-white text-[14px] font-medium">
              <button onClick={() => setActiveTab("posts")} className={`py-3 ${activeTab === "posts" ? "border-b-2 border-black" : "text-gray-500"}`}>{posts.length} POSTS</button>
              <button onClick={() => setActiveTab("media")} className={`py-3 ${activeTab === "media" ? "border-b-2 border-black" : "text-gray-500"}`}>{mediaItems.length} MEDIA</button>
            </div>
          </div>

          {/* POSTS */}
          <div className="bg-white p-4">
            {activeTab === "posts" && (
              <div className="space-y-6">
                {posts.map((p) => (
                  <article key={p.id} className="border-b pb-4 last:border-none">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden">
                        <img src={creator.avatar} alt="avatar" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold text-[14px]">{creator.name}</div>
                            <div className="text-[12px] text-gray-500">{creator.handle} · {p.date}</div>
                          </div>
                          <div className="text-gray-400">•••</div>
                        </div>
                        <p className="mt-2 text-[14px]">{p.text}</p>

                        {p.mediaType && !isPostUnlocked(p.id) ? (
                          <div className="mt-3 bg-[#F8FAFB] border rounded-lg p-4">
                            <div className="flex flex-col items-center">
                              <svg className="w-14 h-14" viewBox="0 0 24 24" fill="none">
                                <rect x="3" y="10" width="18" height="11" rx="2" stroke="#D1D7DB" strokeWidth="1.6"/>
                                <path d="M7 10V7a5 5 0 0110 0v3" stroke="#D1D7DB" strokeWidth="1.6"/>
                              </svg>
                              <div className="mt-3">
                                <button onClick={() => openSubModal("monthly")} className="px-6 py-2 rounded-full bg-[#00AFF0] text-white font-semibold text-sm">SUBSCRIBE TO SEE POSTS</button>
                              </div>
                            </div>
                          </div>
                        ) : p.mediaType && isPostUnlocked(p.id) ? (
                          <div className="mt-3 rounded-md overflow-hidden h-44">
                            <img src={p.mediaSrc} alt="post" className="w-full h-full object-cover" />
                          </div>
                        ) : null}

                        <div className="mt-3 flex items-center gap-4 text-gray-500 text-[13px]">
                          <button className="flex items-center gap-2" onClick={() => toggleLike(p.id)}>
                            <IconHeart active={!!likedPosts[p.id]} />
                            <span>{formatLikes(likeCounts[p.id] ?? p.likes)}</span>
                          </button>
                          <div>Comment</div>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {activeTab === "media" && (
              <div>
                <div className="grid grid-cols-3 gap-1">
                  {mediaItems.slice(0, 15).map((m) => {
                    const locked = !isPostUnlocked(m.id);
                    return (
                      <div key={m.id} className="relative aspect-square">
                        {locked ? (
                          <div className="w-full h-full bg-[#FBFCFD] flex items-center justify-center">
                            <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none">
                              <rect x="3" y="10" width="18" height="11" rx="2" stroke="#D1D7DB" strokeWidth="1.6"/>
                              <path d="M7 10V7a5 5 0 0110 0v3" stroke="#D1D7DB" strokeWidth="1.6"/>
                            </svg>
                          </div>
                        ) : (
                          <img src={m.src} alt="media" className="w-full h-full object-cover" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Toast */}
          <div className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 transition-all ${toast.visible ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
            <div className="bg-black text-white text-sm px-4 py-2 rounded-md">{toast.message}</div>
          </div>

          {/* Modals */}
          <ModalPortal isOpen={showSubModal} onClose={closeSubModal} zIndex={1000}>
            <SubscriptionModal creator={creator} selectedPlan={selectedPlan} onSelectPlan={setSelectedPlan} onAddCard={openAddCard} onClose={closeSubModal} freeSampleActive={freeSample.active} />
          </ModalPortal>

          <ModalPortal isOpen={showAddCard} onClose={closeAddCard} zIndex={1100}>
            <div className="p-0 max-h-[85vh] overflow-y-auto">
              <AddCardForm onClose={closeAddCard} onSuccess={handleAddCardSubmit} selectedPlan={selectedPlan} />
            </div>
          </ModalPortal>

        </div>
      </div>
    </ErrorBoundary>
  );
}

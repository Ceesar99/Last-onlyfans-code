// ProfilePage.jsx - FINAL WORKING VERSION
import React, { useEffect, useRef, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import ModalPortal from "../component/ModalPortal";
import SubscriptionModal from "../component/SubcriptionModal";

const FREE_SAMPLE_LS_KEY = "freeSampleAccess_v1";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught:", error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="bg-white p-6 rounded shadow text-center">
            <h2 className="text-lg font-semibold text-red-600">Something went wrong</h2>
            <p className="text-sm text-gray-600 mt-2">Please refresh the page</p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const defaultCreator = {
  name: "Tayler Hills",
  avatar: "https://hyaulauextrzdaykkqre.supabase.co/storage/v1/object/public/uploads/posts/1760699188347-6c2tnk-images%20(9).jpeg",
  banner: "https://hyaulauextrzdaykkqre.supabase.co/storage/v1/object/public/uploads/posts/1760699444010-y1kcnl-Screenshot_20251017-121026.jpg",
  handle: "@taylerhillxxx",
  bio: "Hi 😊 I'm your favorite 19 year old & I love showing all of ME for your pleasure; ) you'll love it here! 🍆💦 Message me 👆 for daily nudes and videos in the feed ✨",
};

const UNLOCKED_POST_IMAGES = [
  "https://hyaulauextrzdaykkqre.supabase.co/storage/v1/object/public/uploads/posts/1760742247894-wuga4b-tayler-hills-onlyfans-7su4i-72.jpeg",
  "https://hyaulauextrzdaykkqre.supabase.co/storage/v1/object/public/uploads/posts/1760701141796-9roite-Screenshot_20251017-123357.jpg",
  "https://hyaulauextrzdaykkqre.supabase.co/storage/v1/object/public/uploads/posts/1760701111671-4eu428-Screenshot_20251017-123512.jpg",
  "https://hyaulauextrzdaykkqre.supabase.co/storage/v1/object/public/uploads/posts/1760700680072-2a7llr-Screenshot_20251017-122943.jpg",
  "https://hyaulauextrzdaykkqre.supabase.co/storage/v1/object/public/uploads/posts/1760700668201-t5di54-Screenshot_20251017-123004.jpg",
  "https://hyaulauextrzdaykkqre.supabase.co/storage/v1/object/public/uploads/posts/1760700654730-rd1q1r-Screenshot_20251017-123038.jpg",
  "https://hyaulauextrzdaykkqre.supabase.co/storage/v1/object/public/uploads/posts/1760700520296-72yuih-Screenshot_20251017-122523.jpg",
  "https://hyaulauextrzdaykkqre.supabase.co/storage/v1/object/public/uploads/posts/1760700501860-hqck9r-Screenshot_20251017-122548.jpg",
  "https://hyaulauextrzdaykkqre.supabase.co/storage/v1/object/public/uploads/posts/1760700484556-w30efh-Screenshot_20251017-122714.jpg",
  "https://hyaulauextrzdaykkqre.supabase.co/storage/v1/object/public/uploads/posts/1760702951815-0j3vd8-Screenshot_20251017-130712.jpg",
  "https://hyaulauextrzdaykkqre.supabase.co/storage/v1/object/public/uploads/posts/1760702918793-4ks6tl-Screenshot_20251017-130803.jpg",
  "https://hyaulauextrzdaykkqre.supabase.co/storage/v1/object/public/uploads/posts/1760722413191-rkpgx9-Screenshot_20251017-182707.jpg",
  "https://hyaulauextrzdaykkqre.supabase.co/storage/v1/object/public/uploads/posts/1760722436108-036d59-Screenshot_20251017-182631.jpg",
  "https://hyaulauextrzdaykkqre.supabase.co/storage/v1/object/public/uploads/posts/1760701157281-3gg60s-Screenshot_20251017-123330.jpg",
  "https://hyaulauextrzdaykkqre.supabase.co/storage/v1/object/public/uploads/posts/1760703032076-85uy0r-Screenshot_20251017-130610.jpg",
];

const DUMMY_POST_CAPTIONS = [
  "Come closer, I've got secrets that'll make you blush... and beg for more. 😏",
  "This dress is tight, but my thoughts about you are even tighter. Want a peek? 🔥",
  "Sipping on something sweet, but nothing compares to the taste of temptation. 🍷",
  "Curves ahead—handle with care, or don't... I like it rough. 😉",
  "Whisper your fantasies in my ear, and I'll make them reality. 💋",
  "Feeling naughty today. What's your wildest desire? 🌶️",
  "This lingerie is just a tease. Unlock the full show? 🗝️",
  "Bite your lip, because what I'm about to show will drive you wild. 😈",
  "Poolside vibes, but my mind's in the bedroom. Dive in with me? 🏊‍♀️",
  "Soft skin, hard intentions. Ready to play? 🎲",
];

function buildLocalDummyPosts() {
  const startDate = new Date('2025-09-29');
  let persistedLikes = {};
  try {
    const stored = typeof window !== "undefined" ? window.localStorage.getItem("post_likes_permanent") : null;
    if (stored) persistedLikes = JSON.parse(stored);
  } catch (err) {}

  return Array.from({ length: 100 }).map((_, i) => {
    const idx = i + 1;
    const hasRealImage = idx <= 15;
    const postDate = new Date(startDate);
    postDate.setDate(postDate.getDate() - i * 3);

    const postId = `dummy-${idx}`;
    if (!persistedLikes[postId]) {
      persistedLikes[postId] = Math.floor(Math.random() * 1800001) + 200000;
    }

    return {
      id: postId,
      text: DUMMY_POST_CAPTIONS[i % 10] || `Post ${idx}`,
      mediaType: "image",
      mediaSrc: hasRealImage ? UNLOCKED_POST_IMAGES[i] : "https://via.placeholder.com/600x800/cccccc/666666?text=Locked",
      likes: persistedLikes[postId],
      date: postDate.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      created_at: postDate.toISOString(),
      locked: true,
      isDummy: true,
    };
  });
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const [creator, setCreator] = useState(defaultCreator);
  const [posts, setPosts] = useState(() => buildLocalDummyPosts());
  const [activeTab, setActiveTab] = useState("posts");
  const [bioExpanded, setBioExpanded] = useState(false);
  const [starred, setStarred] = useState(false);
  const [likedPosts, setLikedPosts] = useState({});
  const [bookmarkedPosts, setBookmarkedPosts] = useState({});
  const [tipActivePosts, setTipActivePosts] = useState({});
  const [likeCounts, setLikeCounts] = useState({});
  const [messagesUnlocked, setMessagesUnlocked] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: "", type: "success" });
  const toastTimerRef = useRef(null);
  const [showSubModal, setShowSubModal] = useState(false);
  const [showAddCard, setShowAddCard] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("monthly");
  const [freeSample, setFreeSample] = useState({ active: false, unlockedCount: 15, expiresAt: null });
  const countdownRef = useRef(null);
  const unlockedOnceRef = useRef(false);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerList, setViewerList] = useState([]);
  const [viewerIndex, setViewerIndex] = useState(0);

  const findPostById = (id) => posts.find((p) => String(p.id) === String(id));

  // Load Supabase data (optional - doesn't break if it fails)
  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      try {
        // Try loading profile
        const { data: profileData } = await supabase
          .from("creator_profiles")
          .select("name, bio, avatar_url, banner_url, handle")
          .eq("handle", "taylerhillxxx")
          .maybeSingle();

        if (profileData && mounted) {
          setCreator((prev) => ({
            ...prev,
            name: profileData.name || prev.name,
            avatar: profileData.avatar_url || prev.avatar,
            banner: profileData.banner_url || prev.banner,
            handle: profileData.handle ? `@${profileData.handle}` : prev.handle,
            bio: profileData.bio || prev.bio,
          }));
        }

        // Try loading posts
        const { data: postsData } = await supabase
          .from("posts")
          .select("id, content, title, media_url, locked, created_at")
          .eq("creator_handle", "taylerhillxxx")
          .order("created_at", { ascending: false })
          .limit(50);

        if (postsData && Array.isArray(postsData) && postsData.length > 0 && mounted) {
          const mapped = postsData.map((post) => ({
            id: `db-${post.id}`,
            text: post.content || post.title || "",
            mediaType: post.media_url ? "image" : null,
            mediaSrc: post.media_url || null,
            likes: Math.floor(Math.random() * 500000),
            date: new Date(post.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
            created_at: post.created_at,
            locked: post.locked === true,
            isDummy: false,
          }));
          
          setPosts((prev) => [...mapped, ...prev]);
        }
      } catch (err) {
        console.error("Supabase error (non-critical):", err);
        // Don't break - dummy posts will still show
      }
    };

    loadData();

    return () => { mounted = false; };
  }, []);

  const mediaItems = useMemo(() => {
    return posts.filter((p) => p.mediaSrc).map((p) => ({
      id: p.id,
      type: p.mediaType || "image",
      src: p.mediaSrc,
      count: 1,
    }));
  }, [posts]);

  useEffect(() => {
    const map = {};
    posts.forEach((p) => { map[p.id] = p.likes; });
    setLikeCounts(map);

    try {
      if (typeof window !== "undefined" && window.localStorage) {
        const raw = localStorage.getItem(FREE_SAMPLE_LS_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed?.expiresAt) {
            setFreeSample((prev) => ({ ...prev, active: true, unlockedCount: parsed.unlockedCount || 15, expiresAt: parsed.expiresAt }));
          }
        }
        const messagesState = localStorage.getItem("messages_unlocked");
        if (messagesState === "true") setMessagesUnlocked(true);
      }
    } catch (e) {}
  }, [posts]);

  const showToast = (message, type = "success", ms = 2000) => {
    setToast({ visible: true, message, type });
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToast({ visible: false, message: "", type }), ms);
  };

  const IconHeart = ({ className = "w-5 h-5", active = false }) => (
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

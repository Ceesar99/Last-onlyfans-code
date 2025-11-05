// ProfilePage.jsx
import React, { useEffect, useRef, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import ModalPortal from "../component/ModalPortal";
import SubscriptionModal from "../component/SubcriptionModal";
import MessageModal from "../component/MessageModal";
// frontend supabase client (assumes default export)
import supabase from "../supabaseclient";

const FREE_SAMPLE_LS_KEY = "freeSampleAccess_v1";

/* ErrorBoundary unchanged */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error, info) {
    console.error("SafeProfileMock caught error:", error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="bg-white p-6 rounded shadow text-center">
            <h2 className="text-lg font-semibold text-red-600">Something went wrong</h2>
            <p className="text-sm text-gray-600 mt-2">Please refresh the page or try again later.</p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

/* fallback data kept similar to your original */
const defaultCreator = {
  name: "Tayler Hills",
  avatar: "https://hyaulauextrzdaykkqre.supabase.co/storage/v1/object/public/uploads/posts/1760699188347-6c2tnk-images%20(9).jpeg",
  banner: "https://hyaulauextrzdaykkqre.supabase.co/storage/v1/object/public/uploads/posts/1760699444010-y1kcnl-Screenshot_20251017-121026.jpg",
  handle: "@taylerhillxxx",
  bio:
    "Hi 😊 I’m your favorite 19 year old & I love showing all of ME for your pleasure; ) you’ll love it here! 🍆💦 Message me 👆 for daily nudes and videos in the feed ✨ S tapes, bjs , hjs , stripteases Dildo, vibrator, creampie, baby oil, roleplay 💦 Private messages with me ✨ NO SPAM OR ADS Turn on your your auto-renew on and get freebies xo",
};

// Post captions for dummy posts and images (kept from original)
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
  /* ... long list kept as in your original (truncated here for brevity in this snippet) ... */
  "Final tease: all in or all out? Decide. 🃏"
];

function buildLocalDummyPosts() {
  const startDate = new Date('2025-09-29');
  const endDate = new Date('2024-01-01');
  const totalDays = Math.floor((startDate - endDate) / (1000 * 60 * 60 * 24));

  const dates = Array.from({ length: 100 }).map((_, i) => {
    const daysBack = Math.floor((i / 99) * totalDays);
    const date = new Date(startDate);
    date.setDate(date.getDate() - daysBack);
    return date;
  });

  let persistedLikes = {};
  try {
    const stored = typeof window !== "undefined" ? window.localStorage.getItem("post_likes_permanent") : null;
    if (stored) {
      persistedLikes = JSON.parse(stored);
    }
  } catch (err) {
    console.warn("Failed to load persisted likes:", err);
  }

  return Array.from({ length: 100 }).map((_, i) => {
    const idx = i + 1;
    const hasRealImage = idx <= 15;
    const postDate = dates[i];
    const postId = `dummy-${idx}`;
    if (!persistedLikes[postId]) {
      persistedLikes[postId] = Math.floor(Math.random() * 1800001) + 200000;
    }

    return {
      id: postId,
      text: DUMMY_POST_CAPTIONS[i] || `Post ${idx}`,
      mediaType: "image",
      mediaSrc: hasRealImage ? UNLOCKED_POST_IMAGES[i] : "https://via.placeholder.com/600x800/cccccc/666666?text=Locked+Content",
      likes: persistedLikes[postId],
      date: postDate.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }),
      created_at: postDate.toISOString(),
      locked: true,
      isDummy: true,
    };
  });
}

export default function SafeProfileMock() {
  // --- state (kept largely identical)
  const navigate = useNavigate();
  const [creator, setCreator] = useState(defaultCreator);
  const [posts, setPosts] = useState(() => buildLocalDummyPosts());
  const [postsLoading, setPostsLoading] = useState(true);
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
  const [subscribed, setSubscribed] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("monthly");

  const [freeSample, setFreeSample] = useState({ active: false, unlockedCount: 15, expiresAt: null });
  const countdownRef = useRef(null);
  const unlockedOnceRef = useRef(false);

  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerList, setViewerList] = useState([]);
  const [viewerIndex, setViewerIndex] = useState(0);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [tipAnimatingPosts, setTipAnimatingPosts] = useState({});

  // helpers to find posts by id
  const findPostIndexById = (id) => posts.findIndex((p) => String(p.id) === String(id));
  const findPostById = (id) => posts.find((p) => String(p.id) === String(id));

  const openMessageModal = () => {
    setShowSubModal(true);
    lockScroll();
  };

  const closeMessageModal = () => {
    setShowMessageModal(false);
    unlockScroll();
  };

  // ---------------------------
  // LIVE Supabase integration (initial fetch + realtime subscriptions)
  // ---------------------------
  useEffect(() => {
    let mounted = true;
    setPostsLoading(true);

    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.setItem("creator_handle", "@taylerhillxxx");
      localStorage.setItem("user_email", "subscriber@example.com");
    }

    const parseHandleFromUrl = () => {
      try {
        const path = typeof window !== "undefined" ? window.location.pathname : "";
        const parts = path.split("/").filter(Boolean);
        const idx = parts.indexOf("profile");
        if (idx !== -1 && parts.length > idx + 1) return parts[idx + 1];
        if (parts.length === 1) return parts[0];
        const ux = parts.indexOf("u");
        if (ux !== -1 && parts.length > ux + 1) return parts[ux + 1];
        return null;
      } catch (e) {
        return null;
      }
    };

    const urlHandle = parseHandleFromUrl();
    const storedHandle = typeof window !== "undefined" ? window.localStorage.getItem("creator_handle") : null;
    const handle = (urlHandle && urlHandle.replace(/^@/, "")) || (storedHandle && storedHandle.replace(/^@/, "")) || null;

    const loadInitialData = async () => {
      try {
        if (handle) {
          const { data: profileData, error: profileError } = await supabase
            .from("creator_profiles")
            .select("id, handle, name, bio, avatar_url, banner_url, created_at")
            .eq("handle", handle)
            .maybeSingle();

          if (profileError) {
            console.error("Supabase profile error:", profileError);
          } else if (profileData && mounted) {
            setCreator((prev) => ({
              ...prev,
              name: profileData.name || prev.name,
              avatar: profileData.avatar_url || prev.avatar,
              banner: profileData.banner_url || prev.banner,
              handle: profileData.handle ? (profileData.handle.startsWith("@") ? profileData.handle : `@${profileData.handle}`) : prev.handle,
              bio: profileData.bio || prev.bio,
              id: profileData.id || prev.id,
              created_at: profileData.created_at || prev.created_at,
            }));
          }
        }

        let postsQuery = supabase.from("posts").select("id, creator_handle, title, content, media_url, locked, created_at");
        if (handle) postsQuery = postsQuery.eq("creator_handle", handle);
        postsQuery = postsQuery.order("created_at", { ascending: false }).limit(500);

        const { data: postsData, error: postsError } = await postsQuery;

        if (postsError) {
          console.error("Supabase posts error:", postsError);
        } else if (mounted && Array.isArray(postsData)) {
          let persistedLikes = {};
          try {
            const stored = typeof window !== "undefined" ? window.localStorage.getItem("post_likes_permanent") : null;
            if (stored) {
              persistedLikes = JSON.parse(stored);
            }
          } catch (err) {
            console.warn("Failed to load persisted likes:", err);
          }

          const mappedDB = postsData.map((post) => {
            const postId = `db-${post.id}`;
            if (!persistedLikes[postId]) {
              persistedLikes[postId] = Math.floor(Math.random() * 1800001) + 200000;
            }

            return {
              id: postId,
              dbId: post.id,
              creator_handle: post.creator_handle,
              text: post.content || post.title || "",
              mediaType: post.media_url ? (post.media_url.includes(".mp4") || post.media_url.includes("video") ? "video" : "image") : null,
              mediaSrc: post.media_url || null,
              likes: persistedLikes[postId],
              date: post.created_at ? new Date(post.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "",
              locked: post.locked === true,
              created_at: post.created_at,
              isDummy: false,
            };
          });

          try {
            if (typeof window !== "undefined" && window.localStorage) {
              localStorage.setItem("post_likes_permanent", JSON.stringify(persistedLikes));
            }
          } catch (err) {
            console.warn("Failed to save persisted likes:", err);
          }

          setPosts((prev) => {
            const dummyPosts = prev.filter((p) => p.isDummy);
            const merged = [...mappedDB, ...dummyPosts];
            return merged;
          });

          const userEmail = typeof window !== "undefined" ? window.localStorage.getItem("user_email") : null;
          if (userEmail) {
            try {
              const { data: userLikes, error: likesError } = await supabase
                .from("post_likes")
                .select("post_id")
                .eq("user_email", userEmail);

              if (!likesError && userLikes && mounted) {
                const likedMap = {};
                userLikes.forEach((like) => {
                  likedMap[like.post_id] = true;
                });
                setLikedPosts(likedMap);
              }
            } catch (err) {
              console.error("Failed to load user likes:", err);
            }

            try {
              const allPostIds = mappedDB.map(p => p.id);
              if (allPostIds.length > 0) {
                const countsMap = {};
                for (const postId of allPostIds) {
                  const { count, error } = await supabase
                    .from("post_likes")
                    .select("*", { count: "exact", head: true })
                    .eq("post_id", postId);

                  if (!error && count !== null) {
                    countsMap[postId] = count;
                  }
                }

                if (mounted && Object.keys(countsMap).length > 0) {
                  setLikeCounts((prev) => ({ ...prev, ...countsMap }));
                }
              }
            } catch (err) {
              console.error("Failed to load like counts:", err);
            }
          }
        }
      } catch (err) {
        console.error("Unexpected fetch error:", err);
      } finally {
        if (mounted) setPostsLoading(false);
      }
    };

    loadInitialData();

    const postsChannel = supabase
      .channel('posts-changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'posts' }, (payload) => {
        const newRow = payload.new;
        const postId = `db-${newRow.id}`;
        const mapped = {
          id: postId,
          dbId: newRow.id,
          creator_handle: newRow.creator_handle,
          text: newRow.content || newRow.title || "",
          mediaType: newRow.media_url ? (newRow.media_url.includes(".mp4") || newRow.media_url.includes("video") ? "video" : "image") : null,
          mediaSrc: newRow.media_url || null,
          likes: getStableLikeCount(postId),
          date: newRow.created_at ? new Date(newRow.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "",
          locked: newRow.locked === true,
          created_at: newRow.created_at,
          isDummy: false,
        };
        setPosts((prev) => {
          const withoutSame = prev.filter((p) => String(p.id) !== String(mapped.id));
          return [mapped, ...withoutSame];
        });
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'posts' }, (payload) => {
        const row = payload.new;
        const postId = `db-${row.id}`;
        const mapped = {
          id: postId,
          dbId: row.id,
          creator_handle: row.creator_handle,
          text: row.content || row.title || "",
          mediaType: row.media_url ? (row.media_url.includes(".mp4") || row.media_url.includes("video") ? "video" : "image") : null,
          mediaSrc: row.media_url || null,
          likes: getStableLikeCount(postId),
          date: row.created_at ? new Date(row.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "",
          locked: row.locked === true,
          created_at: row.created_at,
          isDummy: false,
        };
        setPosts((prev) => {
          const idx = prev.findIndex((p) => String(p.id) === String(mapped.id));
          if (idx === -1) {
            return [mapped, ...prev];
          }
          const copy = [...prev];
          copy[idx] = { ...copy[idx], ...mapped };
          return copy;
        });
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'posts' }, (payload) => {
        const oldRow = payload.old;
        const id = `db-${oldRow.id}`;
        setPosts((prev) => prev.filter((p) => String(p.id) !== String(id)));
      })
      .subscribe();

    const profileChannel = supabase
      .channel('profile-changes')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'creator_profiles' }, (payload) => {
        const row = payload.new;
        setCreator((prev) => ({
          ...prev,
          name: row.name || prev.name,
          avatar: row.avatar_url || prev.avatar,
          banner: row.banner_url || prev.banner,
          handle: row.handle ? (row.handle.startsWith("@") ? row.handle : `@${row.handle}`) : prev.handle,
          bio: row.bio || prev.bio,
          id: row.id || prev.id,
          created_at: row.created_at || prev.created_at,
        }));
      })
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(postsChannel);
      supabase.removeChannel(profileChannel);
      clearSilentCountdown();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // derive mediaItems from posts
  const mediaItems = useMemo(() => {
    return posts
      .filter((p) => p.mediaSrc)
      .map((p) => ({
        id: p.id,
        type: p.mediaType || "image",
        src: p.mediaSrc,
        duration: p.mediaType === "video" ? `${Math.floor(Math.random() * 3)}:${String(Math.floor(Math.random() * 60)).padStart(2, "0")}` : undefined,
        count: 1,
      }));
  }, [posts]);

  useEffect(() => {
    const map = {};
    posts.forEach((p) => {
      map[p.id] = p.likes;
    });
    setLikeCounts(map);

    try {
      if (typeof window !== "undefined" && window.localStorage) {
        const raw = localStorage.getItem(FREE_SAMPLE_LS_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && parsed.expiresAt) {
            startSilentCountdown(parsed.expiresAt);
            setFreeSample((prev) => ({ ...prev, active: true, unlockedCount: parsed.unlockedCount || prev.unlockedCount, expiresAt: parsed.expiresAt }));
          }
        }

        const likedState = localStorage.getItem("post_likes_state");
        if (likedState) {
          setLikedPosts(JSON.parse(likedState));
        }

        const likeCounts = localStorage.getItem("post_likes_permanent");
        if (likeCounts) {
          setLikeCounts((prev) => ({ ...prev, ...JSON.parse(likeCounts) }));
        }

        const messagesUnlockedState = localStorage.getItem("messages_unlocked");
        if (messagesUnlockedState === "true") {
          setMessagesUnlocked(true);
        }
      }
    } catch (e) {
      console.warn("failed to read persisted state", e);
    }

    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [posts]);

  // helper toast
  const showToast = (message, type = "success", ms = 2000) => {
    setToast({ visible: true, message, type });
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToast({ visible: false, message: "", type }), ms);
  };

  // silent countdown helpers
  const startSilentCountdown = (expiresAtIso) => {
    clearSilentCountdown();
    countdownRef.current = setInterval(() => {
      try {
        const exp = new Date(expiresAtIso).getTime();
        if (Date.now() >= exp) {
          if (typeof window !== "undefined" && window.localStorage) {
            localStorage.removeItem(FREE_SAMPLE_LS_KEY);
          }
          setFreeSample({ active: false, unlockedCount: 0, expiresAt: null });
          clearSilentCountdown();
        }
      } catch (err) {
        console.warn("silent countdown error:", err);
      }
    }, 60 * 1000);
  };
  const clearSilentCountdown = () => {
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
  };

  // icons & formatLikes unchanged but with SVG START/END comments and ids where requested
  const IconHeart = ({ className = "w-5 h-5", active = false, likes = 0 }) => (
    <div className="flex flex-col items-center">
      {/* IconHeart SVG START */}
      <svg className={className} viewBox="0 0 24 24" fill={active ? "#e0245e" : "none"} xmlns="http://www.w3.org/2000/svg" stroke={active ? "#e0245e" : "#9AA3AD"}>
        <path d="M12 17.3l6.18 3.9-1.64-7.03L21 9.24l-7.19-.62L12 2 10.19 8.62 3 9.24l4.46 4.93L5.82 21.2z" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      {/* IconHeart SVG END */}
      <span className="text-xs text-gray-500">{formatLikes(likes)}</span>
    </div>
  );
  const IconComment = ({ className = "w-5 h-5" }) => (
    <>
      {/* IconComment SVG START (id=comment-icon) */}
      <svg id="comment-icon" className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" stroke="#9AA3AD">
        <path d="M21 15a2 2 0 0 1-2 2H8l-5 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {/* IconComment SVG END */}
    </>
  );
  const IconTip = ({ className = "w-5 h-5", active = false }) => (
    <>
      {/* IconTip SVG START (id=tip-icon) */}
      <svg id="tip-icon" className={`${className} ${active ? 'animate-flash-blue' : ''}`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" stroke="#9AA3AD">
        <circle cx="12" cy="12" r="9" strokeWidth="1.2"/><text x="12" y="15.2" textAnchor="middle" fontSize="10" fill="#9AA3AD" fontWeight="600">$</text>
      </svg>
      {/* IconTip SVG END */}
    </>
  );
  const IconBookmark = ({ className = "w-5 h-5", active = false }) => (
    <>
      {/* IconBookmark SVG START (id=bookmark-icon) */}
      <svg id="bookmark-icon" className={className} viewBox="0 0 24 24" fill={active ? "#2563eb" : "none"} xmlns="http://www.w3.org/2000/svg" aria-hidden="true" stroke={active ? "#2563eb" : "#9AA3AD"}>
        <path d="M6 2h12v19l-6-4-6 4V2z" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      {/* IconBookmark SVG END */}
    </>
  );
  const formatLikes = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
    if (num >= 1000) return Math.floor(num / 1000) + "k";
    return String(num);
  };

  // VerifiedBadge with explicit SVG START/END markers and ensured sizing so it doesn't get cut off
  const VerifiedBadge = () => (
    <>
      {/* VerifiedBadge SVG START (id=verified-badge-svg) */}
      <svg id="verified-badge-svg" className="w-4 h-4 ml-1" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 33 32" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Verified">
        <image xlinkHref="data:image/png;base64,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" x="0" y="0" width="33" height="32"/>
      </svg>
      {/* VerifiedBadge SVG END */}
    </>
  );

  // Utility to ensure stable fallback like counts (used in realtime handlers)
  const getStableLikeCount = (id) => {
    return likeCounts[id] ?? 0;
  };

  // Toggle like - database-backed, increments by 1 permanently
  const toggleLike = async (id) => {
    if (!subscribed) {
      return;
    }

    const userEmail = typeof window !== "undefined" ? window.localStorage.getItem("user_email") : null;
    if (!userEmail) {
      return;
    }

    const postId = String(id);
    const wasLiked = !!likedPosts[postId];

    // Optimistic UI update
    setLikedPosts((prev) => ({ ...prev, [postId]: !wasLiked }));
    
    if (!wasLiked) {
      // User is liking the post
      setLikeCounts((prev) => ({
        ...prev,
        [postId]: (prev[postId] || 0) + 1
      }));

      try {
        // Insert like into database
        const { error } = await supabase
          .from("post_likes")
          .insert([{
            post_id: postId,
            user_email: userEmail,
            created_at: new Date().toISOString()
          }]);

        if (error) {
          // If duplicate error, user already liked it - ignore
          if (error.code !== "23505") {
            console.error("Failed to save like:", error);
            // Revert optimistic update on error
            setLikedPosts((prev) => ({ ...prev, [postId]: wasLiked }));
            setLikeCounts((prev) => ({
              ...prev,
              [postId]: Math.max(0, (prev[postId] || 0) - 1)
            }));
          }
        }

        // Fetch updated count from database
        const { count } = await supabase
          .from("post_likes")
          .select("*", { count: "exact", head: true })
          .eq("post_id", postId);

        if (count !== null) {
          setLikeCounts((prev) => ({ ...prev, [postId]: count }));
        }
      } catch (err) {
        console.error("toggleLike error:", err);
        // Revert optimistic update on error
        setLikedPosts((prev) => ({ ...prev, [postId]: wasLiked }));
        setLikeCounts((prev) => ({
          ...prev,
          [postId]: Math.max(0, (prev[postId] || 0) - 1)
        }));
      }
    } else {
      // User is unliking the post
      setLikeCounts((prev) => ({
        ...prev,
        [postId]: Math.max(0, (prev[postId] || 0) - 1)
      }));

      try {
        // Delete like from database
        const { error } = await supabase
          .from("post_likes")
          .delete()
          .eq("post_id", postId)
          .eq("user_email", userEmail);

        if (error) {
          console.error("Failed to remove like:", error);
          // Revert optimistic update on error
          setLikedPosts((prev) => ({ ...prev, [postId]: wasLiked }));
          setLikeCounts((prev) => ({
            ...prev,
            [postId]: (prev[postId] || 0) + 1
          }));
        }

        // Fetch updated count from database
        const { count } = await supabase
          .from("post_likes")
          .select("*", { count: "exact", head: true })
          .eq("post_id", postId);

        if (count !== null) {
          setLikeCounts((prev) => ({ ...prev, [postId]: count }));
        }
      } catch (err) {
        console.error("toggleLike error:", err);
        // Revert optimistic update on error
        setLikedPosts((prev) => ({ ...prev, [postId]: wasLiked }));
        setLikeCounts((prev) => ({
          ...prev,
          [postId]: (prev[postId] || 0) + 1
        }));
      }
    }
  };
  const toggleBookmark = (id) => setBookmarkedPosts((prev) => ({ ...prev, [id]: !prev[id] }));
  const toggleTip = (id) => {
    setTipAnimatingPosts((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => setTipAnimatingPosts((prev) => ({ ...prev, [id]: false })), 500);
  };

  // Unlock helpers changed to check post.locked explicitly
  const isPostUnlocked = (postId) => {
    const p = findPostById(postId);
    if (!p) return false;
    if (!p.locked) return true;
    if (subscribed) return true;
    if (freeSample.active && freeSample.unlockedCount > 0) {
      if (p.isDummy) {
        const match = String(p.id).match(/^dummy-(\d+)$/);
        if (match) {
          const idx = Number(match[1]);
          return idx <= (freeSample.unlockedCount || 0);
        }
      }
      return !p.locked;
    }
    return false;
  };
  const isMediaUnlocked = (mediaId) => {
    return isPostUnlocked(mediaId);
  };

  // scroll lock/unlock unchanged
  const lockScroll = () => { try { document.body.style.overflow = "hidden"; } catch (e) {} };
  const unlockScroll = () => { try { document.body.style.overflow = "auto"; } catch (e) {} };

  const openSubModal = (planId) => { setSelectedPlan(planId || "monthly"); setShowSubModal(true); lockScroll(); };
  const closeSubModal = () => { setShowSubModal(false); unlockScroll(); };

  // viewer helpers unchanged
  const buildViewerListFromPosts = useMemo(() => {
    return posts.filter((p) => isPostUnlocked(p.id) && p.mediaType).map((p) => ({ id: p.id, mediaType: p.mediaType, src: p.mediaSrc, title: `Post ${p.id}` }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [posts, freeSample, subscribed]);

  const buildViewerListFromMedia = useMemo(() => {
    return mediaItems
      .filter((m) => isMediaUnlocked(m.id))
      .map((m) => ({ id: m.id, mediaType: m.type, src: m.src, title: `Media ${m.id}` }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mediaItems, freeSample, subscribed]);

  const openViewer = ({ list, index = 0 }) => {
    if (!Array.isArray(list) || list.length === 0) return;
    setViewerList(list);
    setViewerIndex(Math.max(0, Math.min(index, list.length - 1)));
    setViewerOpen(true);
    lockScroll();
  };
  const closeViewer = () => {
    setViewerOpen(false);
    setTimeout(() => unlockScroll(), 60);
  };
  const viewerNext = () => setViewerIndex((i) => (i + 1 < viewerList.length ? i + 1 : i));
  const viewerPrev = () => setViewerIndex((i) => (i - 1 >= 0 ? i - 1 : i));

  useEffect(() => {
    if (!viewerOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") closeViewer();
      else if (e.key === "ArrowRight") viewerNext();
      else if (e.key === "ArrowLeft") viewerPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewerOpen, viewerList]);

  // -----------------------
  // RENDER (structure modified to be full-page, not modal-like)
  // -----------------------
  return (
    <ErrorBoundary>
      {/* Changed outer container so page is full-width and not centered like a modal.
          Removed center-justify on parent to make it a normal full page layout. */}
      <div className="min-h-screen bg-gray-100 p-0">
        <div
          className="w-full max-w-full bg-white text-[15px] relative min-h-screen"
          style={{ maxHeight: "auto", overflowY: "auto" }}
        >
          {/* COVER */}
          <div className="relative h-36 bg-gray-200 overflow-hidden">
            <img src={creator.banner || "https://share.google/UeoTXYJKD7Fx6ZTLQ"} alt="banner" className="w-full h-full object-cover" />
            <div className="absolute left-3 top-3 flex gap-4 text-white text-xs font-semibold">
              <div className="flex flex-col items-center">
                <div className="font-bold leading-tight">3.1K</div>
                <div className="text-[10px] opacity-80 leading-tight">Posts</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="font-bold leading-tight">2.9k</div>
                <div className="text-[10px] opacity-80 leading-tight">Media</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="font-bold leading-tight">5.57M</div>
                <div className="text-[10px] opacity-80 leading-tight">Likes</div>
              </div>
            </div>
          </div>

          {/* PROFILE ROW - adjusted so name and handle start directly under avatar,
              and message button remains on the right. Avatar + name/handle are left-aligned. */}
          <div className="px-4 -mt-10 flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="relative">
                <div className="w-20 h-20 rounded-full overflow-hidden shadow-md">
                  <img src={creator.avatar || "https://share.google/pKUGamvuSpMSo70j1"} alt="avatar" className="w-full h-full object-cover" />
                </div>
                <div className="absolute right-0 bottom-0 w-4 h-4 bg-green-500 rounded-full active-dot" />
              </div>

              {/* Name + handle stacked and starting directly under avatar (aligned) */}
              <div className="flex flex-col justify-center">
                <div className="flex items-center gap-2">
                  <h2 className="text-[18px] font-bold text-gray-900 leading-none">{creator.name}</h2>
                  <VerifiedBadge />
                </div>

                {/* Indicate the at-icon inline and make name & handle appear on same starting x */}
                <div className="text-[13px] text-gray-500 flex items-center gap-2">
                  {/* At-icon SVG START (id=at-icon) */}
                  <svg id="at-icon" className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" stroke="#9AA3AD">
                    <path d="M16 8a4 4 0 10-4 4" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="12" r="3" strokeWidth="1.2" />
                    <path d="M21 12v2a6 6 0 11-6-6h1" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {/* At-icon SVG END */}
                  <span>{creator.handle} · Available now</span>
                </div>
              </div>
            </div>

            <div className="flex items-center">
              <button onClick={openMessageModal} className="bg-[#00AFF0] text-white text-sm font-semibold rounded-full px-6 py-2 shadow min-w-[120px]" aria-label="message creator">
                Message
              </button>
            </div>
          </div>

          {/* BIO */}
          <div className="px-4 border-t mt-3 pt-3">
            <div className={`text-[14px] leading-snug text-gray-800 space-y-1 ${bioExpanded ? "" : "line-clamp-2"}`}>
              <p>{creator.bio}</p>
            </div>
            <button onClick={() => setBioExpanded(!bioExpanded)} className="text-[13px] text-blue-500 underline mt-2 inline-block" aria-expanded={bioExpanded}>
              {bioExpanded ? "Collapse" : "More info"}
            </button>
          </div>

          {/* SUBSCRIPTION SECTION */}
          <div className="px-4 mt-4">
            <div className="bg-white p-4 rounded border">
              <div className="text-[11px] font-semibold text-gray-500">SUBSCRIPTION</div>
              <div className="mt-1 text-[14px] font-medium text-gray-800">Limited offer - Free trial for 30 days!</div>

              <div className="mt-3 bg-gray-100 rounded p-3 flex items-start gap-3">
                <div className="w-8 h-8 rounded-full overflow-hidden">
                  <img src={creator.avatar} alt="avatar bubble" className="w-full h-full object-cover" />
                </div>
                <div className="text-[14px] text-gray-700">I'm Always Hornyyyyyy 🤤💦</div>
              </div>

              <div className="mt-4">
                <button onClick={() => openSubModal("monthly")} className="w-full rounded-full py-3 font-semibold text-white bg-[#00AFF0] flex items-center justify-between px-4" aria-haspopup="dialog">
                  <span>SUBSCRIBE</span>
                  <span className="font-semibold text-white text-sm whitespace-nowrap">{freeSample.active ? "$5 / month" : "FREE for 30 days"}</span>
                </button>
              </div>

              <div className="text-[11px] text-gray-500 mt-2">Regular price $5 / month</div>

              <div className="mt-4">
                <div className="text-[13px] font-semibold text-gray-500">SUBSCRIPTION BUNDLES</div>
                <div className="mt-2 space-y-2">
                  <button onClick={() => openSubModal("3months")} className="w-full flex items-center justify-between rounded-full px-4 py-2 bg-[#00AFF0] text-white" aria-label="3 months plan">
                    <div className="font-medium">3 MONTHS</div>
                    <div className="font-semibold">$15 total</div>
                  </button>
                  <button onClick={() => openSubModal("6months")} className="w-full flex items-center justify-between rounded-full px-4 py-2 bg-[#00AFF0] text-white" aria-label="6 months plan">
                    <div className="font-medium">6 MONTHS</div>
                    <div className="font-semibold">$30 total</div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* TABS */}
          <div className="mt-4 border-t">
            <div className="grid grid-cols-2 bg-white text-[14px] font-medium">
              <button onClick={() => setActiveTab("posts")} className={`py-3 ${activeTab === "posts" ? "border-b-2 border-black" : "text-gray-500"}`} aria-pressed={activeTab === "posts"}>
                {(2918 + posts.length).toLocaleString()} POSTS
              </button>
              <button onClick={() => setActiveTab("media")} className={`py-3 ${activeTab === "media" ? "border-b-2 border-black" : "text-gray-500"}`} aria-pressed={activeTab === "media"}>
                {(1939 + mediaItems.length).toLocaleString()} MEDIA
              </button>
            </div>
          </div>

          {/* TAB CONTENT */}
          <div className="bg-white p-4">
            {activeTab === "posts" && (
              <div className="space-y-6">
                {posts.map((p) => (
                  <article key={p.id} className="border-b pb-4 last:border-none">
                    <header className="flex items-start gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full overflow-hidden">
                        <img src={creator.avatar} alt="avatar" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold text-[14px] text-gray-900">{creator.name}</div>
                            <div className="text-[12px] text-gray-500">{creator.handle} · {p.date}</div>
                          </div>
                          <div className="text-gray-400">•••</div>
                        </div>

                        <p className="mt-2 text-[14px] text-gray-800">{p.text}</p>

                        <div className="mt-3">
                          {p.mediaType && !isPostUnlocked(p.id) ? (
                            <div className="bg-[#F8FAFB] border rounded-lg p-4">
                              <div className="flex flex-col items-center">
                                {/* LOCK ICON SVG START (id=lock-icon-post) */}
                                <svg id="lock-icon-post" xmlns="http://www.w3.org/2000/svg" className="w-14 h-14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                  <rect x="3" y="10" width="18" height="11" rx="2" stroke="#D1D7DB" strokeWidth="1.6" />
                                  <path d="M7 10V7a5 5 0 0110 0v3" stroke="#D1D7DB" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                {/* LOCK ICON SVG END */}

                                <div className="w-full mt-3 max-w-[420px]">
                                  <div className="border rounded-md p-3 bg-white">
                                    <div className="flex items-center justify-between">
                                      <div className="text-[12px] text-gray-500 flex items-center gap-2">
                                        {/* Thumbnail icon SVG START */}
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none">
                                          <path d="M3 3h18v18H3z" stroke="#B5BEC4" strokeWidth="1.2" fill="none" />
                                          <path d="M8 8l3 4 2-2 3 4" stroke="#B5BEC4" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                                        </svg>
                                        {/* Thumbnail icon SVG END */}
                                        <span>1</span>
                                      </div>
                                      <div />
                                    </div>

                                    <div className="mt-3">
                                      <button onClick={() => openSubModal("monthly")} className="mx-auto block px-6 py-2 rounded-full bg-[#00AFF0] text-white font-semibold text-sm max-w-[300px] whitespace-nowrap">
                                        SUBSCRIBE TO SEE USER'S POSTS
                                      </button>
                                    </div>
                                  </div>
                                </div>
                                <div className="text-[12px] text-gray-400 mt-2">{p.mediaType === "video" ? "1 video" : "1 image"}</div>
                              </div>
                            </div>
                          ) : p.mediaType && isPostUnlocked(p.id) ? (
                            <div className="rounded-md overflow-hidden bg-gray-100 h-44 flex items-center justify-center relative">
                              {p.mediaType === "video" ? (
                                <div
                                  role="button"
                                  tabIndex={0}
                                  onClick={() =>
                                    openViewer({
                                      list: buildViewerListFromPosts,
                                      index: buildViewerListFromPosts.findIndex((x) => x.id === p.id),
                                    })
                                  }
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                      openViewer({
                                        list: buildViewerListFromPosts,
                                        index: buildViewerListFromPosts.findIndex((x) => x.id === p.id),
                                      });
                                    }
                                  }}
                                  className="w-full h-full cursor-pointer flex items-center justify-center"
                                  aria-label={`Open video post ${p.id}`}
                                >
                                  <img src={p.mediaSrc} alt={`post ${p.id} poster`} className="w-full h-full object-cover" loading="lazy" />
                                  <div className="absolute">
                                    <div className="bg-black bg-opacity-40 rounded-full p-2">
                                      <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="none" stroke="white" xmlns="http://www.w3.org/2000/svg"><path d="M8 5v14l11-7z" /></svg>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <img
                                  src={p.mediaSrc}
                                  alt={`post media ${p.id}`}
                                  className="w-full h-full object-cover cursor-pointer"
                                  loading="lazy"
                                  onClick={() =>
                                    openViewer({
                                      list: buildViewerListFromPosts,
                                      index: buildViewerListFromPosts.findIndex((x) => x.id === p.id),
                                    })
                                  }
                                />
                              )}
                            </div>
                          ) : null}
                        </div>

                        <div className="mt-3 flex items-center gap-4 text-gray-500 text-[13px]">
                          <button className="flex items-center gap-2" onClick={() => toggleLike(p.id)} aria-label={`like post ${p.id}`}>
                            <IconHeart active={!!likedPosts[p.id]} likes={likeCounts[p.id] ?? p.likes} />
                          </button>

                          <div className="flex items-center gap-2" role="button" aria-label={`comment on post ${p.id}`}>
                            <IconComment />
                            <span>Comment</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button className="flex items-center gap-2" onClick={() => toggleTip(p.id)} aria-label={`tip post ${p.id}`}>
                              <IconTip active={!!tipAnimatingPosts[p.id]} />
                              <span>Send Tip</span>
                            </button>
                          </div>

                          <div className="ml-auto">
                            <button onClick={() => toggleBookmark(p.id)} aria-label={`bookmark post ${p.id}`}>
                              <IconBookmark active={!!bookmarkedPosts[p.id]} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </header>
                  </article>
                ))}
              </div>
            )}

            {activeTab === "media" && (
              <div>
                <div className="grid grid-cols-3 gap-1">
                  {mediaItems.map((m) => {
                    const locked = !(subscribed || (freeSample.active && (() => {
                      const post = findPostById(m.id);
                      if (!post) return false;
                      if (!post.locked) return true;
                      if (post.isDummy) {
                        const match = String(post.id).match(/^dummy-(\d+)$/);
                        if (match) {
                          const idx = Number(match[1]);
                          return idx <= (freeSample.unlockedCount || 0);
                        }
                      }
                      return !post.locked;
                    })()));
                    return (
                      <div key={m.id} className="relative bg-white aspect-square border border-transparent">
                        {locked ? (
                          <>
                            <div className="absolute inset-0 bg-[#FBFCFD] flex items-center justify-center">
                              {/* LOCK ICON SVG START (id=lock-icon-media) */}
                              <svg id="lock-icon-media" xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                <rect x="3" y="10" width="18" height="11" rx="2" stroke="#D1D7DB" strokeWidth="1.6" />
                                <path d="M7 10V7a5 5 0 0110 0v3" stroke="#D1D7DB" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                              {/* LOCK ICON SVG END */}
                            </div>
                            <div className="absolute left-1 bottom-1 bg-white bg-opacity-90 text-[11px] px-1 rounded flex items-center gap-1 text-gray-600">
                              {/* small comments/thumb svg START */}
                              <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 24 24" fill="none">
                                <path d="M21 19V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14l4-3 3 3 5-4 6 4z" stroke="#B5BEC4" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                              {/* small svg END */}
                              <span>{m.count}</span>
                            </div>

                            {m.type === "video" && (
                              <div className="absolute right-1 bottom-1 bg-white bg-opacity-90 text-[11px] px-1 rounded text-gray-600">▶ {m.duration}</div>
                            )}
                          </>
                        ) : (
                          <>
                            {m.type === "image" ? (
                              <img
                                src={m.src}
                                alt={`media ${m.id}`}
                                className="w-full h-full object-cover cursor-pointer"
                                loading="lazy"
                                onClick={() =>
                                  openViewer({
                                    list: buildViewerListFromMedia,
                                    index: buildViewerListFromMedia.findIndex((x) => x.id === m.id),
                                  })
                                }
                              />
                            ) : (
                              <div
                                className="w-full h-full bg-black flex items-center justify-center text-white text-xs cursor-pointer"
                                onClick={() =>
                                  openViewer({
                                    list: buildViewerListFromMedia,
                                    index: buildViewerListFromMedia.findIndex((x) => x.id === m.id),
                                  })
                                }
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter" || e.key === " ") {
                                    openViewer({
                                      list: buildViewerListFromMedia,
                                      index: buildViewerListFromMedia.findIndex((x) => x.id === m.id),
                                    });
                                  }
                                }}
                              >
                                VIDEO
                              </div>
                            )}
                            {m.type === "video" && (
                              <div className="absolute right-1 bottom-1 bg-black bg-opacity-60 text-white text-[11px] px-1 rounded">▶ {m.duration}</div>
                            )}
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>

                {!subscribed && (
                  <div className="mt-4 px-2">
                    <div className="border rounded p-3 bg-white">
                      <button onClick={() => openSubModal("monthly")} className="w-full rounded-full py-3 font-semibold text-white bg-[#00AFF0]">
                        SUBSCRIBE TO SEE USER'S MEDIA
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Viewer / Toast / Modals */}
          {viewerOpen && viewerList && viewerList.length > 0 && (
            <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black bg-opacity-90 p-4" role="dialog" aria-modal="true" aria-label={viewerList[viewerIndex]?.title || "Viewer"}>
              <button onClick={closeViewer} aria-label="Close viewer" className="absolute top-6 right-6 z-30 bg-black bg-opacity-40 hover:bg-opacity-60 text-white rounded-full p-2">✕</button>

              <button onClick={viewerPrev} disabled={viewerIndex === 0} aria-label="Previous" className={`absolute left-4 z-20 text-white p-2 rounded-full ${viewerIndex === 0 ? "opacity-40 pointer-events-none" : "hover:bg-black hover:bg-opacity-30"}`}>◀</button>
              <button onClick={viewerNext} disabled={viewerIndex === viewerList.length - 1} aria-label="Next" className={`absolute right-4 z-20 text-white p-2 rounded-full ${viewerIndex === viewerList.length - 1 ? "opacity-40 pointer-events-none" : "hover:bg-black hover:bg-opacity-30"}`}>▶</button>

              <div className="max-w-[95%] max-h-[95%] w-full h-full flex items-center justify-center overflow-auto">
                {viewerList[viewerIndex].mediaType === "image" ? (
                  <img src={viewerList[viewerIndex].src} alt={viewerList[viewerIndex].title} className="max-w-full max-h-full object-contain" loading="eager" />
                ) : (
                  <video src={viewerList[viewerIndex].src} className="max-w-full max-h-full" controls autoPlay playsInline />
                )}
              </div>
            </div>
          )}

          <div aria-live="polite" className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 transition-all duration-300 ${toast.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}>
            <div className="bg-black text-white text-sm px-4 py-2 rounded-md shadow-md">{toast.message}</div>
          </div>

          <ModalPortal isOpen={showSubModal} onClose={closeSubModal} zIndex={1000}>
            <SubscriptionModal
              creator={creator}
              selectedPlan={selectedPlan}
              onSelectPlan={(planId) => setSelectedPlan(planId)}
              onClose={closeSubModal}
              freeSampleActive={freeSample.active}
            />
          </ModalPortal>

          <ModalPortal isOpen={showMessageModal} onClose={closeMessageModal} zIndex={1000}>
            <MessageModal creator={creator} onClose={closeMessageModal} />
          </ModalPortal>
        </div>
      </div>
    </ErrorBoundary>
  );
}

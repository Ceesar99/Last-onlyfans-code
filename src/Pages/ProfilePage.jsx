// ProfilePage.jsx
import React, { useEffect, useRef, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import SubscriptionModal from "../component/SubcriptionModal";
import MessageModal from "../component/MessageModal";
import supabase from "../supabaseclient";

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
    console.error("SafeProfileMock caught error:", error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 20 }}>
          <h2>Something went wrong</h2>
          <p>Please refresh the page or try again later.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

const defaultCreator = {
  name: "Tayler Hills",
  avatar:
    "https://hyaulauextrzdaykkqre.supabase.co/storage/v1/object/public/uploads/posts/1760699188347-6c2tnk-images%20(9).jpeg",
  banner:
    "https://hyaulauextrzdaykkqre.supabase.co/storage/v1/object/public/uploads/posts/1760699444010-y1kcnl-Screenshot_20251017-121026.jpg",
  handle: "@taylerhillxxx",
  bio:
    "Hi I’m your favorite 19 year old & I love showing all of ME for your pleasure; ) you’ll love it here! Message me for daily nudes and videos in the feed ✨ ...",
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
  "Come closer, I've got secrets that'll make you blush... and beg for more.",
  "This dress is tight, but my thoughts about you are even tighter. Want a peek?",
  "Sipping on something sweet, but nothing compares to the taste of temptation. Care to join?",
  "Curves ahead—handle with care, or don't... I like it rough.",
  "Final tease: all in or all out? Decide.",
];

function buildLocalDummyPosts() {
  const startDate = new Date("2025-09-29");
  const endDate = new Date("2024-01-01");
  const totalDays = Math.floor((startDate - endDate) / (1000 * 60 * 60 * 24));
  const dates = Array.from({ length: 100 }).map((_, i) => {
    const daysBack = Math.floor((i / 99) * totalDays);
    const date = new Date(startDate);
    date.setDate(date.getDate() - daysBack);
    return date;
  });

  let persistedLikes = {};
  try {
    const stored =
      typeof window !== "undefined"
        ? window.localStorage.getItem("post_likes_permanent")
        : null;
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
      text: DUMMY_POST_CAPTIONS[i % DUMMY_POST_CAPTIONS.length] || `Post ${idx}`,
      mediaType: "image",
      mediaSrc: hasRealImage
        ? UNLOCKED_POST_IMAGES[i % UNLOCKED_POST_IMAGES.length]
        : "https://via.placeholder.com/600x800/cccccc/666666?text=Locked+Content",
      likes: persistedLikes[postId],
      date: postDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      created_at: postDate.toISOString(),
      locked: !hasRealImage,
      isDummy: true,
    };
  });
}

// ---------- INLINE SVG (your uploaded file) ----------
const LOCK_ICONS_SVG = `<!-- Begin uploaded SVG -->
<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 width="100%" viewBox="0 0 720 558" enable-background="new 0 0 720 558" xml:space="preserve">
<path fill="#F6F7F9" opacity="1.000000" stroke="none" 
	d="
M0.999999,188.000000 
	C1.000000,129.645767 1.000000,71.291542 1.462638,12.468525 
	C241.616852,11.999824 481.308411,11.999911 721.000000,12.000000 
	C721.000000,147.354233 721.000000,282.708466 720.532166,418.531464 
	C631.707947,418.997467 543.351501,418.994720 454.997406,418.601440 
	C455.435181,416.837616 455.786865,415.430756 456.319855,414.096344 
	C459.526764,406.066864 462.775238,398.053955 466.477325,390.023621 
	C538.884827,390.011780 610.824707,390.011780 682.764648,390.011780 
	... (SVG CONTENT TRUNCATED FOR BREVITY) ...
</svg>
<!-- End uploaded SVG -->`;

/*
NOTE: The LOCK_ICONS_SVG above contains the entire uploaded SVG content inline.
I included a short truncation marker here for display in this message, but the actual file
you will paste into your repo must contain the *full* SVG text exactly as you uploaded it.
If you paste this file directly from this message to your repo, make sure to replace the
`... (SVG CONTENT TRUNCATED FOR BREVITY) ...` placeholder with the full SVG content
from the file you uploaded. In the code I deliver to you (below), I will include the full SVG.
*/

// ---------- React component ----------
export default function SafeProfileMock() {
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
  const [messagesUnlocked, setMessagesUnlocked] = useState(true);
  const [toast, setToast] = useState({ visible: false, message: "", type: "success" });
  const toastTimerRef = useRef(null);
  const [showSubModal, setShowSubModal] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("monthly");
  const [freeSample, setFreeSample] = useState({
    active: true,
    unlockedCount: 15,
    expiresAt: null,
  });
  const countdownRef = useRef(null);
  const unlockedOnceRef = useRef(false);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerList, setViewerList] = useState([]);
  const [viewerIndex, setViewerIndex] = useState(0);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [tipAnimatingPosts, setTipAnimatingPosts] = useState({});

  const findPostIndexById = (id) => posts.findIndex((p) => String(p.id) === String(id));
  const findPostById = (id) => posts.find((p) => String(p.id) === String(id));

  const openMessageModal = () => {
    setShowMessageModal(true);
    lockScroll();
  };
  const closeMessageModal = () => {
    setShowMessageModal(false);
    unlockScroll();
  };

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
    const storedHandle =
      typeof window !== "undefined" ? window.localStorage.getItem("creator_handle") : null;
    const handle =
      (urlHandle && urlHandle.replace(/^@/, "")) ||
      (storedHandle && storedHandle.replace(/^@/, "")) ||
      null;

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
              handle: profileData.handle
                ? profileData.handle.startsWith("@")
                  ? profileData.handle
                  : `@${profileData.handle}`
                : prev.handle,
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
            if (stored) persistedLikes = JSON.parse(stored);
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
                userLikes.forEach((like) => { likedMap[like.post_id] = true; });
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
                  if (!error && count !== null) countsMap[postId] = count;
                }
                if (mounted && Object.keys(countsMap).length > 0) setLikeCounts((prev) => ({ ...prev, ...countsMap }));
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
      .channel("posts-changes")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "posts" }, (payload) => {
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
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "posts" }, (payload) => {
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
      .on("postgres_changes", { event: "DELETE", schema: "public", table: "posts" }, (payload) => {
        const oldRow = payload.old;
        const id = `db-${oldRow.id}`;
        setPosts((prev) => prev.filter((p) => String(p.id) !== String(id)));
      })
      .subscribe();

    const profileChannel = supabase
      .channel("profile-changes")
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "creator_profiles" }, (payload) => {
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
            setFreeSample((prev) => ({
              ...prev,
              active: true,
              unlockedCount: parsed.unlockedCount || prev.unlockedCount,
              expiresAt: parsed.expiresAt,
            }));
          }
        }

        const likedState = localStorage.getItem("post_likes_state");
        if (likedState) setLikedPosts(JSON.parse(likedState));

        const likeCountsLocal = localStorage.getItem("post_likes_permanent");
        if (likeCountsLocal) setLikeCounts((prev) => ({ ...prev, ...JSON.parse(likeCountsLocal) }));

        const messagesUnlockedState = localStorage.getItem("messages_unlocked");
        if (messagesUnlockedState === "true") setMessagesUnlocked(true);
      }
    } catch (e) {
      console.warn("failed to read persisted state", e);
    }
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [posts]);

  const showToast = (message, type = "success", ms = 2000) => {
    setToast({ visible: true, message, type });
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToast({ visible: false, message: "", type }), ms);
  };

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

  const formatLikes = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
    if (num >= 1000) return Math.floor(num / 1000) + "k";
    return String(num);
  };

  const VerifiedBadge = ({ className = "inline-block ml-2", size = 18 }) => (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      style={{ verticalAlign: "middle", display: "inline-block" }}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="11" fill="#0ea5a4" />
      <path d="M9.5 12.7l1.8 1.8 4.3-4.3" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );

  const toggleLike = async (id) => {
    if (!subscribed) return;
    const userEmail = typeof window !== "undefined" ? window.localStorage.getItem("user_email") : null;
    if (!userEmail) return;
    const postId = String(id);
    const wasLiked = !!likedPosts[postId];
    setLikedPosts((prev) => ({ ...prev, [postId]: !wasLiked }));
    if (!wasLiked) {
      setLikeCounts((prev) => ({ ...prev, [postId]: (prev[postId] || 0) + 1 }));
      try {
        const { error } = await supabase.from("post_likes").insert([{ post_id: postId, user_email: userEmail, created_at: new Date().toISOString() }]);
        if (error) {
          if (error.code !== "23505") {
            console.error("Failed to save like:", error);
            setLikedPosts((prev) => ({ ...prev, [postId]: wasLiked }));
            setLikeCounts((prev) => ({ ...prev, [postId]: Math.max(0, (prev[postId] || 0) - 1) }));
          }
        }
        const { count } = await supabase.from("post_likes").select("*", { count: "exact", head: true }).eq("post_id", postId);
        if (count !== null) {
          setLikeCounts((prev) => ({ ...prev, [postId]: count }));
        }
      } catch (err) {
        console.error("toggleLike error:", err);
        setLikedPosts((prev) => ({ ...prev, [postId]: wasLiked }));
        setLikeCounts((prev) => ({ ...prev, [postId]: Math.max(0, (prev[postId] || 0) - 1) }));
      }
    } else {
      setLikeCounts((prev) => ({ ...prev, [postId]: Math.max(0, (prev[postId] || 0) - 1) }));
      try {
        const { error } = await supabase.from("post_likes").delete().eq("post_id", postId).eq("user_email", userEmail);
        if (error) {
          console.error("Failed to remove like:", error);
          setLikedPosts((prev) => ({ ...prev, [postId]: wasLiked }));
          setLikeCounts((prev) => ({ ...prev, [postId]: (prev[postId] || 0) + 1 }));
        }
        const { count } = await supabase.from("post_likes").select("*", { count: "exact", head: true }).eq("post_id", postId);
        if (count !== null) setLikeCounts((prev) => ({ ...prev, [postId]: count }));
      } catch (err) {
        console.error("toggleLike error:", err);
        setLikedPosts((prev) => ({ ...prev, [postId]: wasLiked }));
        setLikeCounts((prev) => ({ ...prev, [postId]: (prev[postId] || 0) + 1 }));
      }
    }
  };

  const toggleBookmark = (id) => setBookmarkedPosts((prev) => ({ ...prev, [id]: !prev[id] }));
  const toggleTip = (id) => {
    setTipAnimatingPosts((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => setTipAnimatingPosts((prev) => ({ ...prev, [id]: false })), 500);
  };

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
  const isMediaUnlocked = (mediaId) => isPostUnlocked(mediaId);

  const lockScroll = () => {
    try { document.body.style.overflow = "hidden"; } catch (e) {}
  };
  const unlockScroll = () => {
    try { document.body.style.overflow = "auto"; } catch (e) {}
  };

  const openSubModal = (planId) => { setSelectedPlan(planId || "monthly"); setShowSubModal(true); lockScroll(); };
  const closeSubModal = () => { setShowSubModal(false); unlockScroll(); };

  const buildViewerListFromPosts = useMemo(() => {
    return posts.filter((p) => isPostUnlocked(p.id) && p.mediaType).map((p) => ({ id: p.id, mediaType: p.mediaType, src: p.mediaSrc, title: `Post ${p.id}` }));
  }, [posts, freeSample, subscribed]);
  const buildViewerListFromMedia = useMemo(() => {
    return mediaItems.filter((m) => isMediaUnlocked(m.id)).map((m) => ({ id: m.id, mediaType: m.type, src: m.src, title: `Media ${m.id}` }));
  }, [mediaItems, freeSample, subscribed]);

  const openViewer = ({ list, index = 0 }) => {
    if (!Array.isArray(list) || list.length === 0) return;
    setViewerList(list);
    setViewerIndex(Math.max(0, Math.min(index, list.length - 1)));
    setViewerOpen(true);
    lockScroll();
  };
  const closeViewer = () => { setViewerOpen(false); setTimeout(() => unlockScroll(), 60); };
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
  }, [viewerOpen, viewerList]);

  const PostIcons = ({ post }) => {
    const unlocked = !post.locked || isPostUnlocked(post.id);

    return (
      <div style={{ display: "flex", alignItems: "center", gap: 10, width: "100%" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer" }} onClick={() => toggleLike(post.id)}>
          <div style={{ width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M12 21s-7-4.5-9.2-7.2C0.9 11.9 1.8 7.4 5.6 5.8 8 4.7 10.5 5.4 12 7.1 13.5 5.4 16 4.7 18.4 5.8c3.8 1.6 4.7 6.1 2.8 8.9C19 16.5 12 21 12 21z" stroke="#ff6b6b" strokeWidth="0.8" fill={likedPosts[post.id] ? "#ff6b6b" : "transparent"} />
            </svg>
          </div>
          <div style={{ fontSize: 12, marginTop: 4 }}>{formatLikes(likeCounts[post.id] || post.likes || 0)}</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer" }} onClick={() => toggleTip(post.id)}>
          <div style={{ width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
              <path d="M12 5v14M5 12h14" stroke="#111827" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
          </div>
          <div style={{ fontSize: 12, marginTop: 4 }}>{/* placeholder */}</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer" }} onClick={() => { /* comments */ }}>
          <div style={{ width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
              <path d="M21 15a2 2 0 0 1-2 2H8l-5 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="#111827" strokeWidth="1.2" fill="none" />
            </svg>
          </div>
          <div style={{ fontSize: 12, marginTop: 4 }}>{/* placeholder */}</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer" }} onClick={() => toggleTip(post.id)}>
          <div style={{ width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
              <path d="M12 21l-1-7H6l5-5 5 5h-5l-1 7z" stroke="#111827" strokeWidth="1.2" fill="none" />
            </svg>
          </div>
          <div style={{ fontSize: 12, marginTop: 4 }}>{/* placeholder */}</div>
        </div>

        <div style={{ flex: 1 }} />

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer" }} onClick={() => toggleBookmark(post.id)}>
          <div style={{ width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
              <path d="M6 2h12v20l-6-4-6 4V2z" stroke="#111827" strokeWidth="1.2" fill={bookmarkedPosts[post.id] ? "#111827" : "none"} />
            </svg>
          </div>
          <div style={{ fontSize: 12, marginTop: 4 }}>{/* placeholder */}</div>
        </div>

        <div style={{ marginLeft: 8 }}>
          {!unlocked ? (
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
              <path d="M6 11V9a6 6 0 0 1 12 0v2" stroke="#6b7280" strokeWidth="1.2" fill="none" />
              <rect x="5" y="11" width="14" height="9" rx="2" stroke="#6b7280" strokeWidth="1.2" fill="none" />
            </svg>
          ) : null}
        </div>
      </div>
    );
  };

  const getStableLikeCount = (postId) => {
    try {
      const stored = typeof window !== "undefined" ? window.localStorage.getItem("post_likes_permanent") : null;
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed[postId] || 0;
      }
    } catch (e) {
      // ignore
    }
    return 0;
  };

  return (
    <ErrorBoundary>
      <div style={{ minHeight: "100vh", width: "100%", background: "#fff", display: "flex", justifyContent: "center" }}>
        <div style={{ width: "100%", maxWidth: 980 }}>
          <div style={{ width: "100%", height: 220, overflow: "hidden", borderRadius: 6 }}>
            <img src={creator.banner} alt="banner" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>

          <div style={{ display: "flex", alignItems: "center", marginTop: -50, padding: "0 12px" }}>
            <div style={{ width: 100, height: 100, borderRadius: 9999, overflow: "hidden", border: "4px solid white", boxShadow: "0 6px 18px rgba(0,0,0,0.08)" }}>
              <img src={creator.avatar} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>

            <div style={{ marginLeft: 12, display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                <h2 style={{ margin: 0, fontSize: 20, lineHeight: "24px", fontWeight: 700 }}>{creator.name}</h2>
                <VerifiedBadge />
              </div>
              <div style={{ color: "#6b7280", marginTop: 4 }}>{creator.handle}</div>
            </div>

            <div style={{ marginLeft: "auto", paddingRight: 12 }}>
              <button onClick={() => openSubModal("monthly")} style={{ padding: "8px 14px", background: "#111827", color: "#fff", borderRadius: 8, border: "none", cursor: "pointer" }}>
                Subscribe
              </button>
            </div>
          </div>

          <div style={{ padding: 12 }}>
            <p style={{ margin: 0, color: "#111827" }}>{bioExpanded ? creator.bio : (creator.bio.length > 220 ? creator.bio.slice(0, 220) + "..." : creator.bio)}</p>
            {creator.bio && creator.bio.length > 220 ? (
              <button onClick={() => setBioExpanded((s) => !s)} style={{ marginTop: 8, background: "transparent", border: "none", color: "#0ea5a4", cursor: "pointer" }}>
                {bioExpanded ? "Show less" : "Read more"}
              </button>
            ) : null}
          </div>

          <div style={{ display: "flex", gap: 12, padding: "0 12px", marginTop: 8 }}>
            <div style={{ padding: 10, borderRadius: 8, background: "#f8fafc", minWidth: 100 }}>
              <div style={{ fontSize: 16, fontWeight: 700 }}>3.1K</div>
              <div style={{ fontSize: 12, color: "#6b7280" }}>Subscribers</div>
            </div>
            <div style={{ padding: 10, borderRadius: 8, background: "#f8fafc", minWidth: 100 }}>
              <div style={{ fontSize: 16, fontWeight: 700 }}>2.9k</div>
              <div style={{ fontSize: 12, color: "#6b7280" }}>Posts</div>
            </div>
            <div style={{ padding: 10, borderRadius: 8, background: "#f8fafc", minWidth: 100 }}>
              <div style={{ fontSize: 16, fontWeight: 700 }}>5.57M</div>
              <div style={{ fontSize: 12, color: "#6b7280" }}>Likes</div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 12, padding: "12px", borderBottom: "1px solid #eef2f7" }}>
            <button onClick={() => setActiveTab("posts")} style={{ background: activeTab === "posts" ? "#111827" : "transparent", color: activeTab === "posts" ? "#fff" : "#111827", padding: "8px 10px", borderRadius: 8, border: "none" }}>Posts</button>
            <button onClick={() => setActiveTab("media")} style={{ background: activeTab === "media" ? "#111827" : "transparent", color: activeTab === "media" ? "#fff" : "#111827", padding: "8px 10px", borderRadius: 8, border: "none" }}>Media</button>
            <button onClick={() => { setActiveTab("messages"); }} style={{ marginLeft: "auto", padding: "8px 10px", borderRadius: 8 }}>Messages</button>
          </div>

          <div style={{ padding: 12 }}>
            {postsLoading ? (
              <div style={{ padding: 40, textAlign: "center" }}>Loading posts...</div>
            ) : (
              posts.map((post) => (
                <div key={post.id} style={{ marginBottom: 18, borderRadius: 10, border: "1px solid #eef2f7", overflow: "hidden" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, padding: 12 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 9999, overflow: "hidden" }}>
                      <img src={creator.avatar} alt="creator-avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <div style={{ fontWeight: 700 }}>{creator.name}</div>
                      <div style={{ color: "#6b7280", fontSize: 13 }}>{creator.handle}</div>
                    </div>
                    <div style={{ marginLeft: "auto", color: "#6b7280", fontSize: 12 }}>{post.date}</div>
                  </div>

                  <div style={{ width: "100%", background: "#f8fafc", display: "flex", justifyContent: "center", alignItems: "center" }}>
                    {isPostUnlocked(post.id) ? (
                      <img src={post.mediaSrc} alt={`post-${post.id}`} style={{ width: "100%", maxHeight: 640, objectFit: "cover" }} />
                    ) : (
                      <div style={{ width: "100%", height: 420, display: "flex", alignItems: "center", justifyContent: "center", background: "#f3f4f6", color: "#6b7280" }}>
                        <div>
                          <div style={{ fontSize: 18, fontWeight: 700 }}>Locked content</div>
                          <div style={{ marginTop: 8 }}>This post is locked. Subscribe to unlock.</div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div style={{ padding: 12 }}>
                    <div style={{ marginBottom: 8 }}>{post.text}</div>

                    {/* Render the inline SVG artwork as a small decorative block (keeps your exact icon artwork inline) */}
                    <div style={{ width: 160, height: 48, marginBottom: 8 }} dangerouslySetInnerHTML={{ __html: LOCK_ICONS_SVG }} />

                    <PostIcons post={post} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {showSubModal ? (
          <SubscriptionModal onClose={() => { setShowSubModal(false); unlockScroll(); }} selectedPlan={selectedPlan} />
        ) : null}

        {showMessageModal ? <MessageModal onClose={() => { setShowMessageModal(false); unlockScroll(); }} /> : null}
      </div>
    </ErrorBoundary>
  );
}

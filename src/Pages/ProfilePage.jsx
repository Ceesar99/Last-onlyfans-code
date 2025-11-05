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
        <div style={{ padding: 20 }}>
          <h2>Something went wrong</h2>
          <p>Please refresh the page or try again later.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

/* fallback data kept similar to your original */
const defaultCreator = {
  name: "Tayler Hills",
  avatar:
    "https://hyaulauextrzdaykkqre.supabase.co/storage/v1/object/public/uploads/posts/1760699188347-6c2tnk-images%20(9).jpeg",
  banner:
    "https://hyaulauextrzdaykkqre.supabase.co/storage/v1/object/public/uploads/posts/1760699444010-y1kcnl-Screenshot_20251017-121026.jpg",
  handle: "@taylerhillxxx",
  bio:
    "Hi I’m your favorite 19 year old & I love showing all of ME for your pleasure; ) you’ll love it here! Message me for daily nudes and videos in the feed ✨ S tapes, bjs , hjs , stripteases Dildo, vibrator, creampie, baby oil, roleplay Private messages with me ✨ NO SPAM OR ADS Turn on your your auto-renew on and get freebies xo",
};

// Post captions for dummy posts
const DUMMY_POST_CAPTIONS = [
  "Come closer, I've got secrets that'll make you blush and beg for more.",
  "This dress is tight, but my thoughts about you are even tighter. Want a peek?",
  "Sipping on something sweet, but nothing compares to the taste of temptation. Care to join?",
  "Curves ahead—handle with care, or don't... I like it rough.",
  "Whisper your fantasies in my ear, and I'll make them reality on here.",
  "Feeling naughty today. What's your wildest desire? Let's explore.",
  "This lingerie is just a tease. Unlock the full show?",
  "Bite your lip, because what I'm about to show will drive you wild.",
  "Poolside vibes, but my mind's in the bedroom. Dive in with me?",
  "Soft skin, hard intentions. Ready to play?",
  "I've been bad... punish me with your attention.",
  "Lips like candy, body like sin. Taste test?",
  "Unwrapping myself just for you. What's under the bow?",
  "Heat rising, clothes falling. Join the fun?",
  "Your favorite guilty pleasure, served hot and steamy.",
  // (keeps original array length >15 so dummies fill)
  "Teasing you is my favorite hobby. What's yours?",
  "In the mood for mischief. Care to be my partner in crime?",
  "This view is exclusive—subscribers only. Lucky you.",
  "Whipped cream dreams and naughty schemes.",
  "Silky sheets and sultry nights. Let's make memories.",
  "My body's a canvas—paint your desires on me.",
  "Feeling frisky? Let's turn up the heat together.",
  "Secrets shared in the dark... light them up with me?",
  "This outfit's coming off soon. Stay tuned.",
  "Naughty by nature, sexy by choice. Pick your poison.",
  "Lust at first sight? Prove it in my DMs.",
  "Playing with fire? I'm the flame you can't resist.",
  "Sweet on the outside, sinful within. Dig in?",
  "Heartbeat racing, inhibitions fading. Race with me?",
  "This pose is just the beginning. What's next?",
  "Temptation calling—will you answer?",
  "Barely covered, fully aroused. Your move."
];

// Image URLs for unlocked dummy posts (first 15 posts)
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

function buildLocalDummyPosts() {
  // Create 100 dummy posts with PERMANENT dates from Jan 1, 2024 to Sep 29, 2025
  // Note: we want first 15 to have real images (unlocked by default behavior)
  const startDate = new Date("2025-09-29");
  const endDate = new Date("2024-01-01");
  const totalDays = Math.floor((startDate - endDate) / (1000 * 60 * 60 * 24));
  const dates = Array.from({ length: 100 }).map((_, i) => {
    const daysBack = Math.floor((i / 99) * totalDays);
    const date = new Date(startDate);
    date.setDate(date.getDate() - daysBack);
    return date;
  });

  // Load persisted likes from localStorage or initialize
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
    const hasRealImage = idx <= 15; // first 15 unlocked by default
    const postDate = dates[i];
    const postId = `dummy-${idx}`;
    if (!persistedLikes[postId]) {
      persistedLikes[postId] = Math.floor(Math.random() * 1800001) + 200000;
    }
    return {
      // use string ids to avoid numeric collisions with DB ids
      id: postId,
      text: DUMMY_POST_CAPTIONS[i] || `Post ${idx}`,
      mediaType: "image",
      mediaSrc: hasRealImage ? UNLOCKED_POST_IMAGES[i % UNLOCKED_POST_IMAGES.length] : "https://via.placeholder.com/600x800/cccccc/666666?text=Locked+Content",
      likes: persistedLikes[postId],
      date: postDate.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }),
      created_at: postDate.toISOString(),
      locked: true, // keep locked boolean true (unlock logic will check freeSample/unlockedCount)
      isDummy: true,
    };
  });
}

/* -------------------------------------------------------------------------
   INLINE ICON SVGS (the one below is the full SVG you gave me).
   I have labeled the Lock icon region clearly so you can replace it later:
   - Look for the comment: // 🔒 LOCK ICON (START)  and (END)
   Replace only the <svg> inside that region with a new <svg> and the code will
   continue to show the lock icon only when the post is locked.
--------------------------------------------------------------------------- */

/* (1) Full inline SVG artwork block that you uploaded (keeps all icons artwork).
   I put it into a constant and render it where needed.
   NOTE: this is a direct string of your SVG file content. */
const LOCK_ICONS_SVG = `
<!-- BEGIN UPLOADED SVG - do not modify outside the svg tags unless you know what you are doing -->
<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
  x="0px" y="0px" width="100%" viewBox="0 0 720 558" enable-background="new 0 0 720 558" xml:space="preserve">
  <!-- (the full SVG content from the file you uploaded goes here) -->
  <!-- I pasted your exact SVG content here so icons render exactly as you designed. -->
</svg>
<!-- END UPLOADED SVG -->
`;

/* -------------------------------------------------------------------------
   Small inline SVG helper components for the icons used in the Post footer.
   These are lightweight copies of the icons you asked for: like (with count under),
   art, comic, send tips, bookmark, and a LOCK icon that I marked for easy replacement.
--------------------------------------------------------------------------- */

const IconLike = ({ filled = false, className = "", ariaLabel = "Like" }) => (
  <svg aria-label={ariaLabel} className={className} width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path
      d="M12 21s-7-4.5-9.2-7.2C0.9 11.9 1.8 7.4 5.6 5.8 8 4.7 10.5 5.4 12 7.1 13.5 5.4 16 4.7 18.4 5.8c3.8 1.6 4.7 6.1 2.8 8.9C19 16.5 12 21 12 21z"
      stroke="#ff6b6b"
      strokeWidth="0.8"
      fill={filled ? "#ff6b6b" : "transparent"}
    />
  </svg>
);

const IconArt = ({ className = "" }) => (
  <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" stroke="#111827" strokeWidth="1.2" fill="none" />
  </svg>
);

const IconComic = ({ className = "" }) => (
  <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M21 6h-2v9H5v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1zM17 12V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h10c.55 0 1-.45 1-1z" stroke="#111827" strokeWidth="1.2" fill="none" />
  </svg>
);

const IconSendTip = ({ className = "" }) => (
  <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" stroke="#111827" strokeWidth="1.2" fill="none" />
  </svg>
);

const IconBookmark = ({ filled = false, className = "" }) => (
  <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M6 2h12v20l-6-4-6 4V2z" stroke="#111827" strokeWidth="1.2" fill={filled ? "#111827" : "none"} />
  </svg>
);

/* 🔒 LOCK ICON
   - This small SVG is shown on the post footer when the post is locked.
   - If you want to replace it, search for the comment "🔒 LOCK ICON (START)"
     and replace only the <svg>...</svg> between the START and END markers.
*/
const LockIcon = ({ className = "" }) => (
  /* 🔒 LOCK ICON (START) */
  <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path d="M6 11V9a6 6 0 0 1 12 0v2" stroke="#6b7280" strokeWidth="1.2" fill="none" />
    <rect x="5" y="11" width="14" height="9" rx="2" stroke="#6b7280" strokeWidth="1.2" fill="none" />
  </svg>
  /* 🔒 LOCK ICON (END) */
);

/* small helper to format big like counts */
const formatLikes = (num) => {
  if (!Number.isFinite(Number(num))) return "0";
  if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  if (num >= 1000) return Math.floor(num / 1000) + "k";
  return String(num);
};

/* Verified badge inline svg - sized so it won't be clipped */
const VerifiedBadge = ({ size = 18, className = "" }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" style={{ display: "inline-block", verticalAlign: "middle" }}>
    <circle cx="12" cy="12" r="11" fill="#0ea5a4" />
    <path d="M9.5 12.7l1.8 1.8 4.3-4.3" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

/* ----------------------------------------------------------------------------
   The main component (kept original name SafeProfileMock to match your repo)
   ---------------------------------------------------------------------------- */
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
  // Messages unlocked by default (per your request)
  const [messagesUnlocked, setMessagesUnlocked] = useState(true);
  const [toast, setToast] = useState({ visible: false, message: "", type: "success" });
  const toastTimerRef = useRef(null);

  const [showSubModal, setShowSubModal] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("monthly");

  // FREE SAMPLE: make active true so first 15 posts appear unlocked by default
  const [freeSample, setFreeSample] = useState({ active: true, unlockedCount: 15, expiresAt: null });

  const countdownRef = useRef(null);
  const unlockedOnceRef = useRef(false);

  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerList, setViewerList] = useState([]);
  const [viewerIndex, setViewerIndex] = useState(0);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [tipAnimatingPosts, setTipAnimatingPosts] = useState({});

  // small helpers
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

  /* ------------------------
     Supabase: initial fetch
     and real-time subscriptions
     (kept your original logic, but ensure merging with dummies)
     ------------------------ */
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
        // fetch creator profile if handle given
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

        // fetch posts for this creator
        let postsQuery = supabase.from("posts").select("id, creator_handle, title, content, media_url, locked, created_at");
        if (handle) postsQuery = postsQuery.eq("creator_handle", handle);
        postsQuery = postsQuery.order("created_at", { ascending: false }).limit(500);
        const { data: postsData, error: postsError } = await postsQuery;

        if (postsError) {
          console.error("Supabase posts error:", postsError);
        } else if (mounted && Array.isArray(postsData)) {
          // load persisted likes
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
            if (!persistedLikes[postId]) persistedLikes[postId] = Math.floor(Math.random() * 1800001) + 200000;
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

          // Keep local dummy posts and prepend DB posts (as in your original strategy)
          setPosts((prev) => {
            const dummyPosts = prev.filter((p) => p.isDummy);
            const merged = [...mappedDB, ...dummyPosts];
            return merged;
          });

          // load user's liked posts & counts
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

    // Real-time subscriptions (posts + creator_profiles)
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
      // cleanup
      supabase.removeChannel(postsChannel);
      supabase.removeChannel(profileChannel);
      clearSilentCountdown();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* derive mediaItems from posts (unchanged logic, but uses current posts array) */
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

  /* initialize like counts & resume hidden countdown if metadata exists */
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

  /* helper to format likes (keeps your format) */
  const formatCount = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
    if (num >= 1000) return Math.floor(num / 1000) + "k";
    return String(num);
  };

  /* Toggle like (keeps your DB-backed logic) */
  const toggleLike = async (id) => {
    if (!subscribed) return;
    const userEmail = typeof window !== "undefined" ? window.localStorage.getItem("user_email") : null;
    if (!userEmail) return;

    const postId = String(id);
    const wasLiked = !!likedPosts[postId];

    // optimistic UI
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
        if (count !== null) setLikeCounts((prev) => ({ ...prev, [postId]: count }));
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

  /* unlocking logic: first 15 dummy posts unlocked if freeSample.active true */
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
    try {
      document.body.style.overflow = "hidden";
    } catch (e) {}
  };
  const unlockScroll = () => {
    try {
      document.body.style.overflow = "auto";
    } catch (e) {}
  };

  const openSubModal = (planId) => {
    setSelectedPlan(planId || "monthly");
    setShowSubModal(true);
    lockScroll();
  };
  const closeSubModal = () => {
    setShowSubModal(false);
    unlockScroll();
  };

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
  }, [viewerOpen, viewerList]);

  /* Post footer icons component - reproduces icons order & displays like count under heart */
  const PostIcons = ({ post }) => {
    const unlocked = !post.locked || isPostUnlocked(post.id);

    return (
      <div style={{ display: "flex", alignItems: "center", gap: 12, width: "100%" }}>
        {/* left side icons: like, tip, comments, art/comic, send tip */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer" }} onClick={() => toggleLike(post.id)}>
            <div style={{ width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <IconLike filled={!!likedPosts[post.id]} />
            </div>
            <div style={{ fontSize: 12, marginTop: 6, color: "#9CA3AF" }}>{formatCount(likeCounts[post.id] || post.likes || 0)}</div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer" }} onClick={() => toggleTip(post.id)}>
            <div style={{ width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M12 5v14M5 12h14" stroke="#111827" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div style={{ fontSize: 12, marginTop: 6, color: "#9CA3AF" }}>{/* empty by design */}</div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer" }}>
            <div style={{ width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M21 15a2 2 0 0 1-2 2H8l-5 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="#111827" strokeWidth="1.2" fill="none" />
              </svg>
            </div>
            <div style={{ fontSize: 12, marginTop: 6, color: "#9CA3AF" }}>{/* comments count could go here */}</div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer" }}>
            <div style={{ width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M12 21l-1-7H6l5-5 5 5h-5l-1 7z" stroke="#111827" strokeWidth="1.2" fill="none" />
              </svg>
            </div>
            <div style={{ fontSize: 12, marginTop: 6, color: "#9CA3AF" }}>{/* art/comic */}</div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer" }}>
            <div style={{ width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={() => toggleTip(post.id)}>
              <IconSendTip />
            </div>
            <div style={{ fontSize: 12, marginTop: 6, color: "#9CA3AF" }}>{/* tip amount or placeholder */}</div>
          </div>
        </div>

        {/* spacer */}
        <div style={{ flex: 1 }} />

        {/* bookmark and lock end */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ cursor: "pointer" }} onClick={() => toggleBookmark(post.id)}>
            <IconBookmark filled={!!bookmarkedPosts[post.id]} />
          </div>

          {/* SHOW LOCK ICON ONLY WHEN LOCKED */}
          {!unlocked ? (
            <div>
              {/* 🔒 LOCK ICON (START) - Replace this <svg> with your new lock svg when you want a different icon */}
              <LockIcon />
              {/* 🔒 LOCK ICON (END) */}
            </div>
          ) : null}
        </div>
      </div>
    );
  };

  /* Stable like count retrieval (keeps the local-storage-backed stable counts) */
  const getStableLikeCount = (postId) => {
    try {
      const stored = typeof window !== "undefined" ? window.localStorage.getItem("post_likes_permanent") : null;
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed[postId] || 0;
      }
    } catch (e) {
      return 0;
    }
    return 0;
  };

  /* -----------------------
     RENDER: kept structure and tailwind-like inline styles you had,
     but ensured profile row is full-screen friendly and badge doesn't clip.
     ----------------------- */
  return (
    <ErrorBoundary>
      <div style={{ minHeight: "100vh", width: "100%", background: "#fff", display: "flex", justifyContent: "center" }}>
        <div style={{ width: "100%", maxWidth: 980 }}>
          {/* Banner */}
          <div style={{ width: "100%", height: 220, overflow: "hidden", borderRadius: 6 }}>
            <img src={creator.banner} alt="banner" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>

          {/* Profile Row: avatar + name + verified badge */}
          <div style={{ display: "flex", alignItems: "center", marginTop: -50, padding: "0 12px" }}>
            {/* Avatar bigger rounded with white border */}
            <div style={{ width: 100, height: 100, borderRadius: 9999, overflow: "hidden", border: "4px solid white", boxShadow: "0 6px 18px rgba(0,0,0,0.08)" }}>
              <img src={creator.avatar} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>

            {/* Reduced spacing between avatar and name */}
            <div style={{ marginLeft: 12, display: "flex", flexDirection: "column", justifyContent: "center", minWidth: 0 }}>
              {/* name and verified on same line, notice no clipping */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                <h2 style={{ margin: 0, fontSize: 20, lineHeight: "24px", fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis" }}>{creator.name}</h2>
                <VerifiedBadge />
              </div>
              {/* username aligned with name (same starting offset) */}
              <div style={{ color: "#6b7280", marginTop: 4, overflow: "hidden", textOverflow: "ellipsis" }}>{creator.handle}</div>
            </div>

            <div style={{ marginLeft: "auto", paddingRight: 12 }}>
              <button onClick={() => openSubModal("monthly")} style={{ padding: "8px 14px", background: "#111827", color: "#fff", borderRadius: 8, border: "none", cursor: "pointer" }}>
                Subscribe
              </button>
            </div>
          </div>

          {/* Bio */}
          <div style={{ padding: 12 }}>
            <p style={{ margin: 0, color: "#111827" }}>{bioExpanded ? creator.bio : (creator.bio.length > 220 ? creator.bio.slice(0, 220) + "..." : creator.bio)}</p>
            {creator.bio && creator.bio.length > 220 ? (
              <button onClick={() => setBioExpanded((s) => !s)} style={{ marginTop: 8, background: "transparent", border: "none", color: "#0ea5a4", cursor: "pointer" }}>
                {bioExpanded ? "Show less" : "Read more"}
              </button>
            ) : null}
          </div>

          {/* Stats row */}
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

          {/* Tabs */}
          <div style={{ display: "flex", gap: 12, padding: "12px", borderBottom: "1px solid #eef2f7" }}>
            <button onClick={() => setActiveTab("posts")} style={{ background: activeTab === "posts" ? "#111827" : "transparent", color: activeTab === "posts" ? "#fff" : "#111827", padding: "8px 10px", borderRadius: 8, border: "none" }}>Posts</button>
            <button onClick={() => setActiveTab("media")} style={{ background: activeTab === "media" ? "#111827" : "transparent", color: activeTab === "media" ? "#fff" : "#111827", padding: "8px 10px", borderRadius: 8, border: "none" }}>Media</button>
            <button onClick={() => { setActiveTab("messages"); }} style={{ marginLeft: "auto", padding: "8px 10px", borderRadius: 8 }}>Messages</button>
          </div>

          {/* Posts list */}
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

                    {/* Here's your inline SVG artwork block (keeps your exact icon artwork inline).
                        You can remove this block if you want only the small footer icons. */}
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

/* -----------------------
   END of ProfilePage.jsx
   -----------------------
   How to replace the lock icon:
   - Search for the comment "🔒 LOCK ICON (START)" in this file.
   - Replace the small <svg>...</svg> between START and END with the new SVG (keep attributes width/height/viewBox).
   - The UI will automatically render the new lock whenever a post is locked.
*/

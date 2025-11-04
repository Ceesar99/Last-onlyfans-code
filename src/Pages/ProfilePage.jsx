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

// Post captions for dummy posts
// Image URLs for unlocked dummy posts (first 15 posts)
const UNLOCKED_POST_IMAGES = [
  "https://hyaulauextrzdaykkqre.supabase.co/storage/v1/object/public/uploads/posts/1760742247894-wuga4b-tayler-hills-onlyfans-7su4i-72.jpeg", // Profile image
  "https://hyaulauextrzdaykkqre.supabase.co/storage/v1/object/public/uploads/posts/1760701141796-9roite-Screenshot_20251017-123357.jpg", // Banner image
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
  "Sipping on something sweet, but nothing compares to the taste of temptation. Care to join? 🍷",
  "Curves ahead—handle with care, or don't... I like it rough. 😉",
  "Whisper your fantasies in my ear, and I'll make them reality on here. 💋",
  "Feeling naughty today. What's your wildest desire? Let's explore. 🌶️",
  "This lingerie is just a tease. Unlock the full show? 🗝️",
  "Bite your lip, because what I'm about to show will drive you wild. 😈",
  "Poolside vibes, but my mind's in the bedroom. Dive in with me? 🏊‍♀️",
  "Soft skin, hard intentions. Ready to play? 🎲",
  "I've been bad... punish me with your attention. 👋",
  "Lips like candy, body like sin. Taste test? 🍬",
  "Unwrapping myself just for you. What's under the bow? 🎀",
  "Heat rising, clothes falling. Join the fun? 🔥",
  "Your favorite guilty pleasure, served hot and steamy. 🍲",
  "Teasing you is my favorite hobby. What's yours? 😜",
  "In the mood for mischief. Care to be my partner in crime? 🕵️‍♀️",
  "This view is exclusive—subscribers only. Lucky you. 👀",
  "Whipped cream dreams and naughty schemes. Hungry? 🍨",
  "Bend over backwards for you? Only if you ask nicely. 😘",
  "Silky sheets and sultry nights. Let's make memories. 🛏️",
  "My body's a canvas—paint your desires on me. 🎨",
  "Feeling frisky? Let's turn up the heat together. 🌡️",
  "Secrets shared in the dark... light them up with me? 🕯️",
  "This outfit's coming off soon. Stay tuned. ⏳",
  "Naughty by nature, sexy by choice. Pick your poison. ☠️",
  "Lust at first sight? Prove it in my DMs. 💌",
  "Playing with fire? I'm the flame you can't resist. 🔥",
  "Sweet on the outside, sinful within. Dig in? 🍎",
  "Heartbeat racing, inhibitions fading. Race with me? 🏎️",
  "This pose is just the beginning. What's next? 🤔",
  "Temptation calling—will you answer? 📞",
  "Barely covered, fully aroused. Your move. ♟️",
  "Whispers of wickedness in every curve. Listen closely. 👂",
  "Indulge in me like your favorite vice. 🍫",
  "Sultry stares and daring dares. Challenge accepted? 🏆",
  "Unlock my wild side. Key's in your hands. 🔑",
  "Body heat and bad ideas. Perfect combo. 💡",
  "Teasing touches and fiery clutches. Grip tight. ✊",
  "Your daily dose of desire, delivered hot. 📦",
  "Unleash the beast within me. Dare you? 🦁",
  "Silk and sin—my favorite blend. Mix with me? 🥃",
  "Provocative poses for passionate souls. Pose with me? 📸",
  "Heat seeker? You've found the source. 🌋",
  "Naughty notions and erotic emotions. Feel them? ❤️",
  "This curves are calling your name. Answer? 🗣️",
  "Tempting treats await. Indulge freely. 🍰",
  "Wild side walking. Walk with me? 🚶‍♀️",
  "Steamy sessions starting soon. RSVP? 📅",
  "Body art in motion. Admire the masterpiece. 🖼️",
  "Lucky number? Let's make it yours. 🍀",
  "Sultry surprises inside. Open carefully. 🎁",
  "Naughty and nice? Mostly naughty. 😇😈",
  "Heat building, barriers breaking. Break with me? 🔨",
  "Your siren song—I'm calling you in. 🧜‍♀️",
  "Teasing the night away. Stay up? 🌃",
  "Curves that captivate, moves that motivate. Motivated? 💪",
  "Sinful symphony playing now. Dance? 💃",
  "Unlock levels of lust. Level up? 🎮",
  "Body bliss incoming. Bliss out? ☁️",
  "Tease queen reigning supreme. Bow? 👑",
  "Sinful sweets for the taking. Take? 👐",
  "Wild waves crashing. Ride them? 🌊",
  "Naughty notions in notion. Note them? 📝",
  "Sultry secrets sealed. Unseal? ✉️",
  "Heat hearted and hard to resist. Resist? 💔",
  "Final tease: all in or all out? Decide. 🃏"
];

function buildLocalDummyPosts() {
  // Create 100 dummy posts with PERMANENT dates from Jan 1, 2024 to Sep 29, 2025
  // ALL posts locked by default with real images for first 15

  // Generate exact dates from Sept 29, 2025 (post 1, newest) to Jan 1, 2024 (post 100, oldest)
  const startDate = new Date('2025-09-29');
  const endDate = new Date('2024-01-01');
  const totalDays = Math.floor((startDate - endDate) / (1000 * 60 * 60 * 24));

  // Create evenly distributed dates
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
    const hasRealImage = idx <= 15;
    const postDate = dates[i];

    // Get or initialize permanent likes for this post
    const postId = `dummy-${idx}`;
    if (!persistedLikes[postId]) {
      persistedLikes[postId] = Math.floor(Math.random() * 1800001) + 200000;
    }

    return {
      // use string ids to avoid numeric collisions with DB ids
      id: postId,
      text: DUMMY_POST_CAPTIONS[i] || `Post ${idx}`,
      mediaType: "image",
      mediaSrc: hasRealImage ? UNLOCKED_POST_IMAGES[i] : "https://via.placeholder.com/600x800/cccccc/666666?text=Locked+Content",
      likes: persistedLikes[postId],
      date: postDate.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }),
      created_at: postDate.toISOString(),
      locked: true, // ALL posts locked by default
      isDummy: true,
    };
  });
}

export default function SafeProfileMock() {
  // --- state (kept largely identical)
  const navigate = useNavigate();
  const [creator, setCreator] = useState(defaultCreator);
  const [posts, setPosts] = useState(() => buildLocalDummyPosts()); // keep 100 dummy posts always visible
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

  const [freeSample, setFreeSample] = useState({ active: false, unlockedCount: 15, expiresAt: null }); // default unlocked 15
  const countdownRef = useRef(null);
  const unlockedOnceRef = useRef(false);

  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerList, setViewerList] = useState([]); // { id, mediaType, src, title }
  const [viewerIndex, setViewerIndex] = useState(0);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [tipAnimatingPosts, setTipAnimatingPosts] = useState({});

  // helpers to find posts by id (supports string ids for dummies and numeric for DB)
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

    // initial fetch: creator profile + posts (directly from Supabase)
    const loadInitialData = async () => {
      try {
        // Creator profile fetch
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

        // Posts fetch (for this creator handle)
        let postsQuery = supabase.from("posts").select("id, creator_handle, title, content, media_url, locked, created_at");
        if (handle) postsQuery = postsQuery.eq("creator_handle", handle);
        postsQuery = postsQuery.order("created_at", { ascending: false }).limit(500);

        const { data: postsData, error: postsError } = await postsQuery;

        if (postsError) {
          console.error("Supabase posts error:", postsError);
        } else if (mounted && Array.isArray(postsData)) {
          // Load persisted like counts
          let persistedLikes = {};
          try {
            const stored = typeof window !== "undefined" ? window.localStorage.getItem("post_likes_permanent") : null;
            if (stored) {
              persistedLikes = JSON.parse(stored);
            }
          } catch (err) {
            console.warn("Failed to load persisted likes:", err);
          }

          // Map DB posts into UI shape and merge (DB posts get unique ids prefixed to avoid clashing with local dummies)
          const mappedDB = postsData.map((post) => {
            const postId = `db-${post.id}`;
            // Get or initialize permanent likes for this post (stable value)
            if (!persistedLikes[postId]) {
              persistedLikes[postId] = Math.floor(Math.random() * 1800001) + 200000;
            }
            
            return {
              id: postId, // ensure unique string id
              dbId: post.id,
              creator_handle: post.creator_handle,
              text: post.content || post.title || "",
              mediaType: post.media_url ? (post.media_url.includes(".mp4") || post.media_url.includes("video") ? "video" : "image") : null,
              mediaSrc: post.media_url || null,
              likes: persistedLikes[postId],
              date: post.created_at ? new Date(post.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "",
              locked: post.locked === true, // ensure boolean
              created_at: post.created_at,
              isDummy: false,
            };
          });

          // Save updated persisted likes
          try {
            if (typeof window !== "undefined" && window.localStorage) {
              localStorage.setItem("post_likes_permanent", JSON.stringify(persistedLikes));
            }
          } catch (err) {
            console.warn("Failed to save persisted likes:", err);
          }

          // Strategy: Keep local dummy posts always. Add DB posts on top (most recent first) but do NOT remove dummies.
          // If a DB post maps to something that appears to be a duplicate of a dummy (unlikely), keep both because ids differ.
          setPosts((prev) => {
            // Keep dummies from prev (filter by isDummy)
            const dummyPosts = prev.filter((p) => p.isDummy);
            // Merge — DB posts first, then dummies (so DB appears at top)
            const merged = [...mappedDB, ...dummyPosts];
            return merged;
          });

          // Load user's liked posts and like counts from database
          const userEmail = typeof window !== "undefined" ? window.localStorage.getItem("user_email") : null;
          if (userEmail) {
            try {
              // Fetch all posts this user has liked
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

            // Fetch like counts for all posts visible on the page
            try {
              const allPostIds = mappedDB.map(p => p.id);
              if (allPostIds.length > 0) {
                // Fetch counts for each post (we'll do this in batches if needed)
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

    // Realtime subscriptions (posts + creator_profiles) - Modern Supabase v2+ channel API
    // Posts: listen for INSERT / UPDATE / DELETE and update UI accordingly
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
          // insert at top and preserve dummies that follow
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
            // new/updated post not in current list — insert at top
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

    // Creator profile realtime subscription (updates only)
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
      // unsubscribe channels
      supabase.removeChannel(postsChannel);
      supabase.removeChannel(profileChannel);
      clearSilentCountdown();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // *** derive mediaItems from posts (unchanged logic, but uses current posts array) ***
  const mediaItems = useMemo(() => {
    return posts
      .filter((p) => p.mediaSrc) // only those with media
      .map((p) => ({
        id: p.id,
        type: p.mediaType || "image",
        src: p.mediaSrc,
        duration: p.mediaType === "video" ? `${Math.floor(Math.random() * 3)}:${String(Math.floor(Math.random() * 60)).padStart(2, "0")}` : undefined,
        count: 1,
      }));
  }, [posts]);

  // init like counts & resume hidden countdown if metadata exists
  useEffect(() => {
    const map = {};
    posts.forEach((p) => {
      map[p.id] = p.likes;
    });
    setLikeCounts(map);

    try {
      if (typeof window !== "undefined" && window.localStorage) {
        // Load free sample state
        const raw = localStorage.getItem(FREE_SAMPLE_LS_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && parsed.expiresAt) {
            startSilentCountdown(parsed.expiresAt);
            setFreeSample((prev) => ({ ...prev, active: true, unlockedCount: parsed.unlockedCount || prev.unlockedCount, expiresAt: parsed.expiresAt }));
          }
        }

        // Load persisted liked posts state
        const likedState = localStorage.getItem("post_likes_state");
        if (likedState) {
          setLikedPosts(JSON.parse(likedState));
        }

        // Load persisted like counts
        const likeCounts = localStorage.getItem("post_likes_permanent");
        if (likeCounts) {
          setLikeCounts((prev) => ({ ...prev, ...JSON.parse(likeCounts) }));
        }

        // Load messages unlocked state
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

  // icons & formatLikes unchanged
  const IconHeart = ({ className = "w-5 h-5", active = false, likes = 0 }) => (
    <div className="flex flex-col items-center">
      <svg className={className} viewBox="0 0 24 24" fill={active ? "#e0245e" : "none"} xmlns="http://www.w3.org/2000/svg" stroke={active ? "#e0245e" : "#9AA3AD"}>
        <path d="M12 17.3l6.18 3.9-1.64-7.03L21 9.24l-7.19-.62L12 2 10.19 8.62 3 9.24l4.46 4.93L5.82 21.2z" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <span className="text-xs text-gray-500">{formatLikes(likes)}</span>
    </div>
  );
  const IconComment = ({ className = "w-5 h-5" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" stroke="#9AA3AD">
      <path d="M21 15a2 2 0 0 1-2 2H8l-5 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
  const IconTip = ({ className = "w-5 h-5", active = false }) => (
    <svg className={`${className} ${active ? 'animate-flash-blue' : ''}`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" stroke="#9AA3AD">
      <circle cx="12" cy="12" r="9" strokeWidth="1.2"/><text x="12" y="15.2" textAnchor="middle" fontSize="10" fill="#9AA3AD" fontWeight="600">$</text>
    </svg>
  );
  const IconBookmark = ({ className = "w-5 h-5", active = false }) => (
    <svg className={className} viewBox="0 0 24 24" fill={active ? "#2563eb" : "none"} xmlns="http://www.w3.org/2000/svg" aria-hidden="true" stroke={active ? "#2563eb" : "#9AA3AD"}>
      <path d="M6 2h12v19l-6-4-6 4V2z" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
  const formatLikes = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
    if (num >= 1000) return Math.floor(num / 1000) + "k";
    return String(num);
  };

  const VerifiedBadge = () => (
    <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="33" height="32" viewBox="0 0 33 32">
      <image xlinkHref={`data:image/png;base64,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`} x="0" y="0" width="33" height="32"/>
    </svg>
  );

  const PostIcons = ({ className = "w-5 h-5", active = false, likes = 0 }) => (
    <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
      width="100%" viewBox="0 0 719 120" enable-background="new 0 0 719 120" xmlSpace="preserve">
      <path fill="#FFFFFF" opacity="1.000000" stroke="none" 
        d={`
M692.000000,121.000000 
	C461.333344,121.000000 231.166672,121.000000 1.000000,121.000000 
	C1.000000,81.000000 1.000000,41.000000 1.000000,1.000000 
	C240.666672,1.000000 480.333344,1.000000 720.000000,1.000000 
	C720.000000,41.000000 720.000000,81.000000 720.000000,121.000000 
	C710.833313,121.000000 701.666687,121.000000 692.000000,121.000000 
M61.189827,97.154305 
	C61.189827,97.154305 61.203773,97.339256 60.856560,97.597580 
	C60.945076,98.080864 61.033592,98.564156 61.122108,99.047447 
	C62.003666,98.668709 62.885227,98.289963 64.600868,97.689499 
	C65.706169,98.301201 66.811478,98.912895 67.916786,99.524597 
	C66.510765,101.001144 65.104744,102.477692 64.193832,103.434303 
	C65.421707,105.544373 66.674385,107.697052 67.194130,110.141319 
	C65.895912,109.792374 64.596062,109.449364 63.300011,109.092545 
	C62.323441,108.823685 61.351749,108.537109 60.377888,108.258423 
	C60.616116,109.432068 60.854343,110.605705 61.068382,111.924110 
	C61.068382,111.924110 61.214108,111.906654 61.412292,112.510841 
	C64.377075,114.881310 67.186676,114.888245 70.466766,111.422432 
	C70.386566,109.306137 70.306358,107.189850 70.183395,104.312088 
	C70.268471,103.562439 70.353546,102.812782 70.955925,101.392960 
	C70.523468,99.612984 70.091003,97.833000 69.583496,95.653931 
	C69.065430,95.470261 68.547371,95.286591 67.240166,94.741272 
	C65.836525,94.890312 64.432884,95.039352 62.454254,95.190674 
	C62.094109,95.837410 61.733963,96.484138 61.189827,97.154305 
M53.512436,97.550621 
	C53.967079,96.724258 54.421719,95.897903 54.876362,95.071533 
	C53.193077,95.367065 51.509796,95.662598 49.350586,96.153366 
	C49.094467,96.555634 48.838345,96.957901 48.496368,97.493340 
	C48.496368,97.493340 48.419518,97.631905 47.763432,97.810272 
	C44.885353,102.055229 44.718052,106.456238 47.186821,111.638924 
	C49.534893,112.252304 52.261150,113.876862 54.119831,113.181717 
	C55.823345,112.544594 57.608593,109.345131 57.495922,107.381531 
	C57.372734,105.234444 55.111069,103.211197 53.785313,101.131508 
	C53.105446,100.065010 52.433998,98.993149 52.392483,97.801376 
	C52.572899,97.684242 52.753311,97.567116 53.512436,97.550621 
M113.831535,100.083153 
	C111.308487,98.383827 108.919174,97.785378 106.447075,101.402832 
	C105.560432,104.791321 104.673790,108.179802 102.952827,111.622047 
	C98.595833,108.167984 97.529175,104.376694 101.744911,100.001228 
	C99.780258,101.294060 97.815605,102.586891 94.885437,104.515076 
	C94.885437,100.301666 94.885437,97.502708 94.885437,94.703751 
	C94.488907,94.719193 94.092377,94.734634 93.695847,94.750076 
	C93.695847,101.016907 93.695847,107.283737 93.695847,113.550568 
	C94.097763,113.577003 94.499687,113.603439 94.901604,113.629875 
	C95.094910,111.897240 95.288216,110.164604 95.661507,106.818733 
	C97.789177,108.857765 98.875671,110.261711 100.291573,111.126091 
	C101.207756,111.685410 102.605721,111.455513 104.563751,111.265327 
	C105.931183,112.117691 107.276123,113.623215 108.671242,113.671257 
	C110.831459,113.745621 113.025925,112.825165 115.205872,112.326530 
	C114.468719,110.842033 113.731575,109.357536 113.768997,107.800346 
	C118.498978,105.644554 115.143501,103.184471 113.831535,100.083153 
M124.095032,106.284966 
	C124.984901,105.489655 126.244301,104.849571 126.661736,103.855804 
	C127.087502,102.842178 126.685814,101.480980 126.646400,100.271957 
	C124.299995,100.494019 121.849274,100.394402 119.660950,101.103981 
	C118.840240,101.370094 118.629547,103.517494 118.140739,104.807182 
	C120.106766,105.529831 122.072800,106.252480 123.765320,107.688950 
	C121.744896,108.376495 119.724472,109.064041 116.483452,110.166954 
	C118.930855,112.059555 120.189316,113.774994 121.667511,113.991714 
	C123.602486,114.275391 125.913872,113.757195 127.662598,112.828964 
	C128.589279,112.337090 129.336456,109.267159 129.015060,109.048149 
	C127.555275,108.053436 125.686523,107.658890 124.095032,106.284966 
M241.979980,42.929188 
	C241.979980,42.929188 241.976669,42.855824 242.781082,43.062222 
	C243.184601,45.720490 243.410431,48.422401 244.049026,51.022945 
	C244.541992,53.030403 245.305588,56.392845 246.379257,56.571888 
	C249.706879,57.126804 253.554916,58.016045 256.506927,54.840546 
	C254.697403,53.987595 252.917633,54.252445 251.271484,53.897526 
	C250.110687,53.647259 249.131287,52.555744 248.070892,51.839825 
	C248.876648,50.860966 249.511780,49.611481 250.529968,48.969597 
	C251.899612,48.106159 253.564743,47.711456 255.103043,47.115559 
	C255.039658,46.620255 254.976273,46.124947 254.912888,45.629639 
	C253.575699,45.429783 252.167618,45.424099 250.923355,44.969757 
	C249.894180,44.593933 249.058487,43.688286 248.137070,43.017384 
	C249.046173,42.332455 249.861725,41.389683 250.884674,41.018585 
	C252.764526,40.336620 254.766495,39.991264 256.717560,39.505600 
	C255.766907,37.937729 254.851471,37.190056 253.884109,37.115444 
	C249.371277,36.767361 244.762192,36.370365 241.474655,40.723637 
	C240.476898,39.892181 239.569107,38.907879 238.464615,38.257744 
	C235.060455,36.253910 232.037552,36.747570 229.963852,40.232407 
	C227.569687,44.255802 230.307541,46.313713 233.334625,48.122803 
	C233.897125,48.458973 234.632172,48.535564 235.143143,48.922646 
	C236.116272,49.659824 237.138779,50.429989 237.808167,51.412968 
	C238.021851,51.726753 237.139038,53.374176 236.835373,53.351986 
	C235.504318,53.254696 234.173615,52.848652 232.897354,52.399483 
	C231.823822,52.021656 230.825668,51.429676 229.794159,50.932499 
	C229.383026,51.494301 228.971909,52.056099 228.560791,52.617897 
	C230.392044,54.025665 232.096970,56.325420 234.087662,56.607368 
	C236.391327,56.933636 240.265900,56.163403 241.053940,54.631927 
	C242.010147,52.773651 240.453110,49.622139 240.049744,46.372383 
	C240.699829,45.248203 241.349915,44.124027 241.979980,42.929188 
M678.083252,33.169842 
	C672.922546,33.173111 667.761841,33.176342 662.601135,33.179668 
	C658.336060,33.182419 656.053406,35.334137 656.013855,39.578255 
	C655.938049,47.734764 656.004822,55.892502 655.974792,64.049591 
	C655.961975,67.537460 657.589661,69.133163 660.493347,66.839249 
	C667.296631,61.464645 673.619873,60.944164 680.481140,66.808960 
	C683.219116,69.149277 685.008301,67.606171 684.989502,64.051567 
	C684.946228,55.894585 684.981384,47.737221 684.968567,39.580032 
	C684.962280,35.596317 683.092224,33.326702 678.083252,33.169842 
M57.198658,33.456226 
	C54.637726,33.977364 51.674133,35.587082 49.590988,34.816536 
	C43.216106,32.458500 40.676731,32.544880 36.294617,37.208038 
	C33.547176,40.131683 32.556980,46.543507 35.230190,50.111946 
	C39.478306,55.782719 44.300751,61.036659 49.063152,66.301468 
	C50.723755,68.137253 52.678207,68.126801 54.558556,65.988731 
	C58.603119,61.389851 63.070045,57.145554 66.913116,52.391556 
	C70.104485,48.443726 71.270699,43.609417 68.693222,38.898830 
	C66.486061,34.865040 62.742649,32.795826 57.198658,33.456226 
M180.480331,39.236900 
	C174.536148,51.829422 178.467789,62.715214 190.596863,67.247162 
	C196.959976,69.624702 206.562393,66.457207 210.577393,60.656292 
	C215.450546,53.615505 215.212997,44.140606 210.022339,38.517727 
	C201.313110,29.083288 190.249603,29.131966 180.480331,39.236900 
M109.416534,40.125336 
	C104.715500,50.812397 107.755119,58.381618 118.628548,63.408195 
	C119.870132,63.982162 121.506660,65.085648 121.744530,66.202499 
	C122.671768,70.556114 125.491043,69.324699 127.188492,67.733070 
	C131.086975,64.077644 135.332993,60.353611 137.876877,55.787666 
	C142.617020,47.279694 139.620316,37.579979 131.542175,33.496037 
	C125.758423,30.572031 114.908546,30.325434 109.416534,40.125336 
M34.508286,94.871918 
	C33.638260,97.107140 32.616478,99.299194 31.963114,101.596046 
	C31.643005,102.721359 32.482506,104.303307 31.974415,105.225060 
	C30.325945,108.215599 30.600037,111.335175 33.270164,112.657402 
	C35.296886,113.661003 38.832222,113.285599 40.829132,112.083412 
	C42.115875,111.308777 41.933643,107.940720 42.214462,105.710381 
	C42.364853,104.515968 41.831253,103.213432 42.071114,102.056007 
	C43.263264,96.303467 41.541286,94.378548 34.508286,94.871918 
M270.007385,42.470543 
	C270.007385,44.369282 270.007385,46.268024 270.007385,48.166763 
	C267.133270,45.176224 265.299683,41.921665 263.186035,38.860470 
	C261.958221,37.082184 259.571899,36.295227 259.313995,39.123089 
	C258.784637,44.927547 259.155029,50.814060 259.155029,57.342743 
	C265.479309,55.000443 261.223907,49.524334 263.905457,46.451263 
	C265.680206,49.413273 267.175659,52.179180 268.959991,54.744133 
	C269.604767,55.670986 270.942078,56.116089 271.963348,56.781017 
	C272.621216,55.756382 273.797333,54.756172 273.846954,53.702873 
	C274.057983,49.226097 274.086823,44.724876 273.830231,40.252781 
	C273.763947,39.097645 272.419037,38.015869 271.661469,36.900398 
	C271.234924,37.063770 270.808411,37.227142 270.381866,37.390514 
	C270.257141,38.795528 270.132416,40.200546 270.007385,42.470543 
M321.007538,42.648609 
	C321.010895,46.452747 320.883270,50.264660 321.108429,54.055618 
	C321.165680,55.019398 322.344116,55.916584 323.007355,56.844368 
	C323.662659,55.911102 324.538452,55.057983 324.914581,54.023232 
	C325.335968,52.863926 325.305023,51.540207 325.481537,50.207687 
	C327.175385,50.112663 328.501404,50.139587 329.794617,49.946732 
	C333.675476,49.367970 334.916199,46.536320 334.897827,43.168957 
	C334.877380,39.432362 330.958679,37.192734 325.737335,36.951962 
	C322.047546,36.781815 320.426147,37.956860 321.007538,42.648609 
M287.399872,54.995083 
	C291.323029,50.689480 290.799622,45.733345 288.834656,41.000694 
	C287.281128,37.258980 283.565125,36.601028 279.907074,37.158192 
	C278.840118,37.320702 277.170837,38.703850 277.130554,39.589050 
	C276.875824,45.188175 277.001251,50.804592 277.001251,57.475117 
	C280.810089,56.700726 283.786469,56.095592 287.399872,54.995083 
M301.000061,37.038548 
	C299.810608,37.663261 298.621155,38.287975 297.431702,38.912697 
	C299.096863,39.941757 300.761993,40.970818 303.357178,42.574627 
	C303.357178,46.770664 303.357178,51.752819 303.357178,57.094208 
	C308.370087,55.830025 306.724365,52.440163 306.906799,50.002716 
	C307.206818,45.994526 305.463806,41.239773 311.418365,39.695290 
	C311.687592,39.625462 311.695526,38.548340 312.018005,37.035969 
	C308.359039,37.035969 305.122437,37.035969 301.000061,37.038548 
M80.816139,96.585777 
	C80.823296,102.295242 80.830452,108.004715 80.837601,113.714180 
	C81.689255,113.683167 82.540901,113.652161 83.392548,113.621147 
	C83.392548,107.572823 83.392548,101.524490 83.392548,95.476158 
	C82.562378,95.593178 81.732208,95.710190 80.816139,96.585777 
M314.021484,46.559479 
	C314.021484,49.924191 314.021484,53.288902 314.021484,57.177399 
	C315.703583,56.681862 316.811859,56.529068 316.820831,56.327499 
	C317.087280,50.321972 317.267273,44.311916 317.348267,38.301048 
	C317.352020,38.022781 316.154419,37.366447 315.797028,37.523800 
	C315.140747,37.812729 314.298279,38.534283 314.231293,39.151276 
	C313.999359,41.286728 314.067688,43.454796 314.021484,46.559479 
M87.467064,99.863449 
	C87.467064,104.447487 87.467064,109.031525 87.467064,113.615562 
	C88.211571,113.565956 88.956078,113.516357 89.700584,113.466751 
	C89.211365,108.868164 88.722153,104.269569 87.467064,99.863449 
z`}/>
      <path fill="#9AA2AC" opacity="1.000000" stroke="none" 
        d={`
M678.527710,33.176247 
	C683.092224,33.326702 684.962280,35.596317 684.968567,39.580032 
	C684.981384,47.737221 684.946228,55.894585 684.989502,64.051567 
	C685.008301,67.606171 683.219116,69.149277 680.481140,66.808960 
	C673.619873,60.944164 667.296631,61.464645 660.493347,66.839249 
	C657.589661,69.133163 655.961975,67.537460 655.974792,64.049591 
	C656.004822,55.892502 655.938049,47.734764 656.013855,39.578255 
	C656.053406,35.334137 658.336060,33.182419 662.601135,33.179668 
	C667.761841,33.176342 672.922546,33.173111 678.527710,33.176247 
M659.924927,55.326431 
	C659.924927,57.117683 659.924927,58.908936 659.924927,62.473175 
	C667.276550,56.758148 673.904663,57.424770 681.015381,63.106907 
	C681.015381,54.168427 681.135254,46.913605 680.864502,39.673386 
	C680.830444,38.762363 678.785095,37.258236 677.594055,37.177845 
	C673.127136,36.876328 668.620667,37.206314 664.143250,36.997040 
	C660.792297,36.840416 659.765442,38.266209 659.887817,41.411259 
	C660.055725,45.725567 659.926453,50.051441 659.924927,55.326431 
z`}/>
      <path fill="#D7DBDE" opacity="1.000000" stroke="none" 
        d={`
M57.567978,33.323227 
	C62.742649,32.795826 66.486061,34.865040 68.693222,38.898830 
	C71.270699,43.609417 70.104485,48.443726 66.913116,52.391556 
	C63.070045,57.145554 58.603119,61.389851 54.558556,65.988731 
	C52.678207,68.126801 50.723755,68.137253 49.063152,66.301468 
	C44.300751,61.036659 39.478306,55.782719 35.230190,50.111946 
	C32.556980,46.543507 33.547176,40.131683 36.294617,37.208038 
	C40.676731,32.544880 43.216106,32.458500 49.590988,34.816536 
	C51.674133,35.587082 54.637726,33.977364 57.567978,33.323227 
M38.392879,41.377129 
	C38.265335,42.682636 37.795727,44.064232 38.066406,45.281166 
	C39.683907,52.553261 45.343891,56.861507 50.418674,61.549847 
	C50.839756,61.938858 52.342560,61.922512 52.670479,61.531158 
	C57.074539,56.275276 61.691154,51.134888 65.406151,45.414555 
	C66.193886,44.201611 64.209335,39.847622 62.376217,38.614502 
	C60.113819,37.092613 56.645309,36.952198 54.665108,40.423233 
	C54.074314,41.458820 52.894405,42.158321 52.014759,42.983349 
	C42.707581,34.583557 43.065266,36.989330 38.392879,41.377129 
z`}/>
      <path fill="#D8DBDF" opacity="1.000000" stroke="none" 
        d={`
M180.714737,38.941265 
	C190.249603,29.131966 201.313110,29.083288 210.022339,38.517727 
	C215.212997,44.140606 215.450546,53.615505 210.577393,60.656292 
	C206.562393,66.457207 196.959976,69.624702 190.596863,67.247162 
	C178.467789,62.715214 174.536148,51.829422 180.714737,38.941265 
M195.548065,63.983490 
	C197.476440,63.573669 199.490112,63.392395 201.317032,62.710663 
	C206.548706,60.758381 210.037964,55.250645 209.992157,49.398087 
	C209.952896,44.382919 205.429230,38.063599 200.686600,36.398735 
	C195.403931,34.544296 188.714767,36.235107 185.200043,40.313244 
	C177.346237,49.426029 182.136978,61.325363 195.548065,63.983490 
z`}/>
      <path fill="#D6DADD" opacity="1.000000" stroke="none" 
        d={`
M109.594833,39.793388 
	C114.908546,30.325434 125.758423,30.572031 131.542175,33.496037 
	C139.620316,37.579979 142.617020,47.279694 137.876877,55.787666 
	C135.332993,60.353611 131.086975,64.077644 127.188492,67.733070 
	C125.491043,69.324699 122.671768,70.556114 121.744530,66.202499 
	C121.506660,65.085648 119.870132,63.982162 118.628548,63.408195 
	C107.755119,58.381618 104.715500,50.812397 109.594833,39.793388 
M113.448936,41.142826 
	C108.783684,50.194748 111.932846,57.137154 121.875954,60.059208 
	C123.693153,60.593239 125.311714,61.803249 127.260376,62.826397 
	C132.898773,58.573589 137.043396,53.332111 135.859329,45.720287 
	C135.137558,41.080376 132.425995,37.496899 127.582832,36.005260 
	C121.920906,34.261448 117.604240,36.420422 113.448936,41.142826 
z`}/>
      <path fill="#5C5D60" opacity="1.000000" stroke="none" 
        d={`
M34.866653,94.753197 
	C33.638260,97.107140 32.616478,99.299194 31.963114,101.596046 
	C31.643005,102.721359 32.482506,104.303307 31.974415,105.225060 
	C30.325945,108.215599 30.600037,111.335175 33.270164,112.657402 
	C35.296886,113.661003 38.832222,113.285599 40.829132,112.083412 
	C42.115875,111.308777 41.933643,107.940720 42.214462,105.710381 
	C42.364853,104.515968 41.831253,103.213432 42.071114,102.056007 
	C43.263264,96.303467 41.541286,94.378548 34.866653,94.753197 
z`}/>
      <path fill="#D8DBDF" opacity="1.000000" stroke="none" 
        d={`
M270.007385,42.470543 
	C270.007385,44.369282 270.007385,46.268024 270.007385,48.166763 
	C267.133270,45.176224 265.299683,41.921665 263.186035,38.860470 
	C261.958221,37.082184 259.571899,36.295227 259.313995,39.123089 
	C258.784637,44.927547 259.155029,50.814060 259.155029,57.342743 
	C265.479309,55.000443 261.223907,49.524334 263.905457,46.451263 
	C265.680206,49.413273 267.175659,52.179180 268.959991,54.744133 
	C269.604767,55.670986 270.942078,56.116089 271.963348,56.781017 
	C272.621216,55.756382 273.797333,54.756172 273.846954,53.702873 
	C274.057983,49.226097 274.086823,44.724876 273.830231,40.252781 
	C273.763947,39.097645 272.419037,38.015869 271.661469,36.900398 
	C271.234924,37.063770 270.808411,37.227142 270.381866,37.390514 
	C270.257141,38.795528 270.132416,40.200546 270.007385,42.470543 
z`}/>
      <path fill="#D8DBDF" opacity="1.000000" stroke="none" 
        d={`
M242.007751,41.207741 
	C242.004654,41.574535 242.001556,41.941330 241.987564,42.581974 
	C241.976669,42.855824 241.979980,42.929188 241.615631,42.968124 
	C239.872589,42.251942 238.564255,41.260078 237.091248,40.822353 
	C236.055771,40.514645 234.796158,40.961132 233.636627,41.070843 
	C233.956665,42.305561 233.883698,44.058800 234.681335,44.663364 
	C236.183624,45.802025 238.187866,46.278439 239.983444,47.030159 
	C240.453110,49.622139 242.010147,52.773651 241.053940,54.631927 
	C240.265900,56.163403 236.391327,56.933636 234.087662,56.607368 
	C232.096970,56.325420 230.392044,54.025665 228.560791,52.617897 
	C228.971909,52.056099 229.383026,51.494301 229.794159,50.932499 
	C230.825668,51.429676 231.823822,52.021656 232.897354,52.399483 
	C234.173615,52.848652 235.504318,53.254696 236.835373,53.351986 
	C237.139038,53.374176 238.021851,51.726753 237.808167,51.412968 
	C237.138779,50.429989 236.116272,49.659824 235.143143,48.922646 
	C234.632172,48.535564 233.897125,48.458973 233.334625,48.122803 
	C230.307541,46.313713 227.569687,44.255802 229.963852,40.232407 
	C232.037552,36.747570 235.060455,36.253910 238.464615,38.257744 
	C239.569107,38.907879 240.476898,39.892181 241.741211,40.965691 
	C242.004654,41.574535 242.007751,41.207741 241.741211,40.965691 
z`}/>
      <path fill="#DADDE1" opacity="1.000000" stroke="none" 
        d={`
M321.007812,42.172661 
	C320.426147,37.956860 322.047546,36.781815 325.737335,36.951962 
	C330.958679,37.192734 334.877380,39.432362 334.897827,43.168957 
	C334.916199,46.536320 333.675476,49.367970 329.794617,49.946732 
	C328.501404,50.139587 327.175385,50.112663 325.481537,50.207687 
	C325.305023,51.540207 325.335968,52.863926 324.914581,54.023232 
	C324.538452,55.057983 323.662659,55.911102 323.007355,56.844368 
	C322.344116,55.916584 321.165680,55.019398 321.108429,54.055618 
	C320.883270,50.264660 321.010895,46.452747 321.007812,42.172661 
M328.228119,41.013634 
	C327.150696,42.040855 325.821716,42.926102 325.121735,44.166344 
	C324.848114,44.651196 325.954620,46.681171 326.489807,46.704693 
	C327.805664,46.762539 329.154755,46.064289 330.490479,45.670135 
	C330.005249,44.163651 329.520020,42.657169 328.228119,41.013634 
z`}/>
      <path fill="#DADDE1" opacity="1.000000" stroke="none" 
        d={`
M287.081360,55.242771 
	C283.786469,56.095592 280.810089,56.700726 277.001251,57.475117 
	C277.001251,50.804592 276.875824,45.188175 277.130554,39.589050 
	C277.170837,38.703850 278.840118,37.320702 279.907074,37.158192 
	C283.565125,36.601028 287.281128,37.258980 288.834656,41.000694 
	C290.799622,45.733345 291.323029,50.689480 287.081360,55.242771 
M286.856781,45.031506 
	C285.171600,43.478336 283.486420,41.925171 281.801239,40.371998 
	C281.203918,42.411270 280.546112,44.435699 280.040375,46.497433 
	C279.849365,47.276062 279.793121,48.217945 280.053772,48.950851 
	C280.647766,50.621040 281.475800,52.208000 282.208740,53.828781 
	C283.674835,52.462341 285.393768,51.271351 286.510223,49.662323 
	C287.159332,48.726799 286.841858,47.120579 286.856781,45.031506 
z`}/>
      <path fill="#F9FBFB" opacity="1.000000" stroke="none" 
        d={`
M240.016602,46.701271 
	C238.187866,46.278439 236.183624,45.802025 234.681335,44.663364 
	C233.883698,44.058800 233.956665,42.305561 233.636627,41.070843 
	C234.796158,40.961132 236.055771,40.514645 237.091248,40.822353 
	C238.564255,41.260078 239.872589,42.251942 241.625641,43.003456 
	C241.349915,44.124027 240.699829,45.248203 240.016602,46.701271 
z`}/>
      <path fill="#47484A" opacity="1.000000" stroke="none" 
        d={`
M103.787796,111.579269 
	C102.605721,111.455513 101.207756,111.685410 100.291573,111.126091 
	C98.875671,110.261711 97.789177,108.857765 95.661507,106.818733 
	C95.288216,110.164604 95.094910,111.897240 94.901604,113.629875 
	C94.499687,113.603439 94.097763,113.577003 93.695847,113.550568 
	C93.695847,107.283737 93.695847,101.016907 93.695847,94.750076 
	C94.092377,94.734634 94.488907,94.719193 94.885437,94.703751 
	C94.885437,97.502708 94.885437,100.301666 94.885437,104.515076 
	C97.815605,102.586891 99.780258,101.294060 101.744911,100.001228 
	C97.529175,104.376694 98.595833,108.167984 103.406845,111.574753 
	C103.860870,111.527466 103.787796,111.579269 103.787796,111.579269 
z`}/>
      <path fill="#67686A" opacity="1.000000" stroke="none" 
        d={`
M51.758743,97.923706 
	C50.940723,97.891983 50.122700,97.860268 48.943451,97.594360 
	C48.419518,97.631905 48.496368,97.493340 48.900524,97.660950 
	C50.122700,97.860268 50.940723,97.891983 51.758743,97.923706 
z`}/>
      <path fill="#535457" opacity="1.000000" stroke="none" 
        d={`
M113.686920,40.849865 
	C117.604240,36.420422 121.920906,34.261448 127.582832,36.005260 
	C132.425995,37.496899 135.137558,41.080376 135.859329,45.720287 
	C137.043396,53.332111 132.898773,58.573589 127.260376,62.826397 
	C125.311714,61.803249 123.693153,60.593239 121.875954,60.059208 
	C111.932846,57.137154 108.783684,50.194748 113.686920,40.849865 
z`}/>
      <path fill="#F9FBFB" opacity="1.000000" stroke="none" 
        d={`
M195.137985,63.981071 
	C182.136978,61.325363 177.346237,49.426029 185.200043,40.313244 
	C188.714767,36.235107 195.403931,34.544296 200.686600,36.398735 
	C205.429230,38.063599 209.952896,44.382919 209.992157,49.398087 
	C210.037964,55.250645 206.548706,60.758381 201.317032,62.710663 
	C199.490112,63.392395 197.476440,63.573669 195.137985,63.981071 
M199.012955,56.451641 
	C197.013016,57.147823 194.761414,58.039402 194.181931,57.404587 
	C192.806961,55.898323 187.932678,55.746346 191.230927,51.747074 
	C191.495865,51.425800 191.706696,50.673710 191.526062,50.427750 
	C187.273682,44.637127 193.439407,43.294003 195.587921,39.672562 
	C198.411896,42.363461 202.953415,43.531784 199.231812,48.503593 
	C202.448746,51.174019 202.710480,53.897705 199.012955,56.451641 
z`}/>
      <path fill="#FBFBFC" opacity="1.000000" stroke="none" 
        d={`
M195.548065,63.983490 
	C197.476440,63.573669 199.490112,63.392395 201.317032,62.710663 
	C206.548706,60.758381 210.037964,55.250645 209.992157,49.398087 
	C209.952896,44.382919 205.429230,38.063599 200.686600,36.398735 
	C195.403931,34.544296 188.714767,36.235107 185.200043,40.313244 
	C177.346237,49.426029 182.136978,61.325363 195.548065,63.983490 
M195.392624,47.200916 
	C195.790298,47.205406 196.187973,47.209892 196.585648,47.214382 
	C196.587067,47.050209 196.599518,46.743366 196.588318,46.742500 
	C196.192795,46.711922 195.795044,46.710049 195.392624,47.200916 
M195.602463,52.473034 
	C195.827560,52.529709 196.052673,52.586384 196.277771,52.643059 
	C196.132980,52.502823 195.988190,52.362591 195.602463,52.473034 
z`}/>
      <path fill="#F9FBFB" opacity="1.000000" stroke="none" 
        d={`
M328.228119,41.013634 
	C327.150696,42.040855 325.821716,42.926102 325.121735,44.166344 
	C324.848114,44.651196 325.954620,46.681171 326.489807,46.704693 
	C327.805664,46.762539 329.154755,46.064289 330.490479,45.670135 
	C330.005249,44.163651 329.520020,42.657169 328.228119,41.013634 
z`}/>
      <path fill="#F9FBFB" opacity="1.000000" stroke="none" 
        d={`
M286.908051,45.423820 
	C286.841858,47.120579 287.159332,48.726799 286.510223,49.662323 
	C285.393768,51.271351 283.674835,52.462341 282.208740,53.828781 
	C281.475800,52.208000 280.647766,50.621040 280.053772,48.950851 
	C279.793121,48.217945 279.849365,47.276062 280.040375,46.497433 
	C280.546112,44.435699 281.203918,42.411270 281.801239,40.371998 
	C283.486420,41.925171 285.171600,43.478336 286.908051,45.423820 
z`}/>
      <path fill="#DDE0E3" opacity="1.000000" stroke="none" 
        d={`
M48.091473,97.721085 
	C44.885353,102.055229 44.718052,106.456238 47.186821,111.638924 
	C48.218948,110.500206 48.732529,110.074570 49.246113,109.648933 
	C49.465897,106.320740 49.356007,107.984833 49.542007,109.846466 
	C48.732529,110.074570 48.218948,110.500206 47.354794,110.962173 
	C44.718052,106.456238 44.885353,102.055229 48.091473,97.721085 
z`}/>
      <path fill="#535457" opacity="1.000000" stroke="none" 
        d={`
M112.555290,105.824104 
	C110.764259,105.630966 109.381126,105.524284 107.998001,105.417610 
	C109.875290,106.420761 111.461868,106.649590 113.028000,106.636749 
	C113.007561,106.395096 112.963196,105.910561 112.555290,105.824104 
z`}/>
      <path fill="#535457" opacity="1.000000" stroke="none" 
        d={`
M61.080475,111.851730 
	C62.011177,111.179710 62.227833,110.524017 62.444489,109.868317 
	C62.058128,109.782799 61.671764,109.697289 61.285404,109.611771 
	C61.221127,110.334297 61.156849,111.056824 61.092571,111.779350 
	C61.068382,111.924110 61.214108,111.906654 61.504314,111.871033 
	C62.011177,111.179710 62.227833,110.524017 61.504314,111.871033 
	C61.156849,111.056824 61.221127,110.334297 61.285404,109.611771 
	C61.671764,109.697289 62.058128,109.782799 62.444489,109.868317 
	C62.227833,110.524017 62.011177,111.179710 61.080475,111.851730 
z`}/>
      <path fill="#535457" opacity="1.000000" stroke="none" 
        d={`
M65.456100,112.438965 
	C65.517860,112.404060 65.394333,112.473862 65.456100,112.438965 
z`}/>
      <path fill="#DADDE1" opacity="1.000000" stroke="none" 
        d={`
M198.758743,56.700867 
	C197.013016,57.147823 194.761414,58.039402 194.181931,57.404587 
	C192.806961,55.898323 187.932678,55.746346 191.230927,51.747074 
	C191.495865,51.425800 191.706696,50.673710 191.526062,50.427750 
	C187.273682,44.637127 193.439407,43.294003 195.587921,39.672562 
	C198.411896,42.363461 202.953415,43.531784 199.231812,48.503593 
	C202.448746,51.174019 202.710480,53.897705 198.758743,56.700867 
M195.392624,47.200916 
	C195.790298,47.205406 196.187973,47.209892 196.585648,47.214382 
	C196.587067,47.050209 196.599518,46.743366 196.588318,46.742500 
	C196.192795,46.711922 195.795044,46.710049 195.392624,47.200916 
M195.602463,52.473034 
	C195.827560,52.529709 196.052673,52.586384 196.277771,52.643059 
	C196.132980,52.502823 195.988190,52.362591 195.602463,52.473034 
z`}/>
      <path fill="#FBFBFC" opacity="1.000000" stroke="none" 
        d={`
M195.395111,46.952530 
	C195.795044,46.710049 196.192795,46.711922 196.588318,46.742500 
	C196.599518,46.743366 196.587067,47.050209 196.585648,47.214382 
	C196.187973,47.209892 195.790298,47.205406 195.395111,46.952530 
z`}/>
      <path fill="#FBFBFC" opacity="1.000000" stroke="none" 
        d={`
M195.722931,52.347694 
	C195.827560,52.529709 196.052673,52.586384 196.277771,52.643059 
	C196.132980,52.502823 195.988190,52.362591 195.722931,52.347694 
z`}/>
    </svg>
  );

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
    if (!p.locked) return true; // explicitly unlocked
    if (subscribed) return true;
    if (freeSample.active && freeSample.unlockedCount > 0) {
      // If post is a dummy, check its numeric index from dummy id 'dummy-N'
      if (p.isDummy) {
        const match = String(p.id).match(/^dummy-(\d+)$/);
        if (match) {
          const idx = Number(match[1]);
          return idx <= (freeSample.unlockedCount || 0);
        }
      }
      // For DB posts, we rely on the locked boolean
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

  // viewer helpers unchanged (works with string ids)
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
  // RENDER (structure left intact)
  // -----------------------
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-100 flex justify-center p-0">
        <div
          className="w-full max-w-[375px] bg-white rounded-t-md shadow-none text-[15px] relative"
          style={{ maxHeight: "calc(100vh - 0rem)", overflowY: "auto", zoom: "80%" }}
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

          {/* PROFILE ROW */}
          <div className="px-4 -mt-10 flex items-start">
            <div className="relative">
              <div className="w-20 h-20 rounded-full overflow-hidden shadow-md">
                <img src={creator.avatar || "https://share.google/pKUGamvuSpMSo70j1"} alt="avatar" className="w-full h-full object-cover" />
              </div>
              <div className="absolute right-0 bottom-0 w-4 h-4 bg-green-500 rounded-full active-dot" />
            </div>
          </div>

          {/* ACTIONS ABOVE NAME ROW */}
          <div className="px-4 -mt-2 flex justify-end">
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setStarred(!starred);
                  showToast(starred ? "Unstarred" : "Starred");
                }}
                className="w-9 h-9 bg-white rounded-full border flex items-center justify-center shadow text-[#06b6d4]"
                aria-label="star profile"
              >
                <svg className="w-4 h-4 text-[#06b6d4]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 17.3l6.18 3.9-1.64-7.03L21 9.24l-7.19-.62L12 2 10.19 8.62 3 9.24l4.46 4.93L5.82 21.2z" stroke="#06b6d4" strokeWidth="0.8" fill={starred ? "#06b6d4" : "none"} />
                </svg>
              </button>

              <button
                onClick={async () => {
                  const href = typeof window !== "undefined" && window.location ? window.location.href : "https://example.com/profile";
                  if (navigator.share) {
                    try {
                      await navigator.share({ title: document.title || "Profile", url: href });
                      showToast("Shared!");
                      return;
                    } catch (err) {
                      /* ignore */
                    }
                  }
                  try {
                    await navigator.clipboard.writeText(href);
                    showToast("Link copied!");
                  } catch {
                    showToast("Could not copy link — copy manually", "error");
                  }
                }}
                className="w-9 h-9 bg-white rounded-full border flex items-center justify-center shadow text-[#06b6d4]"
                aria-label="share profile"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 12v7a1 1 0 001 1h14a1 1 0 001-1v-7" stroke="#06b6d4" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M16 6l-4-4-4 4" stroke="#06b6d4" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 2v14" stroke="#06b6d4" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>

          {/* NAME + MESSAGE ROW */}
          <div className="px-4 mt-2 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-[18px] font-bold text-gray-900">{creator.name}</h2>
              <VerifiedBadge />
            </div>

            <button onClick={openMessageModal} className="bg-[#00AFF0] text-white text-sm font-semibold rounded-full px-6 py-2 shadow min-w-[120px]" aria-label="message creator">
              Message
            </button>
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

          {/* TAB CONTENT (posts/media rendering unchanged logic) */}
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
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-14 h-14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                  <rect x="3" y="10" width="18" height="11" rx="2" stroke="#D1D7DB" strokeWidth="1.6" />
                                  <path d="M7 10V7a5 5 0 0110 0v3" stroke="#D1D7DB" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>

                                <div className="w-full mt-3 max-w-[420px]">
                                  <div className="border rounded-md p-3 bg-white">
                                    <div className="flex items-center justify-between">
                                      <div className="text-[12px] text-gray-500 flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none">
                                          <path d="M3 3h18v18H3z" stroke="#B5BEC4" strokeWidth="1.2" fill="none" />
                                          <path d="M8 8l3 4 2-2 3 4" stroke="#B5BEC4" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                                        </svg>
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
                              <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                <rect x="3" y="10" width="18" height="11" rx="2" stroke="#D1D7DB" strokeWidth="1.6" />
                                <path d="M7 10V7a5 5 0 0110 0v3" stroke="#D1D7DB" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            </div>
                            <div className="absolute left-1 bottom-1 bg-white bg-opacity-90 text-[11px] px-1 rounded flex items-center gap-1 text-gray-600">
                              <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 24 24" fill="none">
                                <path d="M21 19V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14l4-3 3 3 5-4 6 4z" stroke="#B5BEC4" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
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

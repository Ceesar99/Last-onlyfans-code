// ProfilePage.jsx - COMPLETE FIXED VERSION - UPDATED LAYOUT

import React, { useEffect, useRef, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import ModalPortal from "../component/ModalPortal";
import SubscriptionModal from "../component/SubcriptionModal";
import MessageModal from "../component/MessageModal";
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
    "Hi 😊 I'm your favorite 19 year old & I love showing all of ME for your pleasure; ) you'll love it here! 🍆💦 Message me 👆 for daily nudes and videos in the feed ✨ S tapes, bjs , hjs , stripteases Dildo, vibrator, creampie, baby oil, roleplay 💦 Private messages with me ✨ NO SPAM OR ADS Turn on your your auto-renew on and get freebies xo",
};

// Post captions and images arrays (keeping them as before)
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
      mediaSrc: hasRealImage ? UNLOCKED_POST_IMAGES[i % UNLOCKED_POST_IMAGES.length] : "https://via.placeholder.com/600x800/cccccc/666666?text=Locked+Content",
      likes: persistedLikes[postId],
      date: postDate.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }),
      created_at: postDate.toISOString(),
      locked: idx > 15,
      isDummy: true,
    };
  });
}

function getStableLikeCount(postId) {
  try {
    const stored = typeof window !== "undefined" ? window.localStorage.getItem("post_likes_permanent") : null;
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed[postId]) return parsed[postId];
    }
  } catch (err) {}
  const newCount = Math.floor(Math.random() * 1800001) + 200000;
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      const stored = window.localStorage.getItem("post_likes_permanent");
      const parsed = stored ? JSON.parse(stored) : {};
      parsed[postId] = newCount;
      window.localStorage.setItem("post_likes_permanent", JSON.stringify(parsed));
    }
  } catch (err) {}
  return newCount;
}

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

  const findPostIndexById = (id) => posts.findIndex((p) => String(p.id) === String(id));
  const findPostById = (id) => posts.find((p) => String(p.id) === String(id));

  const openMessageModal = () => {
    navigate("/messages");
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
  }, [navigate]);

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

        localStorage.setItem("messages_unlocked", "true");
        setMessagesUnlocked(true);
      }
    } catch (e) {
      console.warn("failed to read persisted state", e);
    }

    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, [posts]);

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
  const IconLike = ({ className = "w-5 h-5", active = false }) => (
    <svg className={className} viewBox="0 0 24 24" fill={active ? "#e0245e" : "none"} xmlns="http://www.w3.org/2000/svg" stroke={active ? "#e0245e" : "#9AA3AD"}>
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const IconComment = ({ className = "w-5 h-5" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" stroke="#9AA3AD">
      <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  const IconTip = ({ className = "w-5 h-5", active = false }) => (
    <svg className={`${className} ${active ? 'animate-pulse text-blue-500' : ''}`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" stroke="#9AA3AD">
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

  // Static Lock SVG - REPLACE BASE64 HERE
  const LockSVGStatic = () => (
  <div
    style={{
      width: "100%",
      aspectRatio: "1614 / 843",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 1614 843"
      preserveAspectRatio="xMidYMid meet"
      style={{
        width: "100%",
        height: "100%",
        objectFit: "contain",
      }}
    >
      <g id="dd4789b5-03b7-41b2-a148-534740596f4f">
        <rect
          style={{
            stroke: "rgb(193,193,193)",
            strokeWidth: 0,
            fill: "rgb(255,255,255)",
          }}
          x="-807"
          y="-421.5"
          width="1614"
          height="843"
          transform="matrix(1 0 0 1 807 421.5)"
        />
      </g>
      <g id="ca9d0540-29e7-4418-be31-bf455c24c7ce">
        <image
          xlinkHref="data:image/png;base64,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"
          x="-360"
          y="-189.5"
          width="720"
          height="379"
          transform="matrix(2.223897 0 0 2.223897 800.60292 421.428481)"
        />
      </g>
    </svg>
  </div>
);
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

    setLikedPosts((prev) => ({ ...prev, [postId]: !wasLiked }));
    
    if (!wasLiked) {
      setLikeCounts((prev) => ({
        ...prev,
        [postId]: (prev[postId] || 0) + 1
      }));

      try {
        const { error } = await supabase
          .from("post_likes")
          .insert([{
            post_id: postId,
            user_email: userEmail,
            created_at: new Date().toISOString()
          }]);

        if (error) {
          if (error.code !== "23505") {
            console.error("Failed to save like:", error);
            setLikedPosts((prev) => ({ ...prev, [postId]: wasLiked }));
            setLikeCounts((prev) => ({
              ...prev,
              [postId]: Math.max(0, (prev[postId] || 0) - 1)
            }));
          }
        }

        const { count } = await supabase
          .from("post_likes")
          .select("*", { count: "exact", head: true })
          .eq("post_id", postId);

        if (count !== null) {
          setLikeCounts((prev) => ({ ...prev, [postId]: count }));
        }
      } catch (err) {
        console.error("toggleLike error:", err);
        setLikedPosts((prev) => ({ ...prev, [postId]: wasLiked }));
        setLikeCounts((prev) => ({
          ...prev,
          [postId]: Math.max(0, (prev[postId] || 0) - 1)
        }));
      }
    } else {
      setLikeCounts((prev) => ({
        ...prev,
        [postId]: Math.max(0, (prev[postId] || 0) - 1)
      }));

      try {
        const { error } = await supabase
          .from("post_likes")
          .delete()
          .eq("post_id", postId)
          .eq("user_email", userEmail);

        if (error) {
          console.error("Failed to remove like:", error);
          setLikedPosts((prev) => ({ ...prev, [postId]: wasLiked }));
          setLikeCounts((prev) => ({
            ...prev,
            [postId]: (prev[postId] || 0) + 1
          }));
        }

        const { count } = await supabase
          .from("post_likes")
          .select("*", { count: "exact", head: true })
          .eq("post_id", postId);

        if (count !== null) {
          setLikeCounts((prev) => ({ ...prev, [postId]: count }));
        }
      } catch (err) {
        console.error("toggleLike error:", err);
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

  const lockScroll = () => { try { document.body.style.overflow = "hidden"; } catch (e) {} };
  const unlockScroll = () => { try { document.body.style.overflow = "auto"; } catch (e) {} };

  const openSubModal = (planId) => { setSelectedPlan(planId || "monthly"); setShowSubModal(true); lockScroll(); };
  const closeSubModal = () => { setShowSubModal(false); unlockScroll(); };

  const buildViewerListFromPosts = useMemo(() => {
    return posts.filter((p) => isPostUnlocked(p.id) && p.mediaType).map((p) => ({ id: p.id, mediaType: p.mediaType, src: p.mediaSrc, title: `Post ${p.id}` }));
  }, [posts, freeSample, subscribed]);

  const buildViewerListFromMedia = useMemo(() => {
    return mediaItems
      .filter((m) => isMediaUnlocked(m.id))
      .map((m) => ({ id: m.id, mediaType: m.type, src: m.src, title: `Media ${m.id}` }));
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

  useEffect(() => {
    if (!viewerOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") closeViewer();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [viewerOpen, viewerList]);
    return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-100">
        <div
          className="w-full min-h-screen bg-white text-[15px] relative overflow-y-auto"
          style={{ zoom: "100%" }}
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
              <div className="absolute right-0 bottom-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
            </div>
          </div>

          {/* ACTIONS ABOVE NAME ROW */}
          <div className="px-4 -mt-2 flex justify-end">
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setStarred(!starred);
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
                      return;
                    } catch (err) {
                      /* ignore */
                    }
                  }
                  try {
                    await navigator.clipboard.writeText(href);
                  } catch {
                    console.error("Could not copy link");
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
          <div className="px-4 mt-1 flex items-center justify-between gap-3">
            <div className="flex flex-col flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <h2 className="text-[18px] font-bold text-gray-900 truncate">{creator.name}</h2>
                <VerifiedBadge />
              </div>
              <div className="text-[13px] text-gray-500 truncate">{creator.handle} · Available now</div>
            </div>

            <button 
              onClick={openMessageModal} 
              className="bg-[#00AFF0] text-white text-sm font-semibold rounded-full px-6 py-2 shadow flex-shrink-0" 
              aria-label="message creator"
            >
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
                <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                  <img src={creator.avatar} alt="avatar bubble" className="w-full h-full object-cover" />
                </div>
                <div className="text-[14px] text-gray-700 flex-1">I'm Always Hornyyyyyy 🤤💦</div>
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

          {/* TAB CONTENT - NEW LAYOUT FOR ALL POSTS */}
          <div className="bg-white">
            {activeTab === "posts" && (
              <div className="space-y-0">
                {posts.map((p) => (
                  <div key={p.id} className="border-b pb-0 last:border-none px-4">
                    {/* Header: Avatar + Name + Date */}
                    <div className="flex items-start gap-3 mb-0">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                        <img src={creator.avatar} alt="avatar" className="w-full h-full object-cover" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div className="flex flex-col">
                            <div className="flex items-center gap-1">
                              <div className="font-semibold text-[15px] text-gray-900">{creator.name}</div>
                              <VerifiedBadge />
                            </div>
                            <div className="text-[13px] text-gray-500">{creator.handle}</div>
                          </div>
                          <div className="text-[13px] text-gray-500 flex items-center gap-1">
                            {p.date}
                            <span>···</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Caption */}
                    <p className="text-[15px] text-gray-900 mb-0 px-0">{p.text}</p>

                    {/* Image/Video - FULL WIDTH NO INDENT */}
                    <div className="relative w-full mb-0">
  {!isPostUnlocked(p.id) ? (
    <div
      className="relative bg-[#F8FAFB] rounded-lg overflow-hidden"
      style={{ width: "100%", aspectRatio: "1614 / 843" }}
    >
      {/* Static SVG Background - fixed to container size */}
      <div
        className="absolute top-0 left-0 w-full h-full flex items-center justify-center"
      >
        <LockSVGStatic />
      </div>

      {/* Functional Button Overlay - EXACTLY covering static one */}
      <button
        onClick={() => openSubModal("monthly")}
        className="absolute bg-[#00AFF0] text-white text-sm font-semibold rounded-full py-3 shadow-lg hover:bg-[#00AFF0]/90 transition-colors"
        style={{
          width: "calc(100% - 32px)",
          height: "48px",
          top: "calc(50% + 80px)",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 50,
        }}
      >
        SUBSCRIBE TO SEE USER'S POSTS
      </button>
    </div>
  ) : (
    <div
      className="rounded-lg overflow-hidden bg-gray-100"
      style={{ width: "100%", aspectRatio: "1614 / 843" }}
    >
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
          className="w-full h-full cursor-pointer flex items-center justify-center relative"
          aria-label={`Open video post ${p.id}`}
        >
          <video
            src={p.mediaSrc}
            className="w-full h-full object-cover"
            preload="metadata"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-black bg-opacity-40 rounded-full p-3">
              <svg
                viewBox="0 0 24 24"
                className="w-8 h-8 text-white"
                fill="white"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
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
  )}
</div>
                    {/* Icons Row - NO INDENT */}
                    <div className="flex items-center gap-6 text-gray-500 mb-0">
                      <button onClick={() => toggleLike(p.id)} aria-label={`like post ${p.id}`}>
                        <IconLike active={!!likedPosts[p.id]} />
                      </button>

                      <button aria-label={`comment on post ${p.id}`}>
                        <IconComment />
                      </button>

                      <button onClick={() => toggleTip(p.id)} className="flex items-center gap-1" aria-label={`tip post ${p.id}`}>
                        <IconTip active={!!tipAnimatingPosts[p.id]} />
                        <span className="text-[13px]">SEND TIP</span>
                      </button>

                      <button onClick={() => toggleBookmark(p.id)} className="ml-auto" aria-label={`bookmark post ${p.id}`}>
                        <IconBookmark active={!!bookmarkedPosts[p.id]} />
                      </button>
                    </div>

                    {/* Likes Count */}
                    <div className="text-[13px] text-gray-600 mb-0">{formatLikes(likeCounts[p.id] ?? p.likes)} likes</div>
                  </div>
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
                                onClick={() => openViewer({ list: buildViewerListFromMedia, index: buildViewerListFromMedia.findIndex((x) => x.id === m.id) })}
                              />
                            ) : (
                              <div
                                className="w-full h-full bg-black flex items-center justify-center text-white text-xs cursor-pointer"
                                onClick={() => openViewer({ list: buildViewerListFromMedia, index: buildViewerListFromMedia.findIndex((x) => x.id === m.id) })}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter" || e.key === " ") {
                                    openViewer({ list: buildViewerListFromMedia, index: buildViewerListFromMedia.findIndex((x) => x.id === m.id) });
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

          {/* Viewer */}
          {viewerOpen && viewerList && viewerList.length > 0 && (
            <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-white p-4" role="dialog" aria-modal="true" aria-label={viewerList[viewerIndex]?.title || "Viewer"}>
              <button onClick={closeViewer} aria-label="Close viewer" className="absolute top-6 right-6 z-30 bg-white bg-opacity-40 hover:bg-opacity-60 text-black rounded-full p-2">✕</button>

              <div className="max-w-[95%] max-h-[95%] w-full h-full flex items-center justify-center overflow-auto">
                {viewerList[viewerIndex].mediaType === "image" ? (
                  <img src={viewerList[viewerIndex].src} alt={viewerList[viewerIndex].title} className="max-w-full max-h-full object-contain" loading="eager" />
                ) : (
                  <video src={viewerList[viewerIndex].src} className="max-w-full max-h-full" controls autoPlay playsInline preload="auto" />
                )}
              </div>
            </div>
          )}
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

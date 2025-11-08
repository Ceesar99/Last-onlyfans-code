// ProfilePage.jsx - UPDATED WITH UNIFIED LAYOUT FOR LOCKED/UNLOCKED POSTS

import React, { useEffect, useRef, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import ModalPortal from "../component/ModalPortal";
import SubscriptionModal from "../component/SubcriptionModal";
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
      parsed = JSON.parse(stored);
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
  const [tipAnimatingPosts, setTipAnimatingPosts] = useState({});
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
  const [currentFullImage, setCurrentFullImage] = useState(null);

  const findPostIndexById = (id) => posts.findIndex((p) => String(p.id) === String(id));
  const findPostById = (id) => posts.find((p) => String(p.id) === String(id));

  const openMessageModal = () => {
    navigate("/messages");
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
        } else if (mounted && Array.isArray(postsData) ) {
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

  const LockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-gray-400" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="10" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M7 10V7a5 5 0 0110 0v3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
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

  const openFullImage = (src) => {
    setCurrentFullImage(src);
    lockScroll();
  };

  const closeFullImage = () => {
    setCurrentFullImage(null);
    unlockScroll();
  };

  useEffect(() => {
    if (currentFullImage) {
      const onKey = (e) => {
        if (e.key === "Escape") closeFullImage();
      };
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    }
  }, [currentFullImage]);

  // RENDER
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
              <div className="absolute right-0 bottom-0 w-2.5 h-2.5 bg-green-400 rounded-full border border-white" />
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

          {/* TAB CONTENT */}
          <div className="bg-white p-4">
            {activeTab === "posts" && (
              <div>
                <div className="space-y-6">
                  {posts.map((p) => (
                    <div key={p.id} className="border-b pb-4 last:border-none">
                      <div className="flex items-start gap-3 mb-2">
                        <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                          <img src={creator.avatar} alt="avatar" className="w-full h-full object-cover" />
                          <div className="absolute right-0 bottom-0 w-2.5 h-2.5 bg-green-400 rounded-full border border-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1">
                                <div className="font-semibold text-[14px] text-gray-900">{creator.name}</div>
                                <VerifiedBadge />
                              </div>
                              <div className="text-[12px] text-gray-500">{creator.handle}</div>
                            </div>
                            <div className="text-[12px] text-gray-500">{p.date} ···</div>
                          </div>

                          <p className="mt-2 text-[14px] text-gray-800">{p.text}</p>

                          <div className="mt-3 relative rounded-md overflow-hidden bg-gray-100 h-44 flex items-center justify-center">
                            <img
                              src={p.mediaSrc}
                              alt={`post media ${p.id}`}
                              className={`w-full h-full object-cover ${!isPostUnlocked(p.id) ? 'opacity-70 blur-sm' : 'cursor-pointer'}`}
                              loading="lazy"
                              onClick={() => {
                                if (isPostUnlocked(p.id)) {
                                  openFullImage(p.mediaSrc);
                                }
                              }}
                            />
                            {!isPostUnlocked(p.id) && (
                              <LockIcon className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                            )}
                          </div>

                          <div className="mt-3 flex items-center gap-6 text-gray-500 text-[13px]">
                            <button onClick={() => toggleLike(p.id)} aria-label={`like post ${p.id}`}>
                              <IconLike active={!!likedPosts[p.id]} />
                            </button>

                            <button aria-label={`comment on post ${p.id}`}>
                              <IconComment />
                            </button>

                            <button onClick={() => toggleTip(p.id)} className="flex items-center gap-1" aria-label={`tip post ${p.id}`}>
                              <IconTip active={!!tipAnimatingPosts[p.id]} />
                              <span>SEND TIP</span>
                            </button>

                            <button onClick={() => toggleBookmark(p.id)} className="ml-auto" aria-label={`bookmark post ${p.id}`}>
                              <IconBookmark active={!!bookmarkedPosts[p.id]} />
                            </button>
                          </div>
                          <div className="mt-1 text-[12px] text-gray-500">{formatLikes(likeCounts[p.id] ?? p.likes)} likes</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {!subscribed && !freeSample.active && (
                  <div className="mt-4 text-center">
                    <button onClick={() => openSubModal("monthly")} className="bg-[#00AFF0] text-white text-sm font-semibold rounded-full px-8 py-2 shadow">
                      SUBSCRIBE TO SEE USER'S POSTS
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === "media" && (
              <div>
                <div className="grid grid-cols-3 gap-1">
                  {mediaItems.map((m) => {
                    const locked = !isMediaUnlocked(m.id);
                    return (
                      <div key={m.id} className="relative bg-white aspect-square border border-transparent">
                        <img
                          src={m.src}
                          alt={`media ${m.id}`}
                          className={`w-full h-full object-cover ${locked ? 'opacity-70 blur-sm' : 'cursor-pointer'}`}
                          loading="lazy"
                          onClick={() => {
                            if (!locked) {
                              openFullImage(m.src);
                            }
                          }}
                        />
                        {locked && (
                          <LockIcon className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
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

          {/* Full Image Viewer */}
          {currentFullImage && (
            <div className="fixed inset-0 z-[2000] bg-white flex items-center justify-center p-4" onClick={closeFullImage} role="dialog" aria-modal="true">
              <img src={currentFullImage} alt="Full post image" className="max-w-full max-h-full object-contain" />
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

        </div>
      </div>
    </ErrorBoundary>
  );
}

import React, { useState } from "react";

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

const CAPTIONS = [
  "Come closer, I've got secrets that'll make you blush... and beg for more. 😏",
  "This dress is tight, but my thoughts about you are even tighter. Want a peek? 🔥",
  "Sipping on something sweet, but nothing compares to the taste of temptation. 🍷",
  "Curves ahead—handle with care, or don't... I like it rough. 😉",
  "Whisper your fantasies in my ear, and I'll make them reality on here. 💋",
  "Feeling naughty today. What's your wildest desire? Let's explore. 🌶️",
  "This lingerie is just a tease. Unlock the full show? 🗝️",
  "Bite your lip, because what I'm about to show will drive you wild. 😈",
  "Poolside vibes, but my mind's in the bedroom. Dive in with me? 🏊‍♀️",
  "Soft skin, hard intentions. Ready to play? 🎲",
];

function buildPosts() {
  const startDate = new Date('2025-09-29');
  return Array.from({ length: 100 }).map((_, i) => {
    const postDate = new Date(startDate);
    postDate.setDate(postDate.getDate() - i * 3);
    
    return {
      id: `post-${i + 1}`,
      text: CAPTIONS[i % 10],
      date: postDate.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      likes: Math.floor(Math.random() * 1500000) + 200000,
      image: i < 15 ? UNLOCKED_POST_IMAGES[i] : null,
      locked: i >= 15,
    };
  });
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("posts");
  const [bioExpanded, setBioExpanded] = useState(false);
  const [freeSampleActive, setFreeSampleActive] = useState(false);
  const [posts] = useState(buildPosts);
  const creator = defaultCreator;

  const unlockedPosts = posts.filter(p => !p.locked || freeSampleActive);
  const mediaItems = unlockedPosts.filter(p => p.image);

  const formatLikes = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
    if (num >= 1000) return Math.floor(num / 1000) + "k";
    return String(num);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center p-4">
      <div className="w-full max-w-xl bg-white rounded-md shadow-sm text-[15px]" style={{ maxHeight: "calc(100vh - 2rem)", overflowY: "auto" }}>
        
        {/* BANNER */}
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

        {/* AVATAR */}
        <div className="px-4 -mt-10 flex items-start">
          <div className="relative">
            <div className="w-20 h-20 rounded-full overflow-hidden shadow-md">
              <img src={creator.avatar} alt="avatar" className="w-full h-full object-cover" />
            </div>
            <div className="absolute right-0 bottom-0 w-4 h-4 bg-green-500 rounded-full" />
          </div>
        </div>

        {/* NAME & MESSAGE */}
        <div className="px-4 mt-2 flex items-center justify-between">
          <div>
            <h2 className="text-[18px] font-bold text-gray-900">{creator.name}</h2>
            <div className="text-[13px] text-gray-500">{creator.handle} · Available now</div>
          </div>
          <button className="bg-[#00AFF0] text-white text-sm font-semibold rounded-full px-6 py-2 shadow">
            Message
          </button>
        </div>

        {/* BIO */}
        <div className="px-4 border-t mt-3 pt-3">
          <div className={`text-[14px] leading-snug text-gray-800 ${bioExpanded ? "" : "line-clamp-2"}`}>
            <p>{creator.bio}</p>
          </div>
          <button onClick={() => setBioExpanded(!bioExpanded)} className="text-[13px] text-blue-500 underline mt-2">
            {bioExpanded ? "Collapse" : "More info"}
          </button>
        </div>

        {/* SUBSCRIPTION */}
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
              <button 
                onClick={() => setFreeSampleActive(true)} 
                className="w-full rounded-full py-3 font-semibold text-white bg-[#00AFF0] flex items-center justify-between px-4"
              >
                <span>SUBSCRIBE</span>
                <span className="text-sm whitespace-nowrap">{freeSampleActive ? "$5 / month" : "FREE for 30 days"}</span>
              </button>
            </div>

            <div className="text-[11px] text-gray-500 mt-2">Regular price $5 / month</div>
          </div>
        </div>

        {/* TABS */}
        <div className="mt-4 border-t">
          <div className="grid grid-cols-2 bg-white text-[14px] font-medium">
            <button 
              onClick={() => setActiveTab("posts")} 
              className={`py-3 ${activeTab === "posts" ? "border-b-2 border-black" : "text-gray-500"}`}
            >
              {posts.length} POSTS
            </button>
            <button 
              onClick={() => setActiveTab("media")} 
              className={`py-3 ${activeTab === "media" ? "border-b-2 border-black" : "text-gray-500"}`}
            >
              {mediaItems.length} MEDIA
            </button>
          </div>
        </div>

        {/* CONTENT */}
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
                          <div className="font-semibold text-[14px] text-gray-900">{creator.name}</div>
                          <div className="text-[12px] text-gray-500">{creator.handle} · {p.date}</div>
                        </div>
                        <div className="text-gray-400">•••</div>
                      </div>

                      <p className="mt-2 text-[14px] text-gray-800">{p.text}</p>

                      {p.locked ? (
                        <div className="mt-3 bg-[#F8FAFB] border rounded-lg p-4">
                          <div className="flex flex-col items-center">
                            <svg className="w-14 h-14" viewBox="0 0 24 24" fill="none">
                              <rect x="3" y="10" width="18" height="11" rx="2" stroke="#D1D7DB" strokeWidth="1.6" />
                              <path d="M7 10V7a5 5 0 0110 0v3" stroke="#D1D7DB" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <button 
                              onClick={() => setFreeSampleActive(true)}
                              className="mt-3 px-6 py-2 rounded-full bg-[#00AFF0] text-white font-semibold text-sm"
                            >
                              SUBSCRIBE TO SEE POSTS
                            </button>
                          </div>
                        </div>
                      ) : p.image ? (
                        <div className="mt-3 rounded-md overflow-hidden h-44">
                          <img src={p.image} alt="post" className="w-full h-full object-cover" />
                        </div>
                      ) : null}

                      <div className="mt-3 flex items-center gap-4 text-gray-500 text-[13px]">
                        <div className="flex items-center gap-2">
                          <span>❤️</span>
                          <span>{formatLikes(p.likes)}</span>
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
            <div>
              <div className="grid grid-cols-3 gap-1">
                {mediaItems.map((m) => (
                  <div key={m.id} className="relative aspect-square">
                    <img src={m.image} alt="media" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

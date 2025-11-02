// ProfilePage.jsx - STEP 2: Basic Structure
import React, { useState } from "react";

const defaultCreator = {
  name: "Tayler Hills",
  avatar: "https://hyaulauextrzdaykkqre.supabase.co/storage/v1/object/public/uploads/posts/1760699188347-6c2tnk-images%20(9).jpeg",
  banner: "https://hyaulauextrzdaykkqre.supabase.co/storage/v1/object/public/uploads/posts/1760699444010-y1kcnl-Screenshot_20251017-121026.jpg",
  handle: "@taylerhillxxx",
  bio: "Hi 😊 I'm your favorite 19 year old & I love showing all of ME for your pleasure",
};

const dummyPosts = [
  {
    id: "dummy-1",
    text: "Test post 1",
    date: "Nov 1",
    likes: 1500,
  },
  {
    id: "dummy-2", 
    text: "Test post 2",
    date: "Nov 2",
    likes: 2000,
  }
];

export default function ProfilePage() {
  const [creator] = useState(defaultCreator);
  const [posts] = useState(dummyPosts);
  const [activeTab, setActiveTab] = useState("posts");
  const [bioExpanded, setBioExpanded] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center p-4">
      <div className="w-full max-w-xl bg-white rounded-md shadow-sm text-[15px]" style={{ maxHeight: "calc(100vh - 2rem)", overflowY: "auto" }}>
        
        {/* COVER */}
        <div className="relative h-36 bg-gray-200 overflow-hidden">
          <img src={creator.banner} alt="banner" className="w-full h-full object-cover" />
          <div className="absolute left-3 top-3 flex gap-4 text-white text-xs font-semibold">
            <div className="flex flex-col items-center">
              <div className="font-bold leading-tight">3.1K</div>
              <div className="text-[10px] opacity-80 leading-tight">Posts</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="font-bold leading-tight">2.9k</div>
              <div className="text-[10px] opacity-80 leading-tight">Media</div>
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

        {/* NAME */}
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
            <div className="mt-4">
              <button className="w-full rounded-full py-3 font-semibold text-white bg-[#00AFF0] flex items-center justify-between px-4">
                <span>SUBSCRIBE</span>
                <span className="font-semibold text-white text-sm">FREE for 30 days</span>
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
              0 MEDIA
            </button>
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
                      <div>
                        <div className="font-semibold text-[14px] text-gray-900">{creator.name}</div>
                        <div className="text-[12px] text-gray-500">{creator.handle} · {p.date}</div>
                      </div>
                      <p className="mt-2 text-[14px] text-gray-800">{p.text}</p>
                      <div className="mt-3 flex items-center gap-4 text-gray-500 text-[13px]">
                        <div className="flex items-center gap-2">
                          <span>❤️</span>
                          <span>{p.likes}</span>
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
            <div className="text-center text-gray-500 py-8">
              No media yet
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

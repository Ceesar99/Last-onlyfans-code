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

  const styles = {
    container: { minHeight: "100vh", backgroundColor: "#f3f4f6", display: "flex", justifyContent: "center", padding: "16px" },
    card: { width: "100%", maxWidth: "672px", backgroundColor: "white", borderRadius: "6px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", fontSize: "15px", maxHeight: "calc(100vh - 32px)", overflowY: "auto" },
    banner: { position: "relative", height: "144px", backgroundColor: "#e5e7eb", overflow: "hidden" },
    bannerImg: { width: "100%", height: "100%", objectFit: "cover" },
    stats: { position: "absolute", left: "12px", top: "12px", display: "flex", gap: "16px", color: "white", fontSize: "12px", fontWeight: "600" },
    avatarContainer: { padding: "0 16px", marginTop: "-40px", display: "flex", alignItems: "flex-start" },
    avatar: { width: "80px", height: "80px", borderRadius: "50%", overflow: "hidden", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" },
    avatarImg: { width: "100%", height: "100%", objectFit: "cover" },
    greenDot: { position: "absolute", right: "0", bottom: "0", width: "16px", height: "16px", backgroundColor: "#10b981", borderRadius: "50%" },
    nameSection: { padding: "8px 16px 0", display: "flex", alignItems: "center", justifyContent: "space-between" },
    name: { fontSize: "18px", fontWeight: "bold", color: "#111827", margin: 0 },
    handle: { fontSize: "13px", color: "#6b7280" },
    messageBtn: { backgroundColor: "#00AFF0", color: "white", fontSize: "14px", fontWeight: "600", borderRadius: "20px", padding: "8px 24px", border: "none", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", cursor: "pointer" },
    bioSection: { padding: "12px 16px", borderTop: "1px solid #e5e7eb", marginTop: "12px" },
    bioText: { fontSize: "14px", lineHeight: "1.5", color: "#1f2937", overflow: "hidden", textOverflow: "ellipsis" },
    bioBtn: { fontSize: "13px", color: "#3b82f6", textDecoration: "underline", marginTop: "8px", background: "none", border: "none", cursor: "pointer", padding: 0 },
    subSection: { padding: "0 16px", marginTop: "16px" },
    subCard: { backgroundColor: "white", padding: "16px", borderRadius: "6px", border: "1px solid #e5e7eb" },
    subTitle: { fontSize: "11px", fontWeight: "600", color: "#6b7280" },
    subOffer: { marginTop: "4px", fontSize: "14px", fontWeight: "500", color: "#1f2937" },
    subMessage: { marginTop: "12px", backgroundColor: "#f3f4f6", borderRadius: "6px", padding: "12px", display: "flex", alignItems: "flex-start", gap: "12px" },
    subBtn: { width: "100%", borderRadius: "20px", padding: "12px 16px", fontWeight: "600", color: "white", backgroundColor: "#00AFF0", border: "none", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", marginTop: "16px" },
    tabs: { marginTop: "16px", borderTop: "1px solid #e5e7eb" },
    tabGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", backgroundColor: "white", fontSize: "14px", fontWeight: "500" },
    tabBtn: { padding: "12px 0", background: "none", border: "none", cursor: "pointer" },
    postsContainer: { backgroundColor: "white", padding: "16px" },
    postsList: { display: "flex", flexDirection: "column", gap: "24px" },
    post: { borderBottom: "1px solid #e5e7eb", paddingBottom: "16px" },
    postContent: { display: "flex", alignItems: "flex-start", gap: "12px" },
    postAvatar: { width: "40px", height: "40px", borderRadius: "50%", overflow: "hidden" },
    postHeader: { display: "flex", alignItems: "center", justifyContent: "space-between" },
    postName: { fontWeight: "600", fontSize: "14px", color: "#111827" },
    postHandle: { fontSize: "12px", color: "#6b7280" },
    postText: { marginTop: "8px", fontSize: "14px", color: "#1f2937" },
    postActions: { marginTop: "12px", display: "flex", alignItems: "center", gap: "16px", color: "#6b7280", fontSize: "13px" },
    noMedia: { textAlign: "center", color: "#6b7280", padding: "32px 0" },
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        
        <div style={styles.banner}>
          <img src={creator.banner} alt="banner" style={styles.bannerImg} />
          <div style={styles.stats}>
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

        <div style={styles.avatarContainer}>
          <div style={{ position: "relative" }}>
            <div style={styles.avatar}>
              <img src={creator.avatar} alt="avatar" style={styles.avatarImg} />
            </div>
            <div style={styles.greenDot} />
          </div>
        </div>

        <div style={styles.nameSection}>
          <div>
            <h2 style={styles.name}>{creator.name}</h2>
            <div style={styles.handle}>{creator.handle} · Available now</div>
          </div>
          <button style={styles.messageBtn}>Message</button>
        </div>

        <div style={styles.bioSection}>
          <div style={{ ...styles.bioText, display: bioExpanded ? "block" : "-webkit-box", WebkitLineClamp: bioExpanded ? "unset" : "2", WebkitBoxOrient: "vertical" }}>
            <p style={{ margin: 0 }}>{creator.bio}</p>
          </div>
          <button onClick={() => setBioExpanded(!bioExpanded)} style={styles.bioBtn}>
            {bioExpanded ? "Collapse" : "More info"}
          </button>
        </div>

        <div style={styles.subSection}>
          <div style={styles.subCard}>
            <div style={styles.subTitle}>SUBSCRIPTION</div>
            <div style={styles.subOffer}>Limited offer - Free trial for 30 days!</div>
            
            <div style={styles.subMessage}>
              <div style={{ width: "32px", height: "32px", borderRadius: "50%", overflow: "hidden" }}>
                <img src={creator.avatar} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div style={{ fontSize: "14px", color: "#374151" }}>I'm Always Hornyyyyyy 🤤💦</div>
            </div>

            <button style={styles.subBtn}>
              <span>SUBSCRIBE</span>
              <span style={{ fontSize: "14px", whiteSpace: "nowrap" }}>FREE for 30 days</span>
            </button>

            <div style={{ fontSize: "11px", color: "#6b7280", marginTop: "8px" }}>Regular price $5 / month</div>
          </div>
        </div>

        <div style={styles.tabs}>
          <div style={styles.tabGrid}>
            <button onClick={() => setActiveTab("posts")} style={{ ...styles.tabBtn, borderBottom: activeTab === "posts" ? "2px solid black" : "none", color: activeTab === "posts" ? "black" : "#6b7280" }}>
              {posts.length} POSTS
            </button>
            <button onClick={() => setActiveTab("media")} style={{ ...styles.tabBtn, borderBottom: activeTab === "media" ? "2px solid black" : "none", color: activeTab === "media" ? "black" : "#6b7280" }}>
              0 MEDIA
            </button>
          </div>
        </div>

        <div style={styles.postsContainer}>
          {activeTab === "posts" && (
            <div style={styles.postsList}>
              {posts.map((p) => (
                <article key={p.id} style={styles.post}>
                  <div style={styles.postContent}>
                    <div style={styles.postAvatar}>
                      <img src={creator.avatar} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                    <div style={{ flex: "1" }}>
                      <div style={styles.postHeader}>
                        <div>
                          <div style={styles.postName}>{creator.name}</div>
                          <div style={styles.postHandle}>{creator.handle} · {p.date}</div>
                        </div>
                        <div style={{ color: "#9ca3af" }}>•••</div>
                      </div>
                      <p style={styles.postText}>{p.text}</p>
                      <div style={styles.postActions}>
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
            <div style={styles.noMedia}>No media yet</div>
          )}
        </div>

      </div>
    </div>
  );
}

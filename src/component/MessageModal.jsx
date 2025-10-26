import React, { useState, useRef, useEffect } from "react";
import { Camera, Image as Gallery, Mic, Send } from "lucide-react";

function MessageInput({ onSend, onCamera, onGallery, onMic }) {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (!text.trim()) return;
    onSend(text);
    setText("");
  };

  return (
    <div className="flex items-center gap-2 p-3 border-t bg-white sticky bottom-0">
      <button onClick={onCamera} className="text-[#00AFF0]">
        <Camera size={22} />
      </button>
      <button onClick={onGallery} className="text-[#00AFF0]">
        <Gallery size={22} />
      </button>
      <button onClick={onMic} className="text-[#00AFF0]">
        <Mic size={22} />
      </button>
      <input
        className="flex-1 border rounded-full px-3 py-2 text-sm"
        placeholder="Write a message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        onClick={handleSend}
        className="p-2 rounded-full text-white bg-[#00AFF0]"
      >
        <Send size={18} />
      </button>
    </div>
  );
}

export default function MessageModal({ creator, onClose }) {
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (msg) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages((prev) => [...prev, { text: msg, me: true, time, status: 'Sent' }]);
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-2xl max-w-md w-full">
      <header className="flex items-center gap-3 p-4 border-b">
        <button onClick={onClose} className="text-[#00AFF0]">←</button>
        <img src={creator?.avatar || "https://via.placeholder.com/40"} alt="avatar" className="w-10 h-10 rounded-full object-cover" />
        <h2 className="text-gray-900 font-semibold">{creator?.name || "Tayler Hills"}</h2>
      </header>

      <div className="flex-1 overflow-y-auto bg-gray-50 p-4 pb-24">
        {messages.map((m, i) => (
          <div key={i} className={`mb-2 flex flex-col ${m.me ? 'items-end' : 'items-start'}`}>
            <div className={`text-sm px-3 py-2 max-w-[75%] rounded-2xl break-words ${m.me ? "bg-[#00AFF0] text-white" : "bg-gray-200 text-gray-800"}`}>
              {m.text}
            </div>
            <div className="text-[10px] text-gray-500 mt-1 flex items-center gap-1">
              <span>{m.time}</span>
              {m.me && <span>{m.status === 'Sent' ? '✓' : '✓✓'}</span>}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <MessageInput
        onSend={handleSend}
        onCamera={() => alert("Open camera")}
        onGallery={() => alert("Open gallery")}
        onMic={() => alert("Start recording")}
      />
    </div>
  );
}
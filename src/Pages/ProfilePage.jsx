import React, { useState } from "react";

// TRY IMPORTING ONE AT A TIME - COMMENT OUT THE OTHERS
// import ModalPortal from "../component/ModalPortal";
// import SubscriptionModal from "../component/SubcriptionModal";
// import AddCardForm from "../component/AddCardForm";

const defaultCreator = {
  name: "Tayler Hills",
  avatar: "https://hyaulauextrzdaykkqre.supabase.co/storage/v1/object/public/uploads/posts/1760699188347-6c2tnk-images%20(9).jpeg",
  banner: "https://hyaulauextrzdaykkqre.supabase.co/storage/v1/object/public/uploads/posts/1760699444010-y1kcnl-Screenshot_20251017-121026.jpg",
  handle: "@taylerhillxxx",
  bio: "Hi 😊 I'm your favorite 19 year old",
};

export default function ProfilePage() {
  const [creator] = useState(defaultCreator);

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center p-4">
      <div className="w-full max-w-xl bg-white rounded-md shadow-sm p-6">
        
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-green-600">✅ ProfilePage Loaded!</h1>
          <p className="text-gray-600 mt-2">Now testing imports one by one...</p>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded">
            <h2 className="font-bold">Step 1: Uncomment ModalPortal import</h2>
            <p className="text-sm text-gray-600">If page goes blank = ModalPortal is broken</p>
          </div>

          <div className="p-4 bg-blue-50 rounded">
            <h2 className="font-bold">Step 2: Uncomment SubscriptionModal import</h2>
            <p className="text-sm text-gray-600">If page goes blank = SubscriptionModal is broken</p>
          </div>

          <div className="p-4 bg-blue-50 rounded">
            <h2 className="font-bold">Step 3: Uncomment AddCardForm import</h2>
            <p className="text-sm text-gray-600">If page goes blank = AddCardForm is broken</p>
          </div>
        </div>

        <div className="mt-6 p-4 bg-gray-100 rounded">
          <h3 className="font-bold mb-2">Profile Info:</h3>
          <img src={creator.avatar} alt="avatar" className="w-16 h-16 rounded-full mb-2" />
          <p><strong>Name:</strong> {creator.name}</p>
          <p><strong>Handle:</strong> {creator.handle}</p>
        </div>

      </div>
    </div>
  );
}

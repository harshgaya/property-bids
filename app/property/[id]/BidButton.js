"use client";

import { useState, useEffect } from "react";
import { RiAuctionLine } from "react-icons/ri";
import BidModal from "@/components/property/BidModal";

export default function BidButton({ property }) {
  const [user, setUser] = useState(undefined); // undefined = loading
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => setUser(d.success ? d.user : null))
      .catch(() => setUser(null));
  }, []);

  const isOwn = user && property.ownerId === user._id;

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        disabled={user === undefined}
        className={`w-full flex items-center justify-center gap-2 py-4 font-bold rounded-2xl transition-colors shadow-md text-sm mb-3 ${
          isOwn
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-green-600 text-white hover:bg-green-700 shadow-green-100"
        }`}
      >
        <RiAuctionLine className="text-base" />
        {user === undefined
          ? "Loading..."
          : isOwn
            ? "Your Property"
            : "Place Bid — ₹99"}
      </button>

      {showModal && (
        <BidModal
          property={property}
          user={user}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}

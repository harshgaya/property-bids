"use client";

import { useState, useEffect } from "react";
import { RiAuctionLine, RiCheckLine } from "react-icons/ri";
import BidModal from "@/components/property/BidModal";

export default function BidButton({ property }) {
  const [user, setUser] = useState(undefined);
  const [showModal, setShowModal] = useState(false);
  const [alreadyBid, setAlreadyBid] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then(async (d) => {
        if (d.success) {
          setUser(d.user);
          // Check if user already placed a bid on this property
          const bidRes = await fetch(
            `/api/bids/check?propertyId=${property._id}`,
          );
          const bidData = await bidRes.json();
          if (bidData.hasBid) setAlreadyBid(true);
        } else {
          setUser(null);
        }
      })
      .catch(() => setUser(null));
  }, [property._id]);

  const isOwn = user && property.ownerId === user._id;

  let label = "Place Bid — ₹99";
  let classes = "bg-green-600 text-white hover:bg-green-700 shadow-green-100";
  let disabled = user === undefined;

  if (user === undefined) {
    label = "Loading...";
  } else if (isOwn) {
    label = "Your Property";
    classes = "bg-gray-100 text-gray-400 cursor-not-allowed";
    disabled = true;
  } else if (alreadyBid) {
    label = "Bid Placed ✓";
    classes =
      "bg-green-50 text-green-700 border border-green-300 cursor-not-allowed";
    disabled = true;
  }

  return (
    <>
      <button
        onClick={() => !disabled && !alreadyBid && !isOwn && setShowModal(true)}
        disabled={disabled}
        className={`w-full flex items-center justify-center gap-2 py-4 font-bold rounded-2xl transition-colors shadow-md text-sm mb-3 ${classes}`}
      >
        {alreadyBid ? (
          <RiCheckLine className="text-base" />
        ) : (
          <RiAuctionLine className="text-base" />
        )}
        {label}
      </button>

      {showModal && (
        <BidModal
          property={property}
          user={user}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            setAlreadyBid(true);
          }}
        />
      )}
    </>
  );
}

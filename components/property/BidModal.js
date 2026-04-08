"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  RiCloseLine,
  RiAuctionLine,
  RiErrorWarningLine,
  RiShieldCheckLine,
  RiLockLine,
  RiCheckLine,
  RiInformationLine,
} from "react-icons/ri";

function loadRazorpay() {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function BidModal({ property, user, onClose }) {
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const isOwn = user && property.ownerId === user._id;
  const isUnverified = property.trust === "basic";
  const hasAccepted = property.bidStatus === "accepted";
  const isInactive = !property.isActive || !property.isPaid;
  const priceInLakhs = property.price / 100000;

  // Checks before allowing bid
  const canBid = user && !isOwn && !hasAccepted;

  async function handleBid() {
    if (!user) {
      router.push(`/login?redirect=/property/${property._id}`);
      return;
    }
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      setError("Enter a valid bid amount");
      return;
    }

    setLoading(true);
    setError("");
    try {
      // 1. Load Razorpay script
      const loaded = await loadRazorpay();
      if (!loaded) throw new Error("Failed to load payment gateway");

      // 2. Create order
      const orderRes = await fetch("/api/bids/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ propertyId: property._id }),
      });
      const orderData = await orderRes.json();
      if (!orderData.success) throw new Error(orderData.message);

      // 3. Open Razorpay checkout
      await new Promise((resolve, reject) => {
        const rzp = new window.Razorpay({
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: orderData.amount,
          currency: orderData.currency,
          name: "PropertyBids",
          description: "Bid fee — ₹99",
          order_id: orderData.orderId,
          prefill: {
            contact: user.phone,
          },
          theme: { color: "#16a34a" },
          handler: async (response) => {
            try {
              // 4. Verify payment + record bid
              const bidRes = await fetch("/api/bids", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  propertyId: property._id,
                  amount: parseFloat(amount),
                  message,
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature,
                }),
              });
              const bidData = await bidRes.json();
              if (!bidData.success) throw new Error(bidData.message);
              setSuccess(true);
              resolve();
            } catch (e) {
              reject(e);
            }
          },
          modal: {
            ondismiss: () => reject(new Error("Payment cancelled")),
          },
        });
        rzp.open();
      });
    } catch (e) {
      if (e.message !== "Payment cancelled") setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  if (success)
    return (
      <div
        className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-2xl p-8 max-w-sm w-full text-center"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <RiCheckLine className="text-green-600 text-3xl" />
          </div>
          <h3 className="text-xl font-extrabold text-gray-900 mb-2">
            Bid Placed!
          </h3>
          <p className="text-gray-500 text-sm mb-1">
            Your bid of <strong>₹{amount} L</strong> has been placed.
          </p>
          <p className="text-gray-400 text-xs mb-6">
            {
              " The owner will review and respond. You'll see updates in your dashboard."
            }
          </p>
          <button
            onClick={() => {
              onClose();
              router.push("/dashboard?tab=placedBids");
            }}
            className="w-full py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors text-sm"
          >
            View My Bids
          </button>
        </div>
      </div>
    );

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <RiAuctionLine className="text-green-600 text-lg" />
            <h3 className="font-extrabold text-gray-900">Place a Bid</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100 text-gray-500 transition-colors"
          >
            <RiCloseLine />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Property summary */}
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="font-semibold text-gray-900 text-sm truncate">
              {property.title}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              {property.address?.area}, {property.address?.city}
            </p>
            <p className="text-green-600 font-black mt-1">
              {property.priceLabel} asking
            </p>
          </div>

          {/* Not logged in */}
          {!user && (
            <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-xl">
              <RiInformationLine className="text-blue-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-blue-700">
                You need to <strong>log in</strong> to place a bid.
              </p>
            </div>
          )}

          {/* Own property warning */}
          {isOwn && (
            <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-xl">
              <RiErrorWarningLine className="text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-red-700">
                You cannot bid on your own property.
              </p>
            </div>
          )}

          {/* Already accepted */}
          {hasAccepted && !isOwn && (
            <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-xl">
              <RiLockLine className="text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-red-700">
                This property already has an accepted bid and is no longer
                available.
              </p>
            </div>
          )}

          {/* Unverified warning */}
          {isUnverified && canBid && (
            <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-xl">
              <RiErrorWarningLine className="text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-amber-700">
                  Unverified listing
                </p>
                <p className="text-xs text-amber-600 mt-0.5">
                  This property has not been GPS or document verified. Visit the
                  site before proceeding. Your ₹99 bid fee is non-refundable.
                </p>
              </div>
            </div>
          )}

          {/* Bid form */}
          {canBid && (
            <>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">
                  Your Offer (₹ Lakhs)
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder={`e.g. ${priceInLakhs}`}
                  className="w-full px-4 py-3 text-xl font-bold border border-gray-200 rounded-xl outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition"
                />
                {amount && parseFloat(amount) > 0 && (
                  <p className="text-xs text-gray-400 mt-1">
                    = ₹{(parseFloat(amount) * 100000).toLocaleString("en-IN")}
                    {parseFloat(amount) < priceInLakhs && (
                      <span className="text-amber-600 ml-2">
                        (
                        {Math.round(
                          ((priceInLakhs - parseFloat(amount)) / priceInLakhs) *
                            100,
                        )}
                        % below asking)
                      </span>
                    )}
                  </p>
                )}
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">
                  Message to Seller{" "}
                  <span className="text-gray-400 font-normal normal-case">
                    (optional)
                  </span>
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Introduce yourself or mention your intent..."
                  rows={2}
                  className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition resize-none"
                />
              </div>

              {error && (
                <p className="flex items-center gap-2 text-red-500 text-xs bg-red-50 px-3 py-2 rounded-xl">
                  <RiErrorWarningLine />
                  {error}
                </p>
              )}

              <button
                onClick={handleBid}
                disabled={loading || !amount}
                className="w-full flex items-center justify-center gap-2 py-4 bg-green-600 text-white font-bold rounded-2xl hover:bg-green-700 disabled:opacity-50 transition-colors text-sm"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />{" "}
                    Processing...
                  </>
                ) : (
                  <>
                    <RiAuctionLine /> Pay ₹99 & Place Bid
                  </>
                )}
              </button>

              <div className="flex items-center gap-2 justify-center">
                <RiLockLine className="text-gray-400 text-xs" />
                <p className="text-xs text-gray-400">
                  Bid fee ₹99 is non-refundable · Only seller sees your bid ·
                  Valid 30 days
                </p>
              </div>
            </>
          )}

          {/* Not logged in action */}
          {!user && (
            <button
              onClick={() =>
                router.push(`/login?redirect=/property/${property._id}`)
              }
              className="w-full py-3.5 bg-green-600 text-white font-bold rounded-2xl hover:bg-green-700 transition-colors text-sm"
            >
              Log in to Place Bid
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";
import { useState } from "react";
import {
  RiCloseLine,
  RiCheckLine,
  RiLockLine,
  RiShieldCheckLine,
} from "react-icons/ri";
import { PLANS } from "@/constants";

function loadRazorpay() {
  console.log("razorpay key id", process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID);

  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

export default function ListingPaymentModal({ property, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const plan = PLANS.find((p) => p.key === property.plan) || PLANS[0];

  async function handlePay() {
    setLoading(true);
    setError("");
    try {
      // 1. Create order
      const orderRes = await fetch("/api/listing-payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ propertyId: property._id }),
      });
      const orderData = await orderRes.json();
      if (!orderData.success) throw new Error(orderData.message);

      // Free plan — already marked paid
      if (orderData.free) {
        setSuccess(true);
        onSuccess?.();
        return;
      }

      // 2. Load Razorpay
      const loaded = await loadRazorpay();
      if (!loaded) throw new Error("Failed to load payment gateway");

      // 3. Open checkout
      await new Promise((resolve, reject) => {
        const rzp = new window.Razorpay({
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: orderData.amount,
          currency: orderData.currency,
          name: "PropertyBids",
          description: `${plan.name} — ${property.title}`,
          order_id: orderData.orderId,
          theme: { color: "#16a34a" },
          handler: async (response) => {
            try {
              // 4. Verify payment server-side
              const verifyRes = await fetch("/api/listing-payment/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  propertyId: property._id,
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature,
                }),
              });
              const verifyData = await verifyRes.json();
              if (!verifyData.success) throw new Error(verifyData.message);
              setSuccess(true);
              onSuccess?.();
              resolve();
            } catch (e) {
              reject(e);
            }
          },
          modal: { ondismiss: () => reject(new Error("Payment cancelled")) },
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
            Listing is Live!
          </h3>
          <p className="text-gray-500 text-sm mb-1">
            Your property is now visible to buyers.
          </p>
          <p className="text-gray-400 text-xs mb-6">
            Payment verified and listing activated.
          </p>
          <button
            onClick={onClose}
            className="w-full py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors text-sm"
          >
            Done
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
        className="bg-white rounded-2xl w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h3 className="font-extrabold text-gray-900">Activate Listing</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100 text-gray-500"
          >
            <RiCloseLine />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Property */}
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="font-semibold text-gray-900 text-sm truncate">
              {property.title}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              {property.address?.area}, {property.address?.city}
            </p>
          </div>

          {/* Plan details */}
          <div
            className={`rounded-xl p-4 border-2 ${plan.key === "legal" ? "border-green-400 bg-green-50" : plan.key === "manual" ? "border-blue-400 bg-blue-50" : "border-gray-200"}`}
          >
            <div className="flex items-center justify-between mb-2">
              <p className="font-bold text-gray-900">{plan.name}</p>
              <p className="font-black text-gray-900 text-lg">
                {plan.priceLabel}
              </p>
            </div>
            <ul className="space-y-1">
              {plan.features.map((f, i) => (
                <li
                  key={i}
                  className="flex items-center gap-2 text-xs text-gray-600"
                >
                  <RiCheckLine className="text-green-500 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* What happens */}
          <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-100 rounded-xl">
            <RiShieldCheckLine className="text-blue-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-blue-700">
              After payment, your listing goes live immediately and starts
              receiving bids from verified buyers.
            </p>
          </div>

          {error && (
            <p className="text-red-500 text-xs bg-red-50 px-3 py-2 rounded-xl">
              {error}
            </p>
          )}

          <button
            onClick={handlePay}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-4 bg-green-600 text-white font-bold rounded-2xl hover:bg-green-700 disabled:opacity-50 transition-colors text-sm"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <RiLockLine /> Pay {plan.priceLabel} & Go Live
              </>
            )}
          </button>

          <p className="text-xs text-gray-400 text-center">
            Secured by Razorpay · One-time payment
          </p>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useCartStore } from "@/lib/store/useCartStore";
import { createOrderAction } from "@/app/actions/checkout";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Header from "@/components/Header";
import { MapPin, ShieldCheck, CheckCircle2, XCircle } from "lucide-react";

export default function CheckoutPage() {
  const { items, clearCart } = useCartStore();
  const router = useRouter();

  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [pincodeStatus, setPincodeStatus] = useState<"idle" | "checking" | "available" | "unavailable">("idle");

  const checkDelivery = async () => {
    if (pincode.length !== 6) return;
    setPincodeStatus("checking");
    await new Promise(resolve => setTimeout(resolve, 600));
    if (pincode.startsWith("5") || pincode === "110001") setPincodeStatus("available");
    else setPincodeStatus("unavailable");
  };

  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === "SILK10") {
      setAppliedCoupon(true);
    } else {
      alert("Invalid coupon code");
      setAppliedCoupon(false);
    }
  };

  const handlePayment = async () => {
    if (!address || pincodeStatus !== "available") {
      alert("Please provide a valid shipping address and serviceable pincode.");
      return;
    }

    setLoading(true);
    
    // Simulate Razorpay popup delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Call server action to create order
    const result = await createOrderAction({
      items: items.map(i => ({ id: i.id, quantity: i.quantity })),
      shippingAddress: address,
      pincode,
      couponCode: appliedCoupon ? "SILK10" : ""
    });

    if (result.success) {
      clearCart();
      router.push(`/checkout/success?orderId=${result.orderId}`);
    } else {
      alert(`Payment failed: ${result.message}`);
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <h2 className="text-3xl font-display font-bold text-primary-900 mb-4">Your cart is empty</h2>
          <p className="text-primary-700 mb-8">Add some beautiful sarees to your cart before checking out.</p>
          <button onClick={() => router.push('/')} className="bg-primary-900 text-white px-8 py-3 rounded-full font-semibold">
            Continue Shopping
          </button>
        </main>
      </div>
    );
  }

  // Calculate totals
  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const discount = appliedCoupon ? subtotal * 0.10 : 0;
  const taxableAmount = subtotal - discount;
  const gst = taxableAmount * 0.05;
  const total = taxableAmount + gst;

  return (
    <div className="min-h-screen flex flex-col bg-secondary-light">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
        <h1 className="font-display text-4xl font-bold text-primary-900 mb-8">Secure Checkout</h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left: Forms */}
          <div className="flex-1 space-y-8">
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-secondary/20">
              <h2 className="text-2xl font-bold text-primary-900 mb-4 flex items-center gap-2">
                <MapPin className="w-6 h-6 text-accent" /> Shipping Address
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-1">Full Address</label>
                  <textarea 
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full border border-secondary rounded-lg p-3 outline-none focus:border-accent"
                    rows={3}
                    placeholder="123 Main St, Apartment 4B..."
                  />
                </div>
                <div className="flex gap-2 items-end">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-primary-700 mb-1">Pincode</label>
                    <input 
                      type="text" 
                      value={pincode}
                      onChange={(e) => {
                        setPincode(e.target.value.replace(/\D/g, ""));
                        setPincodeStatus("idle");
                      }}
                      maxLength={6}
                      className="w-full border border-secondary rounded-lg p-3 outline-none focus:border-accent"
                      placeholder="6-digit Pincode"
                    />
                  </div>
                  <button 
                    onClick={checkDelivery}
                    disabled={pincode.length !== 6 || pincodeStatus === "checking"}
                    className="bg-secondary text-primary-900 px-6 py-3 rounded-lg font-medium hover:bg-secondary-dark transition-colors"
                  >
                    {pincodeStatus === "checking" ? "Checking..." : "Verify"}
                  </button>
                </div>
                {pincodeStatus === "available" && <p className="text-green-700 text-sm flex items-center gap-1"><CheckCircle2 className="w-4 h-4"/> Serviceable Pincode</p>}
                {pincodeStatus === "unavailable" && <p className="text-accent text-sm flex items-center gap-1"><XCircle className="w-4 h-4"/> Delivery not available</p>}
              </div>
            </section>
          </div>

          {/* Right: Order Summary */}
          <div className="w-full lg:w-[400px] shrink-0">
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-secondary/20 sticky top-24">
              <h2 className="text-2xl font-bold text-primary-900 mb-4">Order Summary</h2>
              
              <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2">
                {items.map(item => (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative w-16 h-20 rounded-md overflow-hidden bg-secondary">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-primary-900 line-clamp-1">{item.name}</p>
                      <p className="text-sm text-primary-600">Qty: {item.quantity}</p>
                      <p className="font-medium text-primary-800">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-b border-secondary/40 py-4 mb-4 space-y-2 text-sm">
                <div className="flex justify-between text-primary-800">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-green-700">
                    <span>Discount (SILK10)</span>
                    <span>- ₹{discount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between text-primary-800">
                  <span>GST (5%)</span>
                  <span>₹{gst.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-primary-800">
                  <span>Shipping</span>
                  <span className="text-green-700 font-medium">FREE</span>
                </div>
              </div>

              <div className="flex justify-between items-center font-bold text-xl text-primary-900 mb-6">
                <span>Total</span>
                <span>₹{total.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex gap-2 mb-6">
                <input 
                  type="text" 
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  disabled={appliedCoupon}
                  placeholder="Coupon Code (try SILK10)"
                  className="flex-1 border border-secondary rounded-lg px-3 py-2 text-sm outline-none focus:border-accent"
                />
                <button 
                  onClick={handleApplyCoupon}
                  disabled={appliedCoupon || !couponCode}
                  className="bg-secondary text-primary-900 px-4 py-2 rounded-lg text-sm font-medium hover:bg-secondary-dark transition-colors disabled:opacity-50"
                >
                  Apply
                </button>
              </div>

              <button 
                onClick={handlePayment}
                disabled={loading || !address || pincodeStatus !== "available"}
                className="w-full flex items-center justify-center gap-2 bg-accent text-white py-4 rounded-xl font-bold text-lg hover:bg-accent-hover transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Processing..." : "Pay via Razorpay (Mock)"}
              </button>
              
              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-primary-600">
                <ShieldCheck className="w-4 h-4" />
                Secure 128-bit SSL Encrypted Payment
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

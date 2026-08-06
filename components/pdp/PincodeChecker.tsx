"use client";

import { useState } from "react";
import { MapPin, CheckCircle2, XCircle } from "lucide-react";

export default function PincodeChecker() {
  const [pincode, setPincode] = useState("");
  const [status, setStatus] = useState<"idle" | "checking" | "available" | "unavailable">("idle");

  const checkDelivery = async () => {
    if (pincode.length !== 6) return;
    setStatus("checking");
    
    // Stub API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock logic: starts with 5 is available, else unavailable (just for demo)
    if (pincode.startsWith("5") || pincode === "110001") {
      setStatus("available");
    } else {
      setStatus("unavailable");
    }
  };

  return (
    <div className="mt-8 border-t border-b border-secondary/40 py-6">
      <div className="flex items-center gap-2 mb-3">
        <MapPin className="w-5 h-5 text-primary-700" />
        <h4 className="font-semibold text-primary-900">Check Delivery Availability</h4>
      </div>
      
      <div className="flex gap-2">
        <input 
          type="text" 
          maxLength={6}
          placeholder="Enter 6-digit Pincode"
          value={pincode}
          onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
          className="flex-1 border border-secondary rounded-md px-4 py-2 focus:outline-none focus:border-accent"
        />
        <button 
          onClick={checkDelivery}
          disabled={pincode.length !== 6 || status === "checking"}
          className="bg-primary-900 text-white px-6 py-2 rounded-md font-medium hover:bg-primary-800 disabled:opacity-50 transition-colors"
        >
          {status === "checking" ? "Checking..." : "Check"}
        </button>
      </div>

      {status === "available" && (
        <div className="flex items-center gap-2 mt-3 text-green-700 text-sm">
          <CheckCircle2 className="w-4 h-4" />
          <span>Delivery available for {pincode}. Usually ships in 3-5 business days.</span>
        </div>
      )}
      
      {status === "unavailable" && (
        <div className="flex items-center gap-2 mt-3 text-accent text-sm">
          <XCircle className="w-4 h-4" />
          <span>Sorry, we do not deliver to {pincode} at this time.</span>
        </div>
      )}
    </div>
  );
}

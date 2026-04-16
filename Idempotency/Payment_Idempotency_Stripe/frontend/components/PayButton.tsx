"use client";

import { v4 as uuid } from "uuid";
import { loadRazorpay } from "../lib/razorpay";

type RazorpayPaymentResponse = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

type RazorpayOptions = {
  key: string | undefined;
  amount: number;
  currency: string;
  order_id: string;
  handler: (response: RazorpayPaymentResponse) => Promise<void>;
};

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => { open: () => void };
  }
}

export default function PayButton() {
  const handlePay = async () => {
    await loadRazorpay();

    const createOrderKey = uuid();

    const res = await fetch("http://localhost:5000/create-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Idempotency-Key": createOrderKey,
      },
      body: JSON.stringify({ amount: 500 }),
    });

    const data = await res.json();
    if (!res.ok) {
      alert(data.error ?? "Unable to create order");
      return;
    }

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: data.amount * 100,
      currency: "INR",
      order_id: data.orderId,

      handler: async (response: RazorpayPaymentResponse) => {
        const verifyRes = await fetch("http://localhost:5000/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Idempotency-Key": uuid(),
          },
          body: JSON.stringify(response),
        });

        const verifyData = await verifyRes.json();
        alert(verifyRes.ok ? "Payment verified" : verifyData.error ?? "Payment verification failed");
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return(
    <div className="bg-amber-50">
      <button onClick={handlePay} className="w-full white boarder border-amber-200 text-black">Pay Now</button>
    </div>
  );
}

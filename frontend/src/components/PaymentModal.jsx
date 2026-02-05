import React from "react";

// if your QR image is imported like this
// import qrImage from "../assets/upi-qr.png";

const PaymentModal = ({ amount = 200 }) => {

  const handlePayment = async () => {
    try {
      // 1. Create order from backend
      const res = await fetch(
        `http://localhost:8000/payments/create-order?amount=${amount}`,
        { method: "POST" }
      );

      const data = await res.json();

      // 2. Razorpay options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: "INR",
        name: "Student Prep Hub",
        description: "Booking Payment",
        order_id: data.order_id,

        handler: async function (response) {
          // 3. Verify payment
          await fetch("http://localhost:8000/payments/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response)
          });

          alert("Payment Successful 🎉");
        },

        theme: {
          color: "#ec4899"
        }
      };

      // 4. Open Razorpay popup
      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment failed. Please try again.");
    }
  };

  return (
    <div className="space-y-4">

      {/* ===== QR PAYMENT ===== */}
      <div className="text-center">
        <p className="text-sm text-gray-400 mb-2">Scan QR Code to Pay</p>

        <img
          src="/upi-qr.png"   // change path if needed
          alt="UPI QR"
          className="mx-auto w-48 h-48"
        />

        <p className="mt-2 text-sm text-gray-400">
          Or pay to UPI ID: <span className="text-pink-500">skservices@upi</span>
        </p>
      </div>

      {/* ===== DIVIDER ===== */}
      <div className="text-center text-gray-500">— OR —</div>

      {/* ===== RAZORPAY BUTTON ===== */}
      <button
        onClick={handlePayment}
        className="w-full bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-lg font-semibold"
      >
        Pay ₹{amount} with Razorpay
      </button>

    </div>
  );
};

export default PaymentModal;

import { useState } from "react";
import { useRouter } from "next/router";

export default function VerifyOTP() {

  const router = useRouter();

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const verifyOTP = async (e) => {

    e.preventDefault();

    setLoading(true);
    setError("");

    const mobile = localStorage.getItem("resetMobile");

    const response = await fetch("/api/agents/verify-otp", {

      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        mobile,
        otp,
      }),

    });

    const data = await response.json();

    setLoading(false);

    if (data.success) {

      localStorage.setItem("resetToken", data.resetToken);

      alert("OTP Verified Successfully");

      router.push("/agent/reset-password");

    } else {

      setError(data.message);

    }

  };

  return (

    <div className="min-h-screen flex justify-center items-center bg-gray-100">

      <div className="bg-white shadow-xl rounded-xl p-8 w-[430px]">

        <h1 className="text-4xl font-bold text-green-800 text-center">
          VEDA
        </h1>

        <p className="text-center text-gray-500 mt-2">
          Verify OTP
        </p>

        <form onSubmit={verifyOTP} className="mt-8">

          <label className="block mb-2">
            Enter OTP
          </label>

          <input
            type="text"
            maxLength={6}
            value={otp}
            onChange={(e)=>setOtp(e.target.value)}
            className="w-full border rounded-lg px-4 py-3"
            placeholder="Enter 6-digit OTP"
            required
          />

          {error && (
            <div className="bg-red-100 text-red-700 rounded p-3 mt-4">
              {error}
            </div>
          )}

          <button
            className="w-full bg-green-700 hover:bg-green-800 text-white py-3 rounded-lg mt-6"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>

        </form>

      </div>

    </div>

  );

}
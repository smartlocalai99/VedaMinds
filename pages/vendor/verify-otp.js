import { useState } from "react";
import { useRouter } from "next/router";

export default function VerifyOTP() {

  const router = useRouter();

  const [otp, setOtp] = useState("");

  const verifyOTP = async () => {

    const mobile = localStorage.getItem("vendorMobile");

    console.log("Mobile from LocalStorage:", mobile);

    const response = await fetch("/api/vendors/verify-otp", {
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

    if (data.success) {

      localStorage.setItem(
        "resetToken",
        data.resetToken
      );

      router.push("/vendor/reset-password");

    } else {

      alert(data.message);

    }

  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white w-[520px] p-10 rounded-3xl shadow-xl">

        <h1 className="text-5xl font-bold text-green-800 text-center">
          VEDA
        </h1>

        <p className="text-center text-gray-500 mt-2">
          Verify OTP
        </p>

        <div className="mt-10">

          <label className="block text-xl mb-2">
            OTP
          </label>

          <input
            value={otp}
            onChange={(e)=>setOtp(e.target.value)}
            className="w-full border rounded-xl p-4 text-xl"
            placeholder="Enter OTP"
          />

        </div>

        <button
          onClick={verifyOTP}
          className="mt-8 w-full bg-green-800 text-white py-4 rounded-xl text-2xl"
        >
          Verify OTP
        </button>

      </div>

    </div>

  );

}
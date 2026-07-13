import { useState } from "react";
import { useRouter } from "next/router";

export default function ForgotPassword() {

  const router = useRouter();

  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const sendOTP = async (e) => {

    e.preventDefault();

    setLoading(true);
    setError("");

    const response = await fetch("/api/agents/forgot-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mobile,
      }),
    });

    const data = await response.json();

    setLoading(false);

    if (data.success) {

      localStorage.setItem("resetMobile", mobile);

      alert("OTP sent successfully.");

      router.push("/agent/verify-otp");

    } else {

      setError(data.message);

    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">

      <div className="bg-white p-8 rounded-xl shadow-xl w-[430px]">

        <h1 className="text-4xl font-bold text-center text-green-800">
          VEDA
        </h1>

        <p className="text-center text-gray-500 mt-2">
          Forgot Password
        </p>

        <form onSubmit={sendOTP} className="mt-8">

          <label className="block mb-2">
            Email
          </label>

          <input
            type="text"
            placeholder="Enter your registered mobile number"
            value={mobile}
            onChange={(e)=>setMobile(e.target.value)}
            className="w-full border rounded-lg px-4 py-3"
            required
          />

          {
            error &&
            <div className="bg-red-100 text-red-600 rounded p-3 mt-4">
              {error}
            </div>
          }

          <button
            className="bg-green-700 hover:bg-green-800 text-white w-full py-3 rounded-lg mt-6"
          >
            {
              loading
              ?
              "Sending OTP..."
              :
              "Send OTP"
            }
          </button>

        </form>

      </div>

    </div>
  );
}
import { useState } from "react";
import { useRouter } from "next/router";

export default function VendorForgotPassword() {

  const router = useRouter();

  const [mobile, setMobile] = useState("");

  const sendOTP = async (e) => {

    e.preventDefault();

    try {

      const response = await fetch("/api/vendors/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mobile,
        }),
      });

      const data = await response.json();

      if (data.success) {

        localStorage.setItem("vendorMobile", mobile);
        console.log("Saved Mobile:", mobile);
console.log(localStorage.getItem("vendorMobile"));

        alert("OTP Sent Successfully");

        router.push("/vendor/verify-otp");

      } else {

        alert(data.message);

      }

    } catch (error) {

      console.log(error);

      alert("Something went wrong.");

    }

  };

  return (

    <div className="min-h-screen bg-gray-100 flex items-center justify-center">

      <div className="bg-white w-[530px] rounded-3xl shadow-xl px-10 py-10">

        <div className="text-center mb-8">

          <h1 className="text-5xl font-bold text-green-800">
            VEDA
          </h1>

          <p className="text-gray-500 text-xl mt-2">
            Vendor Forgot Password
          </p>

        </div>

        <h2 className="text-3xl font-bold text-center mb-8">
          Send OTP
        </h2>

        <form onSubmit={sendOTP}>

          <label className="block text-xl mb-2">
            Mobile Number
          </label>

          <input
            type="text"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            placeholder="Enter Registered Mobile Number"
            className="w-full border border-gray-400 rounded-xl px-5 py-4 text-lg mb-8"
            required
          />

          <button
            type="submit"
            className="w-full bg-green-800 hover:bg-green-900 text-white py-4 rounded-xl text-2xl font-semibold"
          >
            Send OTP
          </button>

        </form>

      </div>

    </div>

  );

}
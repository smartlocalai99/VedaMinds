import { useState } from "react";
import { useRouter } from "next/router";

export default function ResetPassword() {

  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const resetPassword = async (e) => {

    e.preventDefault();

    const token = localStorage.getItem("resetToken");

    const response = await fetch("/api/vendors/reset-password", {

      method: "PUT",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify({
        password,
        confirmPassword,
      }),

    });

    const data = await response.json();

    if (data.success) {

      alert("Password Reset Successfully");

      localStorage.removeItem("resetToken");
      localStorage.removeItem("vendorMobile");

      router.push("/vendor/login");

    } else {

      alert(data.message);

    }

  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white p-10 rounded-xl shadow-lg w-[500px]">

        <h1 className="text-4xl font-bold text-center text-green-800">
          Reset Password
        </h1>

        <form onSubmit={resetPassword} className="mt-8">

          <input
            type="password"
            placeholder="New Password"
            className="w-full border p-3 rounded mb-5"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
          />

          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full border p-3 rounded mb-5"
            value={confirmPassword}
            onChange={(e)=>setConfirmPassword(e.target.value)}
          />

          <button
            className="w-full bg-green-700 text-white py-3 rounded"
          >
            Reset Password
          </button>

        </form>

      </div>

    </div>

  );
}
import { useState } from "react";
import { useRouter } from "next/router";

export default function ChangePassword() {

  const router = useRouter();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const changePassword = async (e) => {

    e.preventDefault();


    console.log("Current:", currentPassword);
console.log("New:", newPassword);
console.log("Confirm:", confirmPassword);
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const token = localStorage.getItem("token");

    const response = await fetch("/api/agents/change-password", {

      method: "PUT",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify({
        currentPassword,
        newPassword,
      }),
    });

    const data = await response.json();

    if (data.success) {

      alert("Password Changed Successfully");

      router.push("/agent/dashboard");

    } else {

      alert(data.message);

    }

  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <form
        onSubmit={changePassword}
        className="bg-white p-8 rounded-xl shadow-md w-96"
      >

        <h1 className="text-3xl font-bold mb-6 text-center">
          Change Password
        </h1>

        <input
          type="password"
          placeholder="Current Password"
          className="border w-full p-3 rounded mb-4"
          value={currentPassword}
          onChange={(e)=>setCurrentPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="New Password"
          className="border w-full p-3 rounded mb-4"
          value={newPassword}
          onChange={(e)=>setNewPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="Confirm Password"
          className="border w-full p-3 rounded mb-6"
          value={confirmPassword}
          onChange={(e)=>setConfirmPassword(e.target.value)}
        />

        <button
          className="w-full bg-green-700 text-white py-3 rounded"
        >
          Change Password
        </button>

      </form>

    </div>

  );

}
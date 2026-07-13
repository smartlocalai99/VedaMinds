import { useState } from "react";
import { useRouter } from "next/router";

export default function VendorChangePassword() {

  const router = useRouter();

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const changePassword = async (e) => {

    e.preventDefault();

    if (form.newPassword !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const token = localStorage.getItem("token");

    const response = await fetch("/api/vendors/change-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });

    const data = await response.json();

    if (data.success) {

      alert("Password Changed Successfully");

      router.push("/vendor/dashboard");

    } else {

      alert(data.message);

    }

  };

  return (

    <div className="min-h-screen bg-gray-100 flex items-center justify-center">

      <div className="bg-white w-[550px] rounded-2xl shadow-lg p-10">

        <h1 className="text-4xl font-bold text-center text-green-800 mb-2">
          VEDA
        </h1>

        <p className="text-center text-gray-500 mb-8">
          Vendor Portal
        </p>

        <h2 className="text-3xl font-bold text-center mb-8">
          Change Password
        </h2>

        <form onSubmit={changePassword}>

          <div className="mb-5">
            <label className="block mb-2">Current Password</label>

            <input
              type="password"
              name="currentPassword"
              value={form.currentPassword}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
              required
            />
          </div>

          <div className="mb-5">
            <label className="block mb-2">New Password</label>

            <input
              type="password"
              name="newPassword"
              value={form.newPassword}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
              required
            />
          </div>

          <div className="mb-8">
            <label className="block mb-2">Confirm Password</label>

            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-800 text-white py-3 rounded-lg text-xl hover:bg-green-900"
          >
            Change Password
          </button>

        </form>

      </div>

    </div>

  );

}
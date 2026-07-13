import { useState } from "react";
import { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Login() {
  const router = useRouter();

const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [showPassword, setShowPassword] = useState(false);
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");


  // 👇 Add this function here
  const login = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
  setError("Email is required.");
  return;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (!emailRegex.test(email)) {
  setError("Please enter a valid email.");
  return;
}

if (!password.trim()) {
  setError("Password is required.");
  return;
}

    setLoading(true);
    setError("");

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();

    setLoading(false);

    if (data.success) {
        localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data.user));

  toast.success("Login Successful ");

  setTimeout(() => {
      router.push("/dashboard");
  }, 2000);
    } else {
      setError(data.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-6">

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-900">VEDA</h1>
          <p className="text-gray-500 mt-2">
            Vendor Management System
          </p>
        </div>

        <h2 className="text-2xl font-bold text-center mb-6">
          Admin Login
        </h2>

        <form onSubmit={login}>

          <div className="mb-4">
            <label className="block mb-2 font-medium">
              Email
            </label>

            <input
  type="email"
  placeholder="admin@gmail.com"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-700"
/>
          </div>

          <div className="mb-6">
            <label className="block mb-2 font-medium">
              Password
            </label>

            <div className="relative">

              <input
  type={showPassword ? "text" : "password"}
  placeholder="********"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  className="w-full border rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-green-700"
/>

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-500"
              >
                {showPassword ? "Hide" : "Show"}
              </button>

            </div>
          </div>

          {error && (
  <div className="mb-4 rounded-lg bg-red-100 border border-red-400 text-red-700 px-4 py-3">
    {error}
  </div>
)}

          <button
  type="submit"
  className="w-full bg-green-900 hover:bg-green-800 text-white py-3 rounded-lg font-semibold"
>
  {loading ? "Logging in..." : "Login"}
</button>

        </form>

      </div>
    </div>
  );
}
import { useState } from "react";
import { useRouter } from "next/router";

export default function VendorLogin() {

  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const login = async (e) => {

    e.preventDefault();

    try {

      const response = await fetch("/api/vendors/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (data.success) {

  localStorage.setItem("token", data.token);

  // Save vendor id
  localStorage.setItem("vendorId", data.vendor.id);

  if (data.mustChangePassword) {
    router.push("/vendor/change-password");
  } else {
    router.push("/vendor/dashboard");
  }

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
            Vendor Portal
          </p>

        </div>

        <h2 className="text-3xl font-bold text-center mb-8">
          Vendor Login
        </h2>

        <form onSubmit={login}>

          <div className="mb-6">

            <label className="block text-xl mb-2">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="vendor@gmail.com"
              className="w-full border border-gray-400 rounded-xl px-5 py-4 text-lg focus:outline-none"
              required
            />

          </div>

          <div className="mb-8">

            <label className="block text-xl mb-2">
              Password
            </label>

            <div className="relative">

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="********"
                className="w-full border border-gray-400 rounded-xl px-5 py-4 text-lg focus:outline-none"
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-4 text-lg text-gray-500"
              >
                {showPassword ? "Hide" : "Show"}
              </button>

            </div>

          </div>

          <button
  type="submit"
  className="w-full bg-green-800 hover:bg-green-900 text-white py-4 rounded-xl text-2xl font-semibold"
>
  Login
</button>

<div className="text-center mt-6">

  <button
    type="button"
    onClick={() => router.push("/vendor/forgot-password")}
    className="text-green-700 text-lg font-semibold hover:underline"
  >
    Forgot Password?
  </button>

</div>

</form>

      </div>

    </div>

  );

}
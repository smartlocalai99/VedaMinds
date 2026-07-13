import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "../../../../components/Layout/Layout";

export default function EditAgent() {
    const router = useRouter();
  const { id } = router.query;

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    alternateMobile: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    status: "ACTIVE",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
  if (id) {
    fetchAgent();
  }
}, [id]);

const fetchAgent = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(`/api/agents/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    console.log("GET Agent:", data);

    if (data.success) {
      setForm({
        firstName: data.data.user.firstName || "",
        lastName: data.data.user.lastName || "",
        email: data.data.user.email || "",
        mobile: data.data.user.mobile || "",
        alternateMobile: data.data.alternateMobile || "",
        address: data.data.address || "",
        city: data.data.city || "",
        state: data.data.state || "",
        pincode: data.data.pincode || "",
        status: data.data.user.status || "ACTIVE",
      });
    }
  } catch (err) {
    console.log(err);
  }
};

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

 
const handleSubmit = async (e) => {
  e.preventDefault();

  setLoading(true);

  const token = localStorage.getItem("token");

  const response = await fetch(`/api/agents/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(form),
  });

  const data = await response.json();

  setLoading(false);

  if (data.success) {
    alert("Agent Updated Successfully");
    router.push("/dashboard/agents");
  } else {
    alert(data.message);
  }
};

  return (
  <Layout>
    <div className="max-w-6xl mx-auto p-8">

      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">

        <h1 className="text-3xl font-bold text-green-900 mb-8">
          Edit Agent
        </h1>

        <form onSubmit={handleSubmit}>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">
  First Name <span className="text-red-500">*</span>
</label>
        
            <input
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-700"
              required
            />
          </div>

          <div className="mb-4">
            <label>Last Name</label>
            <input
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-700"
              required
            />
          </div>

          <div className="mb-4">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-700"
              required
            />
          </div>

          <div className="mb-4">
            <label>Mobile</label>
            <input
              name="mobile"
              value={form.mobile}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-700"
              required
            />
          </div>

          <div className="mb-4">
            <label>Alternate Mobile</label>
            <input
              name="alternateMobile"
              value={form.alternateMobile}
              onChange={handleChange}
             className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-700"
            />
          </div>


          <div className="mb-4">
  <label>Status</label>

  <select
    name="status"
    value={form.status}
    onChange={handleChange}
    className="w-full border rounded-lg px-4 py-3"
  >
    <option value="ACTIVE">ACTIVE</option>
    <option value="INACTIVE">INACTIVE</option>
    <option value="BLOCKED">BLOCKED</option>
  </select>
</div>

          <div className="mb-4">
            <label>City</label>
            <input
              name="city"
              value={form.city}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-700"
            />
          </div>

          <div className="mb-4">
            <label>State</label>
            <input
              name="state"
              value={form.state}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-700"
            />
          </div>

          <div className="mb-4">
            <label>Pincode</label>
            <input
              name="pincode"
              value={form.pincode}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-700"
            />
          </div>

        </div>

        <br />

        <label>Address</label>

        <textarea
rows={4}
name="address"
value={form.address}
onChange={handleChange}
className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-700"
/>

        <br />
        <br />

        <div className="flex justify-end gap-4 mt-8">

  <button
    type="button"
    onClick={() => router.push("/dashboard/agents")}
    className="px-6 py-3 rounded-lg border border-gray-300 hover:bg-gray-100"
  >
    Cancel
  </button>

  <button
    type="submit"
    className="bg-green-900 hover:bg-green-800 text-white px-8 py-3 rounded-lg font-semibold"
  >
    {loading ? "Updating..." : "Update Agent"}
  </button>

</div>

      </form>

      </div>

    </div>

  </Layout>
  );
}
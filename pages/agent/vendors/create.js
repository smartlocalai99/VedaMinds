import { useState } from "react";
import { useRouter } from "next/router";

export default function CreateVendor() {

  const router = useRouter();

  const [form, setForm] = useState({
    ownerName: "",
    shopName: "",
    email: "",
    mobile: "",
    businessType: "",
    gstNumber: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const createVendor = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    const response = await fetch("/api/vendors/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });

    const data = await response.json();

    if (data.success) {
      alert("Vendor Created Successfully");
      router.push("/agent/vendors");
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white shadow rounded-lg p-8">

      <h1 className="text-3xl font-bold mb-8">
        Create Vendor
      </h1>

      <form onSubmit={createVendor} className="grid grid-cols-2 gap-6">

        <input
          name="ownerName"
          placeholder="Owner Name"
          className="border p-3 rounded"
          onChange={handleChange}
        />

        <input
          name="shopName"
          placeholder="Shop Name"
          className="border p-3 rounded"
          onChange={handleChange}
        />

        <input
          name="email"
          placeholder="Email"
          className="border p-3 rounded"
          onChange={handleChange}
        />

        <input
          name="mobile"
          placeholder="Mobile"
          className="border p-3 rounded"
          onChange={handleChange}
        />

        <input
          name="businessType"
          placeholder="Business Type"
          className="border p-3 rounded"
          onChange={handleChange}
        />

        <input
          name="gstNumber"
          placeholder="GST Number"
          className="border p-3 rounded"
          onChange={handleChange}
        />

        <input
          name="address"
          placeholder="Address"
          className="border p-3 rounded col-span-2"
          onChange={handleChange}
        />

        <input
          name="city"
          placeholder="City"
          className="border p-3 rounded"
          onChange={handleChange}
        />

        <input
          name="state"
          placeholder="State"
          className="border p-3 rounded"
          onChange={handleChange}
        />

        <input
          name="pincode"
          placeholder="Pincode"
          className="border p-3 rounded"
          onChange={handleChange}
        />

        <button
          className="bg-green-700 text-white py-3 rounded-lg col-span-2"
        >
          Create Vendor
        </button>

      </form>

    </div>
  );
}
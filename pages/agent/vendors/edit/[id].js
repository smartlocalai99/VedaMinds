import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function EditVendor() {

  const router = useRouter();
  const { id } = router.query;

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

  useEffect(() => {

    if (id) {
      loadVendor();
    }

  }, [id]);

  const loadVendor = async () => {

    const token = localStorage.getItem("token");

    const response = await fetch(`/api/vendors/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (data.success) {

      setForm({
        ownerName: data.vendor.ownerName,
        shopName: data.vendor.shopName,
        email: data.vendor.user.email,
        mobile: data.vendor.user.mobile,
        businessType: data.vendor.businessType || "",
        gstNumber: data.vendor.gstNumber || "",
        address: data.vendor.address || "",
        city: data.vendor.city || "",
        state: data.vendor.state || "",
        pincode: data.vendor.pincode || "",
      });

    }

  };

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

  };

  const updateVendor = async (e) => {

  e.preventDefault();

  const token = localStorage.getItem("token");

  const response = await fetch(`/api/vendors/update/${id}`, {

    method: "PUT",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },

    body: JSON.stringify(form),

  });

  const data = await response.json();

  if (data.success) {

    alert("Vendor Updated Successfully");

    router.push("/agent/vendors");

  } else {

    alert(data.message);

  }

};

  return (

  <div className="max-w-5xl mx-auto mt-10 bg-white shadow rounded-lg p-8">

    <h1 className="text-3xl font-bold mb-8">
      Edit Vendor
    </h1>

    <form
  onSubmit={updateVendor}
  className="grid grid-cols-2 gap-6"
>

      <input
        name="ownerName"
        value={form.ownerName}
        onChange={handleChange}
        placeholder="Owner Name"
        className="border p-3 rounded"
      />

      <input
        name="shopName"
        value={form.shopName}
        onChange={handleChange}
        placeholder="Shop Name"
        className="border p-3 rounded"
      />

      <input
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Email"
        className="border p-3 rounded"
      />

      <input
        name="mobile"
        value={form.mobile}
        onChange={handleChange}
        placeholder="Mobile"
        className="border p-3 rounded"
      />

      <input
        name="businessType"
        value={form.businessType}
        onChange={handleChange}
        placeholder="Business Type"
        className="border p-3 rounded"
      />

      <input
        name="gstNumber"
        value={form.gstNumber}
        onChange={handleChange}
        placeholder="GST Number"
        className="border p-3 rounded"
      />

      <input
        name="address"
        value={form.address}
        onChange={handleChange}
        placeholder="Address"
        className="border p-3 rounded col-span-2"
      />

      <input
        name="city"
        value={form.city}
        onChange={handleChange}
        placeholder="City"
        className="border p-3 rounded"
      />

      <input
        name="state"
        value={form.state}
        onChange={handleChange}
        placeholder="State"
        className="border p-3 rounded"
      />

      <input
        name="pincode"
        value={form.pincode}
        onChange={handleChange}
        placeholder="Pincode"
        className="border p-3 rounded"
      />

      <button
        type="submit"
        className="bg-green-700 text-white py-3 rounded-lg col-span-2"
      >
        Update Vendor
      </button>

    </form>

  </div>

);

}


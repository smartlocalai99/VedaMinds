import Link from "next/link";
import { useEffect, useState } from "react";

export default function Vendors() {

  const [vendors, setVendors] = useState([]);

  const loadVendors = async () => {

    try {

      const token = localStorage.getItem("token");

      const response = await fetch("/api/vendors", {

        headers: {
          Authorization: `Bearer ${token}`,
        },

      });

      const data = await response.json();

      console.log(data);

      if (data.success) {

        setVendors(data.vendors);

      }

    } catch (error) {

      console.log(error);

    }

  };

  const handleDelete = async (id) => {

  const confirmDelete = window.confirm(
    "Are you sure you want to delete this vendor?"
  );

  if (!confirmDelete) return;

  try {

    const token = localStorage.getItem("token");

    const response = await fetch(`/api/vendors/delete/${id}`, {

      method: "DELETE",

      headers: {
        Authorization: `Bearer ${token}`,
      },

    });

    const data = await response.json();

    if (data.success) {

      alert("Vendor Deleted Successfully");

      loadVendors();

    } else {

      alert(data.message);

    }

  } catch (error) {

    console.log(error);

  }

};

  useEffect(() => {

    loadVendors();

  }, []);

  return (
    <div className="p-8">

      <div className="flex justify-between items-center mb-6">

        <h1 className="text-3xl font-bold">
          Vendors
        </h1>

        <Link href="/agent/vendors/create">
          <button className="bg-green-700 text-white px-5 py-2 rounded">
            + Create Vendor
          </button>
        </Link>

      </div>

      <table className="w-full border">

        <thead className="bg-gray-100">

          <tr>
            <th className="border p-3">Vendor Code</th>
            <th className="border p-3">Shop Name</th>
            <th className="border p-3">Owner</th>
            <th className="border p-3">Mobile</th>
            <th className="border p-3">Status</th>
            <th className="border p-3">Actions</th>
          </tr>

        </thead>

        <tbody>

  {vendors.length > 0 ? (

    vendors.map((vendor) => (

      <tr key={vendor.id}>

        <td className="border p-3">{vendor.vendorCode}</td>

        <td className="border p-3">{vendor.shopName}</td>

        <td className="border p-3">{vendor.ownerName}</td>

        <td className="border p-3">{vendor.user.mobile}</td>

        <td className="border p-3">{vendor.status}</td>

        <td className="border p-3">
          <Link href={`/agent/vendors/${vendor.id}`}>
  <button className="text-blue-600 hover:underline">
    View
  </button>
</Link>

{" | "}

<Link href={`/agent/vendors/edit/${vendor.id}`}>
  <button className="text-green-600 hover:underline">
    Edit
  </button>
</Link>

{" | "}

<button
  onClick={() => handleDelete(vendor.id)}
  className="text-red-600"
>
  Delete
</button>
        </td>

      </tr>

    ))

  ) : (

    <tr>

      <td colSpan="6" className="text-center p-6">
        No Vendors Found
      </td>

    </tr>

  )}

</tbody>

      </table>

    </div>
  );
}
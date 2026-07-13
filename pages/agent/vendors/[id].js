import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function VendorDetails() {

  const router = useRouter();
  const { id } = router.query;

  const [vendor, setVendor] = useState(null);

  useEffect(() => {

    if (!id) return;

    loadVendor();

  }, [id]);

  const loadVendor = async () => {

    try {

      const token = localStorage.getItem("token");

      const response = await fetch(`/api/vendors/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setVendor(data.vendor);
      } else {
        alert(data.message);
      }

    } catch (error) {
      console.log(error);
    }

  };

  if (!vendor) {
    return (
      <div className="p-10 text-xl">
        Loading...
      </div>
    );
  }

  return (

    <div className="max-w-5xl mx-auto mt-10 bg-white shadow rounded-lg p-8">

      <h1 className="text-3xl font-bold mb-8">
        Vendor Details
      </h1>

      <div className="grid grid-cols-2 gap-6">

        <div>
          <label className="font-semibold">Vendor Code</label>
          <p>{vendor.vendorCode}</p>
        </div>

        <div>
          <label className="font-semibold">Shop Name</label>
          <p>{vendor.shopName}</p>
        </div>

        <div>
          <label className="font-semibold">Owner Name</label>
          <p>{vendor.ownerName}</p>
        </div>

        <div>
          <label className="font-semibold">Email</label>
          <p>{vendor.user.email}</p>
        </div>

        <div>
          <label className="font-semibold">Mobile</label>
          <p>{vendor.user.mobile}</p>
        </div>

        <div>
          <label className="font-semibold">Business Type</label>
          <p>{vendor.businessType}</p>
        </div>

        <div>
          <label className="font-semibold">GST Number</label>
          <p>{vendor.gstNumber}</p>
        </div>

        <div>
          <label className="font-semibold">Status</label>
          <p>{vendor.status}</p>
        </div>

        <div className="col-span-2">
          <label className="font-semibold">Address</label>
          <p>{vendor.address}</p>
        </div>

        <div>
          <label className="font-semibold">City</label>
          <p>{vendor.city}</p>
        </div>

        <div>
          <label className="font-semibold">State</label>
          <p>{vendor.state}</p>
        </div>

        <div>
          <label className="font-semibold">Pincode</label>
          <p>{vendor.pincode}</p>
        </div>

      </div>

      <button
        onClick={() => router.push("/agent/vendors")}
        className="mt-8 bg-green-700 text-white px-6 py-3 rounded-lg"
      >
        Back
      </button>

    </div>

  );

}
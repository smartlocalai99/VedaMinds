import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function VendorDashboard() {

  const router = useRouter();

  const { vendorId } = router.query;

  const [vendor, setVendor] = useState(null);

  const [dashboard, setDashboard] = useState({
  totalTransactions: 0,
  totalSales: 0,
  totalDiscount: 0,
  totalCustomers: 0,
});


  useEffect(() => {

    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/vendor/login");
      return;
    }

    loadVendor();
   

  }, []);

  const loadVendor = async () => {

    try {

      const token = localStorage.getItem("token");

      const response = await fetch("/api/vendors/dashboard", {

        headers: {
          Authorization: `Bearer ${token}`,
        },

      });

      const data = await response.json();

      if (data.success) {

    setVendor(data.vendor);

    setDashboard(data.dashboard);

}else {

        alert(data.message);

        router.push("/vendor/login");

      }

    } catch (error) {

      console.log(error);

    }

  };

  

  const logout = () => {

    localStorage.removeItem("token");

    router.push("/vendor/login");

  };

  return (

    <div className="min-h-screen bg-gray-100">

      {/* Header */}

      <div className="bg-green-800 text-white p-5 flex justify-between items-center">

        <h1 className="text-3xl font-bold">
          VEDA Vendor Portal
        </h1>

        <button
          onClick={logout}
          className="bg-red-600 px-5 py-2 rounded-lg"
        >
          Logout
        </button>

      </div>

      {/* Content */}

      <div className="p-10">

        <h2 className="text-4xl font-bold mb-2">
          Welcome
          {vendor && `, ${vendor.ownerName}`}
        </h2>

        <p className="text-gray-600 mb-10">
          Vendor Dashboard
        </p>

        <div className="grid grid-cols-3 gap-8">

  <div className="bg-white rounded-xl shadow p-8">
    <h3 className="text-2xl font-bold mb-4">
      Shop Name
    </h3>

    <p className="text-xl">
      {vendor?.shopName}
    </p>
  </div>

  <div className="bg-white rounded-xl shadow p-8">
    <h3 className="text-2xl font-bold mb-4">
      Vendor Code
    </h3>

    <p className="text-xl">
      {vendor?.vendorCode}
    </p>
  </div>

  <div className="bg-white rounded-xl shadow p-8">
    <h3 className="text-2xl font-bold mb-4">
      Status
    </h3>

    <p className="text-xl">
      {vendor?.status}
    </p>
  </div>

</div>

<div className="grid grid-cols-4 gap-6 mt-10">

  <div className="bg-white rounded-xl shadow p-6">
    <h3 className="text-xl font-bold">
      Transactions
    </h3>

    <p className="text-4xl text-green-700 mt-4 font-bold">
      {dashboard?.totalTransactions || 0}
    </p>
  </div>

  <div className="bg-white rounded-xl shadow p-6">
    <h3 className="text-xl font-bold">
      Total Sales
    </h3>

    <p className="text-4xl text-blue-700 mt-4 font-bold">
      ₹{dashboard?.totalSales || 0}
    </p>
  </div>

  <div className="bg-white rounded-xl shadow p-6">
    <h3 className="text-xl font-bold">
      Discount Given
    </h3>

    <p className="text-4xl text-red-600 mt-4 font-bold">
      ₹{dashboard?.totalDiscount || 0}
    </p>
  </div>

  <div className="bg-white rounded-xl shadow p-6">
    <h3 className="text-xl font-bold">
      Customers
    </h3>

    <p className="text-4xl text-purple-700 mt-4 font-bold">
      {dashboard?.totalCustomers || 0}
    </p>
  </div>

</div>

<div className="mt-10 flex gap-5">

  <Link href="/vendor/scan">
    <button className="bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-lg">
      Scan Membership
    </button>
  </Link>

  <Link href="/vendor/transactions">
    <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg">
      View Transactions
    </button>
  </Link>

</div>

      </div>

    </div>

  );

}
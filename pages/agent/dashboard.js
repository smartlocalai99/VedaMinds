import { useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function AgentDashboard() {

  const router = useRouter();

  useEffect(() => {

    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!token) {
      router.replace("/agent/login");
      return;
    }

    if (user.role !== "AGENT") {
      router.replace("/agent/login");
      return;
    }

  }, []);

  const logout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    router.push("/agent/login");

  };

  return (

<div className="min-h-screen bg-gray-100 flex">

{/* Sidebar */}

<div className="w-64 bg-green-900 text-white">

<div className="p-6 text-3xl font-bold">

VEDA

</div>

<hr />

<ul className="mt-6">

<li className="px-6 py-4 hover:bg-green-800 cursor-pointer">

🏠 Dashboard

</li>

<Link href="/agent/vendors">

  <li className="px-6 py-4 hover:bg-green-800 cursor-pointer">

    🏪 Vendors

  </li>

</Link>

<Link href="/agent/memberships">

  <li className="px-6 py-4 hover:bg-green-800 cursor-pointer">

    💳 Memberships

  </li>

</Link>

<li className="px-6 py-4 hover:bg-green-800 cursor-pointer">

👤 Profile

</li>

<li className="px-6 py-4 hover:bg-green-800 cursor-pointer">

⚙ Settings

</li>

</ul>

</div>

{/* Main */}

<div className="flex-1">

{/* Header */}

<div className="bg-white shadow flex justify-between items-center px-8 py-5">

<h1 className="text-3xl font-bold">

Agent Dashboard

</h1>

<button

onClick={logout}

className="bg-red-600 text-white px-5 py-2 rounded-lg"

>

Logout

</button>

</div>

<div className="p-8">

<div className="flex justify-between items-center">

  <div>

    <h2 className="text-2xl font-semibold">
      Welcome Agent
    </h2>

    <p className="text-gray-500 mt-2">
      Manage your vendors and memberships.
    </p>

  </div>

  <Link href="/agent/vendors/create">

    <button className="bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-lg font-semibold">

      + Create Vendor

    </button>

  </Link>

</div>

<div className="grid grid-cols-3 gap-6 mt-10">

<div className="bg-white rounded-xl shadow p-6">

<h3 className="text-xl font-bold">

My Vendors

</h3>

<h1 className="text-5xl mt-4 text-green-800">

0

</h1>

</div>

<div className="bg-white rounded-xl shadow p-6">

<h3 className="text-xl font-bold">

Memberships

</h3>

<h1 className="text-5xl mt-4 text-green-800">

0

</h1>

</div>

<div className="bg-white rounded-xl shadow p-6">

<h3 className="text-xl font-bold">

Today's Sales

</h3>

<h1 className="text-5xl mt-4 text-green-800">

₹0

</h1>

</div>

</div>

</div>

</div>

</div>

);

}
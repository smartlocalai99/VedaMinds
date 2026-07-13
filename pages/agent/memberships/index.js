import { useEffect, useState } from "react";
import Link from "next/link";

export default function Memberships() {

  const [memberships, setMemberships] = useState([]);

  useEffect(() => {
    loadMemberships();
  }, []);

  const loadMemberships = async () => {

    const user = JSON.parse(localStorage.getItem("user"));

    const response = await fetch(
      `/api/memberships?agentId=${user.agentId}`
    );

    const data = await response.json();

    if (data.success) {
      setMemberships(data.memberships);
    }

  };

  return (

    <div className="min-h-screen bg-gray-100 p-8">

      <div className="flex justify-between mb-8">

        <h1 className="text-4xl font-bold">
          Memberships
        </h1>

        <Link href="/agent/memberships/create">

          <button className="bg-green-700 text-white px-6 py-3 rounded-lg">

            + Create Membership

          </button>

        </Link>

      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>

              <th className="p-4">Photo</th>
              <th>Name</th>
              <th>Membership No</th>
              <th>Mobile</th>
              <th>Status</th>
              <th>Action</th>
              
            </tr>

          </thead>

          <tbody>
  {memberships.map((member) => (
    <tr key={member.id} className="border-t">

      <td className="p-3 text-center">
  <div
    style={{
      width: "60px",
      height: "60px",
      overflow: "hidden",
      borderRadius: "50%",
      border: "2px solid green",
      margin: "auto",
    }}
  >
    <img
      src={member.photoUrl || "/avatar.png"}
      alt={member.customerName}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
      }}
    />
  </div>
</td>

      <td className="p-3 font-semibold">
  {member.customerName}
</td>

      <td className="p-3">{member.membershipNumber}</td>

      <td className="p-3">{member.mobile}</td>

      <td className="p-3">
        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
          {member.status}
        </span>
      </td>

      <td className="p-3">
  <Link href={`/agent/memberships/${member.id}`}>
    <button
      style={{
        background: "blue",
        color: "white",
        padding: "10px 20px",
        borderRadius: "6px",
        cursor: "pointer",
      }}
    >
      View
    </button>
  </Link>
</td>

    </tr>
  ))}
</tbody>

        </table>

      </div>

    </div>

  );

}
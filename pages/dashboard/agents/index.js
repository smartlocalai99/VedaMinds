import { useEffect, useState } from "react";
import Layout from "../../../components/Layout/Layout";
import Link from "next/link";

export default function Agents() {
  const [agents, setAgents] = useState([]);

  useEffect(() => {
  loadAgents();
}, []);

const loadAgents = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch("/api/agents", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    console.log("API Response:", data);

    if (data.success) {
      setAgents(data.data);
    }
  } catch (error) {
    console.error(error);
  }
};


const handleDelete = async (id) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this agent?"
  );

  if (!confirmDelete) return;

  try {
    const token = localStorage.getItem("token");

    const response = await fetch(`/api/agents/delete/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (data.success) {
      alert("Agent Deleted Successfully");
      loadAgents();
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error(error);
  }
};

 <tbody>
  {agents.length > 0 ? (
    agents.map((agent) => (
      <tr key={agent.id}>
        <td>{agent.agentCode}</td>

        <td>
          {agent.user.firstName} {agent.user.lastName}
        </td>

        <td>{agent.user.email}</td>

        <td>{agent.user.mobile}</td>

        <td>{agent.user.status}</td>

        <td>
          <button>Edit</button>

          <button>Delete</button>
        </td>
      </tr>
    ))
  ) : (
    <tr className="border-b hover:bg-gray-50">
      <td colSpan="6" style={{ textAlign: "center" }}>
        No Agents Found
      </td>
    </tr>
  )}
</tbody>

  return (
    <Layout>
  <div className="max-w-7xl mx-auto">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <h1>Agents</h1>

        <Link href="/dashboard/agents/create">
          <button
            style={{
              background: "#0E3B2E",
              color: "#fff",
              padding: "10px 18px",
              border: "none",
              borderRadius: 5,
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            + Create Agent
          </button>
        </Link>
      </div>

      <table
        width="100%"
        border="1"
        cellPadding="10"
        style={{
          borderCollapse: "collapse",
          background: "#fff",
        }}
      >
        <thead className="bg-gray-100">
          <tr className="border-b hover:bg-gray-50">
            <th>Agent Code</th>
            <th>Name</th>
            <th>Email</th>
            <th>Mobile</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {agents.length > 0 ? (
            agents.map((agent) => (
              <tr key={agent.id}>
                <td>{agent.agentCode}</td>

                <td>
                  {agent.user.firstName} {agent.user.lastName}
                </td>

                <td>{agent.user.email}</td>

                <td>{agent.user.mobile}</td>

                <td>{agent.user.status}</td>

<td className="space-x-2">
  <Link href={`/dashboard/agents/edit/${agent.id}`}>
    <button className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg">
      ✏️ Edit
    </button>
  </Link>

  <button
    onClick={() => handleDelete(agent.id)}
    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
  >
    🗑 Delete
  </button>
</td>
              </tr>
            ))
          ) : (
            <tr className="border-b hover:bg-gray-50">
              <td colSpan="6" align="center">
                No Agents Found
              </td>
            </tr>
          )}
        </tbody>
      </table>
      </div>
    </Layout>
  );
}
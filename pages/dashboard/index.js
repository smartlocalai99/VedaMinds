import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "../../components/Layout/Layout";

export default function Dashboard() {
  const router = useRouter();

  const [counts, setCounts] = useState({
  agents: 0,
  vendors: 0,
  memberships: 0,
});

  useEffect(() => {
  const token = localStorage.getItem("token");

  if (!token) {
    router.replace("/login");
    return;
  }

  loadDashboard();
}, [router]);

const loadDashboard = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch("/api/dashboard", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (data.success) {
      setCounts(data.data);
    }
  } catch (error) {
    console.error(error);
  }
};

  return (
    <Layout>
      <h1>Dashboard</h1>

      <br />

      <h3>Welcome Super Admin</h3>

      <br />

      <div
        style={{
          display: "flex",
          gap: 20,
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            background: "#fff",
            padding: 30,
            width: 220,
            boxShadow: "0 0 8px #ddd",
            borderRadius: 10,
          }}
        >
          <h2>Agents</h2>
          <h1>{counts.agents}</h1>
        </div>

        <div
          style={{
            background: "#fff",
            padding: 30,
            width: 220,
            boxShadow: "0 0 8px #ddd",
            borderRadius: 10,
          }}
        >
          <h2>Vendors</h2>
          <h1>{counts.vendors}</h1>
        </div>

        <div
          style={{
            background: "#fff",
            padding: 30,
            width: 220,
            boxShadow: "0 0 8px #ddd",
            borderRadius: 10,
          }}
        >
          <h2>Memberships</h2>
          <h1>{counts.memberships}</h1>
        </div>
      </div>
    </Layout>
  );
}
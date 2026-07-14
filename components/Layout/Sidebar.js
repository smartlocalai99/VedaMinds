import Link from "next/link";
import { useRouter } from "next/router";

export default function Sidebar() {

  const router = useRouter();

  const menus = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Agents", path: "/dashboard/agents" },
    { name: "Vendors", path: "/dashboard/vendors" },
    { name: "Memberships", path: "/dashboard/memberships" },
    { name: "Transactions", path: "/dashboard/transactions" },
    { name: "Reports", path: "/dashboard/reports" },
    { name: "Settings", path: "/dashboard/settings" },
  ];

  return (
    <div
      style={{
        width: 250,
        background: "#0E3B2E",
        color: "#fff",
        minHeight: "100vh",
        padding: 20,
      }}
    >
      <h2>VEDA</h2>

      <hr />

      {menus.map((menu) => (
        <div
          key={menu.path}
          style={{
            margin: "18px 0",
            fontWeight:
              router.pathname === menu.path ? "bold" : "normal",
          }}
        >
          <Link
            href={menu.path}
            style={{ color: "#fff", textDecoration: "none" }}
          >
            {menu.name}
          </Link>
        </div>
      ))}
    </div>
  );
}
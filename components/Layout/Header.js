import { useRouter } from "next/router";

export default function Header() {

  const router = useRouter();

  const handleLogout = () => {

    // Remove stored data
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    sessionStorage.clear();

    alert("Logout Successful");

    router.replace("/login");
  };

  return (
    <div
      style={{
        height: 70,
        background: "#fff",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 25px",
        borderBottom: "1px solid #ddd",
      }}
    >
      <h2>Super Admin Dashboard</h2>

      <button
        onClick={handleLogout}
        style={{
          background: "#0E3B2E",
          color: "#fff",
          border: "none",
          padding: "12px 22px",
          borderRadius: 6,
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        Logout
      </button>
    </div>
  );
}
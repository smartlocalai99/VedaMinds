import Sidebar from "./Sidebar";
import Header from "./Header";

export default function Layout({ children }) {

  return (

    <div style={{ display: "flex" }}>

      <Sidebar />

      <div style={{ flex: 1 }}>

        <Header />

        <div style={{ padding: 25 }}>

          {children}

        </div>

      </div>

    </div>

  );

}
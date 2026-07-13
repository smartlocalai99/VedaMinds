import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import MembershipCard from "@/components/Layout/MembershipCard";

export default function MembershipDetails() {
  const router = useRouter();
  const { id } = router.query;

  const [member, setMember] = useState(null);

  useEffect(() => {
    if (id) {
      loadMembership();
    }
  }, [id]);

  const loadMembership = async () => {
    const response = await fetch(`/api/memberships/${id}`);
    const data = await response.json();

    if (data.success) {
      setMember(data.membership);
    }
  };

  const downloadCard = async () => {
    try {
      const node = document.getElementById("membership-card");

      if (!node) return;

      const dataUrl = await toPng(node, {
        cacheBust: true,
        pixelRatio: 3,
        backgroundColor: "#ffffff",
      });

      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: [54, 86], // ID Card Size
      });

      pdf.addImage(dataUrl, "PNG", 0, 0, 86, 54);

      pdf.save(`${member.membershipNumber}.pdf`);
    } catch (err) {
      console.error(err);
      alert("Unable to download card.");
    }
  };

  if (!member) {
    return (
      <div className="min-h-screen flex justify-center items-center text-2xl">
        Loading...
      </div>
    );
  }

  return (
  <div className="min-h-screen bg-gray-100 p-8">

    <div className="max-w-6xl mx-auto">

      <div className="flex justify-between items-center mb-6">

        <h1 className="text-4xl font-bold">
          Membership Details
        </h1>

        <Link href="/agent/memberships">
          <button className="bg-gray-700 text-white px-5 py-2 rounded-lg hover:bg-gray-800">
            ← Back
          </button>
        </Link>

      </div>

      <MembershipCard member={member} />

      <div className="flex gap-4 mt-6">
        <button
          onClick={downloadCard}
          className="bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-lg"
        >
          Download Card
        </button>

        <button className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-lg">
          Print Card
        </button>

        <Link href={`/agent/memberships/edit/${member.id}`}>
  <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg">
    Edit
  </button>
</Link>
      </div>

    </div>

  </div>
);
}
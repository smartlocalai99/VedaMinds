import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function VerifyMembership() {
  const router = useRouter();
  const { membershipNumber, vendorId } = router.query;

  const [member, setMember] = useState(null);

  const [billAmount, setBillAmount] = useState("");
  const [paymentMode, setPaymentMode] = useState("CASH");

  useEffect(() => {
    if (membershipNumber) {
      loadMember();
    }
  }, [membershipNumber]);

  async function loadMember() {
    const res = await fetch(
  `/api/memberships/verify/${membershipNumber}`,
  {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  }
);

    const data = await res.json();

    if (data.success) {

  setMember(data.membership);

} else {

  alert(data.message);

  router.push("/vendor/scan");

}
  }

  if (!member)
    return (
      <h1 className="text-center mt-20 text-2xl">
        Loading...
      </h1>
    );

      const discountAmount =
  (Number(billAmount || 0) * member.discountPercentage) / 100;

  const finalAmount =
  Number(billAmount || 0) - discountAmount;

async function completePurchase() {

  if (!billAmount || Number(billAmount) <= 0) {
    alert("Enter Bill Amount");
    return;
  }

  const response = await fetch("/api/purchases/create", {

    method: "POST",

    headers: {
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
},

    body: JSON.stringify({

  membershipId: member.id,

  billAmount: Number(billAmount),

  discountPercentage: member.discountPercentage,

  discountAmount,

  finalAmount,

  paymentMode,

}),

  });

  const data = await response.json();

  if (data.success) {

    alert("Purchase Completed Successfully");

  } else {

    alert(data.message);

  }

}

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">

      <div className="bg-white p-10 rounded-xl shadow-lg w-[500px]">

        <img
          src={member.photoUrl}
          className="w-36 h-36 rounded-full mx-auto"
        />

        <h1 className="text-3xl font-bold mt-5 text-center">
          {member.customerName}
        </h1>

        <p className="mt-3">
          Membership :
          <b>{member.membershipNumber}</b>
        </p>

        <p>
          Mobile :
          <b>{member.mobile}</b>
        </p>

        <p>
          Discount :
          <b>{member.discountPercentage}%</b>
        </p>

        <p>
          Status :
          <b>{member.status}</b>
        </p>

        <hr className="my-6" />

<h2 className="text-2xl font-bold mb-4">
  Purchase Details
</h2>

<div className="space-y-4">

  <input
  type="number"
  placeholder="Bill Amount"
  value={billAmount}
  onChange={(e) => setBillAmount(e.target.value)}
  className="w-full border p-3 rounded-lg"
/>

  <select
  value={paymentMode}
  onChange={(e) => setPaymentMode(e.target.value)}
  className="w-full border p-3 rounded-lg"
>
  <option value="CASH">Cash</option>
  <option value="UPI">UPI</option>
  <option value="CARD">Card</option>
</select>

  <div className="bg-gray-100 rounded-lg p-4">

  <p className="flex justify-between">
    <span>Bill Amount</span>
    <b>₹ {billAmount || 0}</b>
  </p>

  <p className="flex justify-between mt-2">
    <span>Discount ({member.discountPercentage}%)</span>
    <b>₹ {discountAmount.toFixed(2)}</b>
  </p>

  <p className="flex justify-between mt-2 text-xl text-green-700">
    <span>Final Amount</span>
    <b>₹ {finalAmount.toFixed(2)}</b>
  </p>

</div>

  <button
onClick={completePurchase}
className="bg-green-600 text-white w-full py-3 rounded-lg"
>
Complete Purchase
</button>

</div>

      </div>

    </div>
  );
}


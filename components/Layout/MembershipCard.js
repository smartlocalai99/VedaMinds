import QRCode from "qrcode";


import { useEffect, useState } from "react";

export default function MembershipCard({ member }) {

  const [qr, setQr] = useState("");

  useEffect(() => {

    generateQR();

  }, []);

  const generateQR = async () => {

    const image = await QRCode.toDataURL(
  `http://localhost:3000/verify/${member.membershipNumber}`
);

    setQr(image);

  };

  return (

    <div
      id="membership-card"
      className="w-[820px] h-[500px] rounded-3xl overflow-hidden shadow-2xl relative bg-gradient-to-r from-green-900 via-green-700 to-green-500 text-white"
    >

      {/* Header */}

      <div className="flex justify-between px-10 pt-8">

        <div>

          <h1 className="text-4xl font-bold">
            VEDA
          </h1>

          <p className="text-green-100">
            Smart Membership Card
          </p>

        </div>

        <div>

          <div className="bg-white text-green-700 px-5 py-2 rounded-full font-bold">

            {member.status}

          </div>

        </div>

      </div>

      {/* Body */}

      <div className="flex justify-between mt-12 px-10">

        <div>

          <img
            src={member.photoUrl}
            className="w-40 h-40 rounded-full border-4 border-white object-cover"
          />

          <h2 className="text-3xl font-bold mt-5">

            {member.customerName}

          </h2>

          <p>

            {member.membershipNumber}

          </p>

        </div>

        <div className="space-y-3 text-lg">

          <p>

            <b>Mobile :</b> {member.mobile}

          </p>

          <p>

            <b>Email :</b> {member.email}

          </p>

          <p>

            <b>Discount :</b> {member.discountPercentage}%

          </p>

          <p>

            <b>Valid :</b>

            {" "}

            {new Date(member.expiryDate).toLocaleDateString("en-GB")}

          </p>

        </div>

      </div>

      {/* Footer */}

      <div className="absolute bottom-8 right-8">

        {qr && (

          <img

            src={qr}

            className="w-36 h-36 bg-white p-2 rounded-xl"

          />

        )}

      </div>

    </div>

  );

}
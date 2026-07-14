import { useState } from "react";

export default function CreateMembership() {

  const [form, setForm] = useState({
    customerName: "",
    mobile: "",
    email: "",
    gender: "",
    discountPercentage: 10,
    startDate: "",
    expiryDate: ""
  });


  const [photo, setPhoto] = useState(null);
  
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

const saveMembership = async (e) => {

  e.preventDefault();

  try {

    let photoUrl = "";

    if (photo) {

      const imageData = new FormData();

      imageData.append("photo", photo);

      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: imageData,
      });

      const upload = await uploadResponse.json();

      photoUrl = upload.photoUrl;
    }

    const user = JSON.parse(localStorage.getItem("user"));

    const response = await fetch("/api/memberships/create", {

      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({

        ...form,

        photoUrl,

        agentId: user.agentId,

      }),

    });

    const data = await response.json();

    if (data.success) {

      alert("Membership Created Successfully");

      window.location.href = "/agent/memberships";

    } else {

      alert(data.message);

    }

  } catch (error) {

    console.log(error);

    alert("Something went wrong");

  }

};

  return (

    <div className="min-h-screen bg-gray-100 p-10">

      <div className="bg-white rounded-xl shadow p-8 max-w-4xl mx-auto">

        <h1 className="text-3xl font-bold mb-8">
          Create Membership
        </h1>

        <form
          onSubmit={saveMembership}
          className="grid grid-cols-2 gap-6"
        >

          <div>
            <label className="font-semibold">
              Customer Name
            </label>

            <input
              type="text"
              name="customerName"
              value={form.customerName}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 mt-2"
              required
            />
          </div>

          <div>
            <label className="font-semibold">
              Mobile
            </label>

            <input
              type="text"
              name="mobile"
              value={form.mobile}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 mt-2"
              required
            />
          </div>

          <div>
            <label className="font-semibold">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 mt-2"
            />
          </div>

          <div>
  <label className="font-semibold">
    Customer Photo
  </label>

  <input
    type="file"
    accept="image/*"
    onChange={(e) => setPhoto(e.target.files[0])}
    className="w-full border rounded-lg p-3 mt-2"
  />
</div>

          <div>
            <label className="font-semibold">
              Gender
            </label>

            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 mt-2"
            >
              <option value="">Select</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <div>
            <label className="font-semibold">
              Discount %
            </label>

            <input
              type="number"
              name="discountPercentage"
              value={form.discountPercentage}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 mt-2"
            />
          </div>

          <div>
            <label className="font-semibold">
              Start Date
            </label>

            <input
              type="date"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 mt-2"
              required
            />
          </div>

          <div>
            <label className="font-semibold">
              Expiry Date
            </label>

            <input
              type="date"
              name="expiryDate"
              value={form.expiryDate}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 mt-2"
              required
            />
          </div>

          <div className="col-span-2 mt-6">

            <button
              className="bg-green-700 hover:bg-green-800 text-white px-8 py-3 rounded-lg"
            >
              Save Membership
            </button>

          </div>

        </form>

      </div>

    </div>

  );

}
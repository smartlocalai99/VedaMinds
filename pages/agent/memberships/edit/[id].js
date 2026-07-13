import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function EditMembership() {
  const router = useRouter();
  const { id } = router.query;

  const [member, setMember] = useState({
    customerName: "",
    mobile: "",
    email: "",
    gender: "",
    discountPercentage: "",
    status: "",
    photoUrl: "",
  });

  const [photo, setPhoto] = useState(null);

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

  const updateMembership = async () => {
  try {
    let photoUrl = member.photoUrl;

    // Upload new photo if selected
    if (photo) {
      const formData = new FormData();
      formData.append("photo", photo);

      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadResponse.json();

      if (uploadData.success) {
        photoUrl = uploadData.photoUrl;
      } else {
        alert("Photo upload failed.");
        return;
      }
    }

    const response = await fetch(`/api/memberships/update/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...member,
        photoUrl,
      }),
    });

    const data = await response.json();

    if (data.success) {
      alert("Membership Updated Successfully");
      router.push(`/agent/memberships/${id}`);
    } else {
      alert(data.message);
    }

  } catch (error) {
    console.error(error);
    alert("Something went wrong.");
  }
};

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8">

        <h1 className="text-3xl font-bold mb-8">
          Edit Membership
        </h1>

        {/* Customer Name */}

        <div className="mb-5">
          <label className="font-semibold block mb-2">
            Customer Name
          </label>

          <input
            type="text"
            value={member.customerName}
            onChange={(e) =>
              setMember({
                ...member,
                customerName: e.target.value,
              })
            }
            className="w-full border rounded-lg p-3"
          />
        </div>

        {/* Mobile */}

        <div className="mb-5">
          <label className="font-semibold block mb-2">
            Mobile
          </label>

          <input
            type="text"
            value={member.mobile}
            onChange={(e) =>
              setMember({
                ...member,
                mobile: e.target.value,
              })
            }
            className="w-full border rounded-lg p-3"
          />
        </div>

        {/* Email */}

        <div className="mb-5">
          <label className="font-semibold block mb-2">
            Email
          </label>

          <input
            type="email"
            value={member.email || ""}
            onChange={(e) =>
              setMember({
                ...member,
                email: e.target.value,
              })
            }
            className="w-full border rounded-lg p-3"
          />
        </div>

        <div className="mb-5">
  <label className="font-semibold block mb-2">
    Gender
  </label>

  <select
    value={member.gender || ""}
    onChange={(e) =>
      setMember({
        ...member,
        gender: e.target.value,
      })
    }
    className="w-full border rounded-lg p-3"
  >
    <option value="">Select Gender</option>
    <option value="MALE">Male</option>
    <option value="FEMALE">Female</option>
    <option value="OTHER">Other</option>
  </select>
</div>

<div className="mb-5">
  <label className="font-semibold block mb-2">
    Discount (%)
  </label>

  <input
    type="number"
    value={member.discountPercentage}
    onChange={(e) =>
      setMember({
        ...member,
        discountPercentage: e.target.value,
      })
    }
    className="w-full border rounded-lg p-3"
  />
</div>


<div className="mb-5">
  <label className="font-semibold block mb-2">
    Status
  </label>

  <select
    value={member.status}
    onChange={(e) =>
      setMember({
        ...member,
        status: e.target.value,
      })
    }
    className="w-full border rounded-lg p-3"
  >
    <option value="ACTIVE">ACTIVE</option>
    <option value="BLOCKED">BLOCKED</option>
    <option value="EXPIRED">EXPIRED</option>
  </select>
</div>

<div className="mb-5">

  <label className="font-semibold block mb-2">
    Current Photo
  </label>

  <img
    src={member.photoUrl}
    className="w-32 h-32 rounded-full border object-cover mb-4"
  />

  <label className="font-semibold block mb-2">
    Change Photo
  </label>

  <input
    type="file"
    accept="image/*"
    onChange={(e) => setPhoto(e.target.files[0])}
    className="w-full border rounded-lg p-2"
  />

</div>

<div className="mt-8 flex gap-4">

  <button
    onClick={updateMembership}
    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg"
  >
    Save Changes
  </button>

  <button
    onClick={() => router.back()}
    className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg"
  >
    Cancel
  </button>

</div>

</div>
</div>
);
}
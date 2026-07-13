import { useState } from "react";
import { useRouter } from "next/router";

export default function ResetPassword() {

  const router = useRouter();

  const [password,setPassword]=useState("");
  const [confirmPassword,setConfirmPassword]=useState("");
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState("");

  const resetPassword=async(e)=>{

    e.preventDefault();

    setLoading(true);

    setError("");

    const token=localStorage.getItem("resetToken");

    const response=await fetch("/api/agents/reset-password",{

      method:"PUT",

      headers:{
        "Content-Type":"application/json",
        Authorization:`Bearer ${token}`
      },

      body:JSON.stringify({

        password,
        confirmPassword

      })

    });

    const data=await response.json();

    setLoading(false);

    if(data.success){

      localStorage.removeItem("resetToken");
      localStorage.removeItem("resetMobile");

      alert("Password Changed Successfully");

      router.push("/agent/login");

    }else{

      setError(data.message);

    }

  };

  return(

<div className="min-h-screen flex justify-center items-center bg-gray-100">

<div className="bg-white shadow-xl rounded-xl p-8 w-[430px]">

<h1 className="text-3xl font-bold text-center text-green-800">

Reset Password

</h1>

<form onSubmit={resetPassword} className="mt-8">

<input

type="password"

placeholder="New Password"

className="w-full border rounded-lg p-3 mb-5"

value={password}

onChange={(e)=>setPassword(e.target.value)}

/>

<input

type="password"

placeholder="Confirm Password"

className="w-full border rounded-lg p-3 mb-5"

value={confirmPassword}

onChange={(e)=>setConfirmPassword(e.target.value)}

/>

{

error &&

<div className="bg-red-100 text-red-600 p-3 rounded-lg mb-5">

{error}

</div>

}

<button

className="w-full bg-green-700 hover:bg-green-800 text-white rounded-lg py-3"

>

{

loading

?

"Updating..."

:

"Reset Password"

}

</button>

</form>

</div>

</div>

);

}
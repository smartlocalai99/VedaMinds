import { useState } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AgentLogin() {

  const router = useRouter();

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [showPassword,setShowPassword] = useState(false);
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState("");

  const login = async(e)=>{

    e.preventDefault();

    setLoading(true);
    setError("");

    const response = await fetch("/api/agents/login", {

      method:"POST",

      headers:{
        "Content-Type":"application/json"
      },

      body:JSON.stringify({

        email,
        password

      })

    });

    const data = await response.json();

    setLoading(false);

    if (data.success) {

  if (data.user.role !== "AGENT") {
    setError("Only Agents can login.");
    return;
  }

  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data.user));

  toast.success("Agent Login Successful");

  setTimeout(() => {

    if (data.user.mustChangePassword) {
      router.push("/agent/change-password");
    } else {
      router.push("/agent/dashboard");
    }

  }, 1500);

} else {

  setError(data.message);

}

  };

  return(

<div className="min-h-screen bg-gray-100 flex justify-center items-center">

<div className="bg-white shadow-xl rounded-xl w-[420px] p-8">

<div className="text-center">

<h1 className="text-4xl font-bold text-green-900">
VEDA
</h1>

<p className="text-gray-500 mt-2">
Agent Portal
</p>

</div>

<h2 className="text-3xl font-bold text-center mt-8 mb-8">
Agent Login
</h2>

<form onSubmit={login}>

<div className="mb-5">

<label>Email</label>

<input

type="email"

className="w-full border rounded-lg px-4 py-3 mt-2"

value={email}

onChange={(e)=>setEmail(e.target.value)}

/>

</div>

<div className="mb-5">

<label>Password</label>

<div className="relative">

<input

type={showPassword ? "text":"password"}

className="w-full border rounded-lg px-4 py-3"

value={password}

onChange={(e)=>setPassword(e.target.value)}

/>

<button

type="button"

className="absolute right-4 top-3"

onClick={()=>setShowPassword(!showPassword)}

>

{showPassword ? "Hide":"Show"}

</button>

</div>

</div>

{

error &&

<div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4">

{error}

</div>

}

<button

className="bg-green-900 hover:bg-green-800 text-white rounded-lg w-full py-3"

>

{

loading

?

"Logging..."

:

"Login"

}

</button>

<div className="text-center mt-5">

  <button
    type="button"
    onClick={() => router.push("/agent/forgot-password")}
    className="text-green-700 hover:text-green-900 hover:underline font-medium"
  >
    Forgot Password?
  </button>

</div>

</form>

</div>

</div>

);

}
import React, { useState } from "react";
import { FaUser } from "react-icons/fa";
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeOff } from "react-icons/hi";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";

function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();

    const payload = { name, email, password };

    try {
      const res = await fetch("/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const contentType = res.headers.get("content-type");
      const data = contentType?.includes("application/json") ? await res.json() : await res.text();

      if (res.ok) {
        alert("Signup successful!");
        navigate("/login");
      } else {
        alert(data.message || data.error || "Signup failed");
      }
    } catch (err) {
      alert("Something went wrong while signing up.");
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const token = await user.getIdToken();

      localStorage.setItem("token", token);
      navigate("/dashboard");
    } catch (error) {
      alert("Google sign-in failed.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black">
      <div className="flex flex-col md:flex-row bg-[#1f1f1f] rounded-3xl shadow-xl p-10 md:w-[800px] w-[90%]">
        <div className="md:w-1/2 hidden md:flex items-center justify-center border-r border-gray-800"></div>

        <div className="md:w-1/2 w-full text-white px-4">
          <h2 className="text-3xl font-semibold mb-2 text-center">Sign Up</h2>
          <p className="text-sm text-gray-400 mb-6 text-center">Let’s get started! Please enter your details.</p>

          <form className="space-y-4" onSubmit={handleSignup}>
            <div className="relative">
              <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 py-3 rounded-xl bg-black border border-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="relative">
              <HiOutlineMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 py-3 rounded-xl bg-black border border-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="relative">
              <HiOutlineLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-3 rounded-xl bg-black border border-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <span
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer text-xl"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <HiOutlineEyeOff /> : <HiOutlineEye />}
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 transition-all rounded-xl font-medium"
            >
              Sign Up
            </button>
          </form>

          <div className="flex items-center my-6">
            <hr className="flex-grow border-gray-700" />
            <span className="mx-4 text-sm text-gray-400">OR</span>
            <hr className="flex-grow border-gray-700" />
          </div>

          <button
            onClick={handleGoogleSignup}
            className="w-full flex items-center justify-center gap-2 py-3 bg-black border border-gray-600 rounded-xl text-white hover:bg-gray-900 transition"
          >
            <FcGoogle className="text-xl" />
            Sign up with Google
          </button>

          <p className="mt-6 text-center text-gray-400 text-sm">
            Already have an account?{" "}
            <a href="/login" className="text-white font-medium hover:underline">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;

import React, { useState, useEffect } from "react";
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeOff } from "react-icons/hi";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import { auth, provider } from "../firebase"; 
import { signInWithPopup, onAuthStateChanged, sendPasswordResetEmail } from "firebase/auth";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false); // State to toggle forgot password view
  const [resetEmail, setResetEmail] = useState(""); // State to store email for reset
  const [emailFocus, setEmailFocus] = useState(false); // Track if email input is focused
  const [passwordFocus, setPasswordFocus] = useState(false); // Track if password input is focused

  useEffect(() => {
    // Firebase authentication state change listener
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setEmail(user.email); // Automatically set email if a user is logged in
      }
    });

    return () => unsubscribe(); // Clean up the listener
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        navigate("/dashboard");
      } else {
        setErrorMsg(data.message || "Login failed");
      }
    } catch (err) {
      setErrorMsg("An error occurred. Try again later.");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      navigate("/dashboard"); // Redirect after successful login
      setEmail(user.email); // Set the email of the logged-in user
    } catch (error) {
      setErrorMsg("Google sign-in failed.");
    }
  };

  // Handle Forgot Password form submission
  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (!resetEmail) {
      setErrorMsg("Please enter your email address.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setErrorMsg(""); // Clear error message
      alert("Password reset email sent! Please check your inbox.");
      setIsForgotPassword(false); // Close forgot password view
    } catch (error) {
      setErrorMsg("Failed to send reset email. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black">
      <div className="flex flex-col md:flex-row bg-[#1f1f1f] rounded-3xl shadow-xl p-10 md:w-[800px] w-[90%]">
        <div className="md:w-1/2 hidden md:flex items-center justify-center"></div>

        <div className="md:w-1/2 w-full text-white px-4">
          <h2 className="text-3xl font-semibold mb-2 text-center">{isForgotPassword ? "Forgot Password" : "Sign In"}</h2>
          <p className="text-sm text-gray-400 mb-6 text-center">
            {isForgotPassword ? "Enter your email to reset your password." : "Welcome back! Please enter your details."}
          </p>

          {errorMsg && (
            <div className="mb-4 text-red-500 text-sm text-center">{errorMsg}</div>
          )}

          {/* Conditional rendering for Forgot Password */}
          {isForgotPassword ? (
            <form onSubmit={handlePasswordReset} className="space-y-4">
              <div className="relative">
                <HiOutlineMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="w-full pl-10 py-3 rounded-xl bg-black border border-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 transition-all rounded-xl font-medium"
              >
                Send Reset Link
              </button>
              <div className="text-center mt-4">
                <button
                  onClick={() => setIsForgotPassword(false)}
                  className="text-sm text-blue-500 hover:underline"
                >
                  Back to Sign In
                </button>
              </div>
            </form>
          ) : (
            <form
              className="space-y-4"
              onSubmit={handleLogin}
              autoComplete="off"
            >
              <div className="relative">
                <HiOutlineMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setEmailFocus(true)}  // Handle focus
                  onBlur={() => setEmailFocus(false)}  // Handle blur
                  className="w-full pl-10 py-3 rounded-xl bg-black border border-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoComplete="off"
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
                  onFocus={() => setPasswordFocus(true)} // Handle focus
                  onBlur={() => setPasswordFocus(false)} // Handle blur
                  className="w-full pl-10 pr-10 py-3 rounded-xl bg-black border border-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoComplete="off"
                  required
                />
                <span
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer text-xl"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <HiOutlineEyeOff /> : <HiOutlineEye />}
                </span>
              </div>

              <div className="flex justify-between text-sm text-gray-400">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="accent-blue-500" />
                  Remember me
                </label>
                <a
                  href="#"
                  onClick={() => setIsForgotPassword(true)} // Set to forgot password
                  className="hover:underline"
                >
                  Forgot Password?
                </a>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 transition-all rounded-xl font-medium"
              >
                Sign In
              </button>
            </form>
          )}

          <div className="flex items-center my-6">
            <hr className="flex-grow border-gray-700" />
            <span className="mx-4 text-sm text-gray-400">OR</span>
            <hr className="flex-grow border-gray-700" />
          </div>

          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-2 py-3 bg-black border border-gray-600 rounded-xl text-white hover:bg-gray-900 transition"
          >
            <FcGoogle className="text-xl" />
            Sign in with Google
          </button>

          <p className="mt-6 text-center text-gray-400 text-sm">
            Don’t have an account?{" "}
            <a href="/signup" className="text-white font-medium hover:underline">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;

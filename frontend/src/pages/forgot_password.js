import React, { useState } from "react";
import { HiOutlineLockClosed, HiOutlineMail } from "react-icons/hi";
import { getAuth, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { useNavigate } from "react-router-dom";  

function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const navigate = useNavigate(); 

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      setErrorMsg("User not logged in.");
      return;
    }

    const credential = EmailAuthProvider.credential(user.email, currentPassword);

    try {
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);

      setSuccessMsg("Password updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setErrorMsg(""); 
      setTimeout(() => {
        navigate("/login"); 
      }, 2000);  

    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;

      setErrorMsg(errorMessage || "Failed to update password.");
      setSuccessMsg("");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black">
      <div className="flex flex-col md:flex-row bg-[#1f1f1f] rounded-3xl shadow-xl p-10 md:w-[800px] w-[90%]">
        <div className="md:w-1/2 hidden md:flex items-center justify-center"></div>

        <div className="md:w-1/2 w-full text-white px-4">
          <h2 className="text-3xl font-semibold mb-2 text-center">Change Password</h2>
          <p className="text-sm text-gray-400 mb-6 text-center">Enter your current password and new password.</p>

          {/* Show error message if there's any */}
          {errorMsg && <div className="mb-4 text-red-500 text-sm text-center">{errorMsg}</div>}

          {/* Show success message after updating password */}
          {successMsg && <div className="mb-4 text-green-500 text-sm text-center">{successMsg}</div>}

          {/* Change password form */}
          <form onSubmit={handlePasswordChange}>
            <div className="relative">
              <HiOutlineMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
              <input
                type="password"
                placeholder="Current Password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full py-3 rounded-xl bg-black border border-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="relative mt-4">
              <HiOutlineLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full py-3 rounded-xl bg-black border border-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 transition-all rounded-xl font-medium mt-6"
            >
              Change Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ChangePassword;

import React from "react";
import "./../styles/login.css";
import { useNavigate } from "react-router-dom";
import { FaLock, FaEnvelope } from "react-icons/fa";

const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();

    // Simulate password reset success
    alert("Password reset link sent successfully!");
    navigate("/"); // Redirect to login page after reset
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="left-panel"></div>
        <div className="right-panel">
          <h2>Reset Password</h2>
          <p>Enter your email to reset your password</p>

          <form onSubmit={handleResetPassword}>
            <div className="input-box">
              <FaEnvelope className="icon" />
              <input type="email" placeholder="awesome@user.com" required />
            </div>

            <div className="input-box">
              <FaLock className="icon" />
              <input type="password" placeholder="New Password" required />
            </div>

            <button type="submit" className="login-btn">
              Reset Password
            </button>
          </form>

          <p className="signup-text">
            Remembered your password?{" "}
            <a onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
              Log in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;

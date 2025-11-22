import React, { useState } from "react";
import "./../styles/login.css";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock, FaFacebookF, FaTwitter, FaLinkedinIn } from "react-icons/fa";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/login?email=${email}&password=${password}`,
        { method: "POST" }
      );
      const data = await response.json();
      alert(data.message);
      navigate("/chatbot");
    } catch (error) {
      console.error("Login failed:", error);
      alert("Invalid credentials!");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="left-panel"></div>
        <div className="right-panel">
          <h2>Welcome</h2>
          <p>Log in to your account to continue</p>

          <form onSubmit={handleLogin}>
            <div className="input-box">
              <FaUser className="icon" />
              <input
                type="email"
                placeholder="awesome@user.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="input-box">
              <FaLock className="icon" />
              <input
                type="password"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="forgot">
              <a onClick={() => navigate("/forgot-password")} style={{ cursor: "pointer" }}>
                Forgot your password?
              </a>
            </div>

            <button type="submit" className="login-btn">
              Log In
            </button>
          </form>

          <p className="signup-text">
            Don’t have an account?{" "}
            <a onClick={() => navigate("/signup")} style={{ cursor: "pointer" }}>
              Sign up!
            </a>
          </p>

          <div className="social-icons">
            <FaFacebookF />
            <FaTwitter />
            <FaLinkedinIn />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

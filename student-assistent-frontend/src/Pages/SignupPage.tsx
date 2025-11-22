import React, { useState } from "react";
import "./../styles/login.css";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock, FaFacebookF, FaTwitter, FaLinkedinIn } from "react-icons/fa";

const SignupPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const formData = new URLSearchParams();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);

      const response = await fetch("http://127.0.0.1:8000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      });

      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        navigate("/"); // redirect to login page
      } else {
        alert(data.detail || "Signup failed!");
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("Failed to connect to the server.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="left-panel"></div>
        <div className="right-panel">
          <h2>Create Account</h2>
          <p>Sign up to start chatting with the bot</p>

          <form onSubmit={handleSignup}>
            <div className="input-box">
              <FaUser className="icon" />
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="input-box">
              <FaUser className="icon" />
              <input
                type="email"
                name="email"
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
                name="password"
                placeholder="Create Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="login-btn">
              Sign Up
            </button>
          </form>

          <p className="signup-text">
            Already have an account?{" "}
            <a onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
              Log In
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

export default SignupPage;

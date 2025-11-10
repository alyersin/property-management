"use client";

import React, { useState } from 'react';
import { useAuth } from "../../contexts/AuthContext";
import { useRouter } from "next/navigation";
import { ROUTES } from "../../constants/app";

import dynamic from "next/dynamic";

const AuthLayout = dynamic(
  () => import("../../components/auth/AuthLayout"),
  { ssr: false }
);

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }
    
    try {
      const result = await register(email, email, password);
      if (result.success) {
        router.push(ROUTES.dashboard);
      } else {
        setError(result.error || "Registration failed");
      }
    } catch (err) {
      setError("An error occurred during registration");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit} autoComplete="off">
        <div className="input-box">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="off"
            required
          />
          <label>Email</label>
        </div>
        <div className="input-box">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            required
          />
          <label>Password</label>
        </div>
        <div className="input-box">
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
            required
          />
          <label>Confirm Password</label>
        </div>
        {error && (
          <div
            style={{
              color: "#ff6b6b",
              textAlign: "center",
              marginBottom: "10px",
              fontSize: "0.85em",
            }}
          >
            {error}
          </div>
        )}
        <div className="forgot-pass">
          <a href="#" onClick={(e) => e.preventDefault()}>
            Terms & Conditions
          </a>
        </div>
        <button className="btn" type="submit" disabled={loading}>
          {loading ? "Creating Account..." : "Register"}
        </button>
        <div className="signup-link">
          <a href="/login">Already have an account? Login</a>
        </div>
      </form>
    </AuthLayout>
  );
};

export default RegisterPage;

"use client";

import React, { useState } from 'react';
import { useAuth } from "../../contexts/AuthContext";
import { useRouter } from "next/navigation";
import { ROUTES, DEMO_CREDENTIALS } from "../../constants/app";

import dynamic from "next/dynamic";

const AuthLayout = dynamic(
  () => import("../../components/auth/AuthLayout"),
  { ssr: false }
);

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const result = await login(email, password);
      if (result.success) {
        router.push(ROUTES.dashboard);
      } else {
        setError(result.error || "Login failed");
      }
    } catch (err) {
      setError("An error occurred during login");
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
            Forgot your password?
          </a>
        </div>
        <button className="btn" type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
        <div className="signup-link">
          <a href="/register">Sign Up</a>
        </div>
      </form>

      <div
        style={{
          marginTop: "20px",
          padding: "15px",
          background: "rgba(255,255,255,0.1)",
          borderRadius: "10px",
        }}
      >
        <p
          style={{
            color: "#0ef",
            fontSize: "0.8em",
            textAlign: "center",
            marginBottom: "10px",
            fontWeight: "600",
          }}
        >
          Demo Credentials:
        </p>
        <p
          style={{
            color: "#fff",
            fontSize: "0.75em",
            textAlign: "center",
            margin: "2px 0",
          }}
        >
          {DEMO_CREDENTIALS.email} / {DEMO_CREDENTIALS.password} (
          {DEMO_CREDENTIALS.name})
        </p>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;
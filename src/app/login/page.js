"use client";

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { useAuth } from "../../contexts/AuthContext";
import { useRouter } from "next/navigation";
import { ROUTES, DEMO_CREDENTIALS } from "../../constants/app";

// Dynamically import styled-components to prevent SSR issues
const StyledWrapper = dynamic(() => import('./StyledWrapper'), { ssr: false });

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
    <StyledWrapper>
      <div className="container">
        <div className="login-box">
          <h2>Home Admin</h2>
          <p style={{ color: '#fff', textAlign: 'center', marginBottom: '20px', fontSize: '0.9em' }}>
            Property Management System
          </p>
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
              <div style={{ color: '#ff6b6b', textAlign: 'center', marginBottom: '10px', fontSize: '0.85em' }}>
                {error}
              </div>
            )}
            <div className="forgot-pass">
              <a href="#" onClick={(e) => e.preventDefault()}>Forgot your password?</a>
            </div>
            <button className="btn" type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
            <div className="signup-link">
              <a href="/register">Sign Up</a>
            </div>
          </form>
          
          {/* Demo Credentials */}
          <div style={{ marginTop: '20px', padding: '15px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px' }}>
            <p style={{ color: '#0ef', fontSize: '0.8em', textAlign: 'center', marginBottom: '10px', fontWeight: '600' }}>
              Demo Credentials:
            </p>
            <p style={{ color: '#fff', fontSize: '0.75em', textAlign: 'center', margin: '2px 0' }}>
              {DEMO_CREDENTIALS.email} / {DEMO_CREDENTIALS.password} ({DEMO_CREDENTIALS.name})
            </p>
          </div>
        </div>
        <span style={{'--i': 0}} />
        <span style={{'--i': 1}} />
        <span style={{'--i': 2}} />
        <span style={{'--i': 3}} />
        <span style={{'--i': 4}} />
        <span style={{'--i': 5}} />
        <span style={{'--i': 6}} />
        <span style={{'--i': 7}} />
        <span style={{'--i': 8}} />
        <span style={{'--i': 9}} />
        <span style={{'--i': 10}} />
        <span style={{'--i': 11}} />
        <span style={{'--i': 12}} />
        <span style={{'--i': 13}} />
        <span style={{'--i': 14}} />
        <span style={{'--i': 15}} />
        <span style={{'--i': 16}} />
        <span style={{'--i': 17}} />
        <span style={{'--i': 18}} />
        <span style={{'--i': 19}} />
        <span style={{'--i': 20}} />
        <span style={{'--i': 21}} />
        <span style={{'--i': 22}} />
        <span style={{'--i': 23}} />
        <span style={{'--i': 24}} />
        <span style={{'--i': 25}} />
        <span style={{'--i': 26}} />
        <span style={{'--i': 27}} />
        <span style={{'--i': 28}} />
        <span style={{'--i': 29}} />
        <span style={{'--i': 30}} />
        <span style={{'--i': 31}} />
        <span style={{'--i': 32}} />
        <span style={{'--i': 33}} />
        <span style={{'--i': 34}} />
        <span style={{'--i': 35}} />
        <span style={{'--i': 36}} />
        <span style={{'--i': 37}} />
        <span style={{'--i': 38}} />
        <span style={{'--i': 39}} />
        <span style={{'--i': 40}} />
        <span style={{'--i': 41}} />
        <span style={{'--i': 42}} />
        <span style={{'--i': 43}} />
        <span style={{'--i': 44}} />
        <span style={{'--i': 45}} />
        <span style={{'--i': 46}} />
        <span style={{'--i': 47}} />
        <span style={{'--i': 48}} />
        <span style={{'--i': 49}} />
      </div>
    </StyledWrapper>
  );
};

export default LoginPage;
import styled from 'styled-components';

const StyledWrapper = styled.div`
  min-height: 100vh;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #1f293a 0%, #0f1419 100%);
  font-family: 'Arial', sans-serif;
  padding: 20px;
  overflow: hidden;

  .container {
    position: relative;
    width: 500px;
    height: 500px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    overflow: visible;
  }

  /* Mobile responsiveness */
  @media (max-width: 768px) {
    padding: 10px;
    height: 100vh;
    min-height: 100vh;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    
    .container {
      width: 100%;
      height: auto;
      min-height: auto;
      border-radius: 20px;
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  @media (max-width: 480px) {
    padding: 5px;
    height: 100vh;
    min-height: 100vh;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    
    .container {
      width: 100%;
      height: auto;
      min-height: auto;
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  .container span {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 50px;
    height: 10px;
    background: #2c4766;
    border-radius: 80px;
    transform-origin: 0 0;
    transform: translate(-10%, -50%) rotate(calc(var(--i) * (360deg / 50))) translateX(260px) translateX(30px);
    animation: blink 3s linear infinite;
    animation-delay: calc(var(--i) * (3s / 50));
    opacity: 0.8;
  }

  /* Mobile responsiveness for background pattern */
  @media (max-width: 768px) {
    .container span {
      transform: translate(-10%, -50%) rotate(calc(var(--i) * (360deg / 50))) translateX(200px) translateX(20px);
    }
  }

  @media (max-width: 480px) {
    .container span {
      transform: translate(-10%, -50%) rotate(calc(var(--i) * (360deg / 50))) translateX(150px) translateX(15px);
    }
  }

  @keyframes blink {
    0% {
      background: #0ef;
      box-shadow: 0 0 10px #0ef;
    }
    25% {
      background: #2c4766;
      box-shadow: 0 0 5px #2c4766;
    }
    50% {
      background: #0ef;
      box-shadow: 0 0 15px #0ef;
    }
    75% {
      background: #2c4766;
      box-shadow: 0 0 5px #2c4766;
    }
    100% {
      background: #0ef;
      box-shadow: 0 0 10px #0ef;
    }
  }

  .login-box {
    position: absolute;
    width: 80%;
    max-width: 300px;
    z-index: 1;
    padding: 20px;
    border-radius: 20px;
    background: rgba(31, 41, 58, 0.8);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(0, 239, 255, 0.2);
  }

  /* Mobile responsiveness for login box */
  @media (max-width: 768px) {
    .login-box {
      width: 90%;
      max-width: 350px;
      padding: 25px;
      margin: 0 auto;
      position: relative;
      z-index: 2;
    }
  }

  @media (max-width: 480px) {
    .login-box {
      width: 95%;
      max-width: 320px;
      padding: 20px;
      margin: 0 auto;
      position: relative;
      z-index: 2;
    }
  }

  form {
    width: 100%;
    padding: 0 10px;
  }

  h2 {
    font-size: 1.8em;
    color: #0ef;
    text-align: center;
    margin-bottom: 10px;
  }

  .input-box {
    position: relative;
    margin: 15px 0;
  }

  input {
    width: 100%;
    height: 45px;
    background: transparent;
    border: 2px solid #2c4766;
    outline: none;
    border-radius: 40px;
    font-size: 1em;
    color: #fff;
    padding: 0 15px;
    transition: 0.5s ease;
    box-sizing: border-box;
  }

  /* Mobile responsiveness for inputs */
  @media (max-width: 480px) {
    input {
      height: 50px;
      font-size: 16px; /* Prevents zoom on iOS */
      padding: 0 20px;
    }
  }

  input:focus {
    border-color: #0ef;
  }

  input[value]:not([value=""]) ~ label,
  input:focus ~ label {
    top: -10px;
    font-size: 0.8em;
    background: #1f293a;
    padding: 0 6px;
    color: #0ef;
  }

  label {
    position: absolute;
    top: 50%;
    left: 15px;
    transform: translateY(-50%);
    font-size: 1em;
    pointer-events: none;
    transition: 0.5s ease;
    color: #fff;
  }

  .forgot-pass {
    margin: -10px 0 10px;
    text-align: center;
  }

  .forgot-pass a {
    font-size: 0.85em;
    color: #fff;
    text-decoration: none;
    transition: color 0.3s ease;
  }

  .forgot-pass a:hover {
    color: #0ef;
  }

  .btn {
    width: 100%;
    height: 45px;
    background: #0ef;
    border: none;
    outline: none;
    border-radius: 40px;
    cursor: pointer;
    font-size: 1em;
    color: #1f293a;
    font-weight: 600;
    transition: all 0.3s ease;
  }

  /* Mobile responsiveness for button */
  @media (max-width: 480px) {
    .btn {
      height: 50px;
      font-size: 16px; /* Prevents zoom on iOS */
    }
  }

  .btn:hover:not(:disabled) {
    background: #00d4ff;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 239, 255, 0.4);
  }

  .btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .signup-link {
    margin: 10px 0;
    text-align: center;
  }

  .signup-link a {
    font-size: 1em;
    color: #0ef;
    text-decoration: none;
    font-weight: 600;
    transition: color 0.3s ease;
  }

  .signup-link a:hover {
    color: #00d4ff;
  }
`;

export default StyledWrapper;

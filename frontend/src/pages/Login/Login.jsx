import { useState } from "react";
import "./Login.css";

const Login = () => {
  const [currentState, setCurrentState] = useState("Login");

  return (
    <div>
      <form className="auth-form">
        <div className="form-header">
          <p className="form-title">{currentState}</p>
        </div>
        {currentState === "Login" ? null : (
          <input
            type="text"
            className="form-input"
            placeholder="Full Name"
            required
          />
        )}
        <input
          type="email"
          className="form-input"
          placeholder="Email"
          required
        />
        <input
          type="password"
          className="form-input"
          placeholder="Password"
          required
        />
        <div className="form-footer">
          <p className="fgt-password">Forget Password ?</p>
          {currentState === "Login" ? (
            <p
              className="toogle-auth-state"
              onClick={() => setCurrentState("Sign Up")}
            >
              Create Account
            </p>
          ) : (
            <p
              className="toogle-auth-state"
              onClick={() => setCurrentState("Login")}
            >
              Login Here
            </p>
          )}
        </div>
        <button className="form-button">
          {currentState === "Login" ? "Login" : "Sign Up"}
        </button>
      </form>
      <h2>Login Page</h2>
    </div>
  );
};

export default Login;

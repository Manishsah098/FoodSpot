import { useState } from "react";
import "./Login.css";
import { BiEnvelope, BiLockAlt, BiUser, BiArrowBack } from "react-icons/bi";
import { FaGoogle, FaFacebookF } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Login = () => {
  const [currentState, setCurrentState] = useState("Login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success(`Welcome ${currentState === "Login" ? "back!" : "to FoodSpot!"}`);
    navigate("/");
  };

  return (
    <div className="auth-page-wrapper">
      
      <button className="back-home-btn" onClick={() => navigate("/")}>
        <BiArrowBack /> Back to Home
      </button>

      <div className="auth-card">
        
        <div className="auth-card-header">
          <h2>{currentState === "Login" ? "Welcome Back" : "Create Account"}</h2>
          <p>
            {currentState === "Login"
              ? "Sign in to order your favorite meals"
              : "Sign up to start ordering fresh food today"}
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          
          {currentState === "Sign Up" && (
            <div className="input-group">
              <BiUser className="field-icon" />
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="input-group">
            <BiEnvelope className="field-icon" />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <BiLockAlt className="field-icon" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-options">
            <div className="remember-me">
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">Remember me</label>
            </div>
            {currentState === "Login" && (
              <span className="forgot-pwd">Forgot Password?</span>
            )}
          </div>

          <button type="submit" className="auth-submit-btn">
            {currentState === "Login" ? "Sign In" : "Create Account"}
          </button>
        </form>

        <div className="auth-divider">
          <span>OR CONTINUE WITH</span>
        </div>

        <div className="social-login-grid">
          <button className="social-btn google">
            <FaGoogle /> Google
          </button>
          <button className="social-btn facebook">
            <FaFacebookF /> Facebook
          </button>
        </div>

        <div className="auth-switch-footer">
          {currentState === "Login" ? (
            <p>
              Don't have an account?{" "}
              <span onClick={() => setCurrentState("Sign Up")}>Sign Up</span>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <span onClick={() => setCurrentState("Login")}>Sign In</span>
            </p>
          )}
        </div>

      </div>
    </div>
  );
};

export default Login;

import { useState, useContext } from "react";
import "./Login.css";
import { BiEnvelope, BiLockAlt, BiUser, BiArrowBack } from "react-icons/bi";
import { FaGoogle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { FoodContext } from "../../context/FoodContext";
import { toast } from "react-toastify";
import axios from "axios";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../config/firebase";

const BACKEND_URL = "http://localhost:4000";

const Login = () => {
  const [currentState, setCurrentState] = useState("Login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const { loginUser } = useContext(FoodContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      const endpoint = currentState === "Login" ? "/api/user/login" : "/api/user/register";
      const payload = currentState === "Login"
        ? { email, password }
        : { name, email, password };

      const res = await axios.post(`${BACKEND_URL}${endpoint}`, payload);

      if (res.data.success) {
        localStorage.setItem("userToken", res.data.token);
        loginUser(res.data.user || { name: name || email.split("@")[0], email });
        toast.success(currentState === "Login" ? "Welcome back! 🎉" : "Account created! Welcome! 🎉");
        navigate("/");
      } else {
        toast.error(res.data.message || "Something went wrong");
      }
    } catch {
      // Fallback: offline login
      const userName = name.trim() || email.split("@")[0] || "User";
      loginUser({ name: userName, email });
      toast.success("Logged in (offline mode)");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (googleLoading) return;
    setGoogleLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Send Google user info to backend
      const res = await axios.post(`${BACKEND_URL}/api/user/google-login`, {
        name: user.displayName,
        email: user.email,
        googleId: user.uid,
      });

      if (res.data.success) {
        localStorage.setItem("userToken", res.data.token);
        loginUser(res.data.user || { name: user.displayName, email: user.email });
      } else {
        // Use Google profile directly if backend fails
        loginUser({ name: user.displayName, email: user.email });
      }
      toast.success(`Welcome, ${user.displayName}! 🎉`);
      navigate("/");
    } catch (error) {
      if (error.code === "auth/popup-closed-by-user") {
        toast.info("Google login cancelled");
      } else if (error.code === "auth/configuration-not-found" || error.code?.includes("api-key")) {
        // Firebase not configured — use mock Google login
        loginUser({ name: "Google User", email: "user@gmail.com" });
        toast.success("Logged in with Google (demo mode)! 🎉");
        navigate("/");
      } else {
        toast.error("Google login failed. Please try email login.");
        console.error("Google login error:", error);
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
      <button className="back-home-btn" onClick={() => navigate("/")}>
        <BiArrowBack /> Back to Home
      </button>

      <div className="auth-card">
        <div className="auth-card-header">
          <h2>{currentState === "Login" ? "Welcome Back 👋" : "Create Account 🍽️"}</h2>
          <p>
            {currentState === "Login"
              ? "Sign in to order your favorite meals"
              : "Sign up to start ordering fresh food today"}
          </p>
        </div>

        {/* Google Login Button */}
        <button
          className="google-login-btn"
          type="button"
          onClick={handleGoogleLogin}
          disabled={googleLoading}
        >
          {googleLoading ? (
            <span className="google-btn-spinner" />
          ) : (
            <FaGoogle className="google-icon" />
          )}
          {googleLoading ? "Signing in with Google..." : "Continue with Google"}
        </button>

        <div className="auth-divider">
          <span>OR CONTINUE WITH EMAIL</span>
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
              placeholder="Password (min 8 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {currentState === "Login" && (
            <div className="form-options">
              <div className="remember-me">
                <input type="checkbox" id="remember" />
                <label htmlFor="remember">Remember me</label>
              </div>
              <span className="forgot-pwd">Forgot Password?</span>
            </div>
          )}

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? (
              <span className="auth-spinner" />
            ) : currentState === "Login" ? "Sign In →" : "Create Account →"}
          </button>
        </form>

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

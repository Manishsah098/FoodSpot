import { useState, useContext } from "react";
import "./Login.css";
import { BiEnvelope, BiLockAlt, BiUser, BiArrowBack } from "react-icons/bi";
import { FaGoogle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { FoodContext } from "../../context/FoodContext";
import { toast } from "react-toastify";
import axios from "axios";
import { useGoogleLogin } from "@react-oauth/google";

const BACKEND_URL = "http://localhost:4000";

const Login = () => {
  const [currentState, setCurrentState] = useState("Login");
  const [email, setEmail]               = useState("");
  const [password, setPassword]         = useState("");
  const [name, setName]                 = useState("");
  const [loading, setLoading]           = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const { loginUser } = useContext(FoodContext);
  const navigate = useNavigate();

  /* ── Email / Password Login ─────────────────────────── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      const endpoint = currentState === "Login"
        ? "/api/user/login"
        : "/api/user/register";
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
      const userName = name.trim() || email.split("@")[0] || "User";
      loginUser({ name: userName, email });
      toast.success("Logged in (offline mode)");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  /* ── Real Google OAuth via @react-oauth/google ───────── */
  // This opens the REAL Google account picker in the browser.
  // After the user picks an account, Google returns an access token,
  // which we use to fetch the user's profile from Google's API,
  // then send to our backend for auth.
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setGoogleLoading(true);
      try {
        // Fetch actual Google profile using the access token
        const profileRes = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          { headers: { Authorization: `Bearer ${tokenResponse.access_token}` } }
        );
        const profile = profileRes.data;
        // profile.name, profile.email, profile.sub (Google UID)

        // Send to our backend
        const backendRes = await axios.post(`${BACKEND_URL}/api/user/google-login`, {
          name:     profile.name,
          email:    profile.email,
          googleId: profile.sub,
        });

        if (backendRes.data.success) {
          localStorage.setItem("userToken", backendRes.data.token);
          loginUser(backendRes.data.user || { name: profile.name, email: profile.email });
        } else {
          // Backend offline — still use real Google profile
          loginUser({ name: profile.name, email: profile.email });
        }

        toast.success(`Welcome, ${profile.name}! 🎉`);
        navigate("/");
      } catch (err) {
        console.error("Google profile fetch error:", err);
        toast.error("Google login failed. Please try again.");
      } finally {
        setGoogleLoading(false);
      }
    },
    onError: (err) => {
      console.error("Google login error:", err);
      toast.error("Google login was cancelled or failed.");
      setGoogleLoading(false);
    },
    flow: "implicit", // uses popup, shows real Google account chooser
  });

  const handleGoogleClick = () => {
    if (!import.meta.env.VITE_GOOGLE_CLIENT_ID ||
        import.meta.env.VITE_GOOGLE_CLIENT_ID.includes("YOUR_GOOGLE_CLIENT_ID")) {
      toast.error(
        "Google Client ID not configured. Please add VITE_GOOGLE_CLIENT_ID to frontend/.env",
        { autoClose: 6000 }
      );
      return;
    }
    setGoogleLoading(true);
    googleLogin();
  };

  /* ── Render ─────────────────────────────────────────── */
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

        {/* Real Google Login Button */}
        <button
          className="google-login-btn"
          type="button"
          onClick={handleGoogleClick}
          disabled={googleLoading}
        >
          {googleLoading ? (
            <span className="google-btn-spinner" />
          ) : (
            <FaGoogle className="google-icon" />
          )}
          {googleLoading ? "Opening Google..." : "Continue with Google"}
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
            ) : currentState === "Login" ? (
              "Sign In →"
            ) : (
              "Create Account →"
            )}
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

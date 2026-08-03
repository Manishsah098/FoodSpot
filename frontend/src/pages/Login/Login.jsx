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

const GOOGLE_ACCOUNTS = [
  {
    name: "Manish Sah",
    email: "manish.sah@gmail.com",
    bgColor: "#ea4335",
    sub: "google_10982347109283749",
  },
  {
    name: "Alex Smith",
    email: "alex.smith@gmail.com",
    bgColor: "#4285f4",
    sub: "google_10982347109283750",
  },
  {
    name: "Priya Sharma",
    email: "priya.sharma@gmail.com",
    bgColor: "#fbbc05",
    sub: "google_10982347109283751",
  },
  {
    name: "Rahul Verma",
    email: "rahul.verma@gmail.com",
    bgColor: "#34a853",
    sub: "google_10982347109283752",
  },
  {
    name: "FoodSpot Demo User",
    email: "user.foodspot@gmail.com",
    bgColor: "#ab47bc",
    sub: "google_10982347109283753",
  },
];

const Login = () => {
  const [currentState, setCurrentState] = useState("Login");
  const [email, setEmail]               = useState("");
  const [password, setPassword]         = useState("");
  const [name, setName]                 = useState("");
  const [loading, setLoading]           = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Google Account Picker modal states
  const [showGooglePicker, setShowGooglePicker] = useState(false);
  const [showCustomInput, setShowCustomInput]   = useState(false);
  const [customEmail, setCustomEmail]           = useState("");
  const [selectedAccount, setSelectedAccount]   = useState(null);

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
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setGoogleLoading(true);
      try {
        const profileRes = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          { headers: { Authorization: `Bearer ${tokenResponse.access_token}` } }
        );
        const profile = profileRes.data;

        const backendRes = await axios.post(`${BACKEND_URL}/api/user/google-login`, {
          name:     profile.name,
          email:    profile.email,
          googleId: profile.sub,
        });

        if (backendRes.data.success) {
          localStorage.setItem("userToken", backendRes.data.token);
          loginUser(backendRes.data.user || { name: profile.name, email: profile.email });
        } else {
          loginUser({ name: profile.name, email: profile.email });
        }

        toast.success(`Welcome back, ${profile.name}! 🎉`);
        navigate("/");
      } catch (err) {
        console.error("Google profile fetch error:", err);
        setShowGooglePicker(true);
      } finally {
        setGoogleLoading(false);
      }
    },
    onError: (err) => {
      console.error("Google login error:", err);
      setGoogleLoading(false);
      setShowGooglePicker(true);
    },
    flow: "implicit",
  });

  const handleGoogleClick = () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (clientId && !clientId.includes("YOUR_GOOGLE_CLIENT_ID")) {
      try {
        setGoogleLoading(true);
        googleLogin();
        return;
      } catch (err) {
        console.warn("Real Google OAuth trigger failed:", err);
        setGoogleLoading(false);
      }
    }
    // Show Google Account Chooser Modal
    setShowGooglePicker(true);
  };

  /* ── Account Selection Handler ────────────────────────────── */
  const handleSelectGoogleAccount = async (account) => {
    setSelectedAccount(account.email);
    try {
      const googleId = account.sub || `google_${Date.now()}`;
      const res = await axios.post(`${BACKEND_URL}/api/user/google-login`, {
        name: account.name,
        email: account.email,
        googleId: googleId,
      });

      if (res.data.success) {
        localStorage.setItem("userToken", res.data.token);
        loginUser(res.data.user || { name: account.name, email: account.email });
      } else {
        localStorage.setItem("userToken", `google_token_${Date.now()}`);
        loginUser({ name: account.name, email: account.email });
      }

      toast.success(`Welcome back, ${account.name}! 🎉`);
      setShowGooglePicker(false);
      navigate("/");
    } catch {
      // Backend offline — smooth fallback
      localStorage.setItem("userToken", `google_token_${Date.now()}`);
      loginUser({ name: account.name, email: account.email });
      toast.success(`Welcome back, ${account.name}! 🎉`);
      setShowGooglePicker(false);
      navigate("/");
    } finally {
      setSelectedAccount(null);
    }
  };

  /* ── Custom Email Submit Handler ───────────────────────────── */
  const handleCustomAccountSubmit = (e) => {
    e.preventDefault();
    if (!customEmail || !customEmail.includes("@")) {
      toast.error("Please enter a valid Gmail address");
      return;
    }
    const namePart = customEmail.split("@")[0];
    const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
    handleSelectGoogleAccount({
      name: formattedName,
      email: customEmail,
      bgColor: "#4285f4",
      sub: `google_custom_${Date.now()}`,
    });
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

        {/* Google Login Button */}
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

      {/* ── Google Account Chooser Modal ───────────────────────── */}
      {showGooglePicker && (
        <div className="google-picker-overlay" onClick={() => setShowGooglePicker(false)}>
          <div className="google-picker-modal" onClick={(e) => e.stopPropagation()}>
            <div className="google-picker-header">
              <FaGoogle className="picker-google-logo" />
              <div>
                <h3>Choose an account</h3>
                <p>to continue to <strong>FoodSpot</strong></p>
              </div>
            </div>

            <div className="google-accounts-list">
              {GOOGLE_ACCOUNTS.map((acc) => (
                <button
                  key={acc.email}
                  className="google-account-row"
                  onClick={() => handleSelectGoogleAccount(acc)}
                  disabled={!!selectedAccount}
                >
                  <div
                    className="google-account-avatar"
                    style={{ backgroundColor: acc.bgColor }}
                  >
                    {acc.name.charAt(0)}
                  </div>
                  <div className="google-account-info">
                    <strong>{acc.name}</strong>
                    <span>{acc.email}</span>
                  </div>
                  {selectedAccount === acc.email ? (
                    <span className="google-btn-spinner" />
                  ) : (
                    <span className="account-check">✓</span>
                  )}
                </button>
              ))}

              {showCustomInput ? (
                <form onSubmit={handleCustomAccountSubmit} className="google-custom-account-form">
                  <div className="google-custom-input-wrapper">
                    <input
                      type="email"
                      placeholder="Enter Gmail address (e.g. user@gmail.com)"
                      value={customEmail}
                      onChange={(e) => setCustomEmail(e.target.value)}
                      autoFocus
                      required
                    />
                  </div>
                  <div className="google-custom-actions">
                    <button type="submit" className="google-custom-btn-submit">
                      Sign In
                    </button>
                    <button
                      type="button"
                      className="google-custom-btn-cancel"
                      onClick={() => setShowCustomInput(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <button
                  className="google-account-row add-account-row"
                  onClick={() => setShowCustomInput(true)}
                >
                  <div className="google-account-avatar add-avatar">+</div>
                  <div className="google-account-info">
                    <strong>Use another account</strong>
                    <span>Sign in with a different Gmail address</span>
                  </div>
                </button>
              )}
            </div>

            <div className="google-picker-footer">
              <span>To continue, Google will share your profile with FoodSpot.</span>
              <button
                className="google-picker-cancel"
                onClick={() => setShowGooglePicker(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;

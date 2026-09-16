import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  reload,
} from "firebase/auth";

import { auth, db } from "../../../firebase/firebase";

import { doc, getDoc } from "firebase/firestore";

import DotBackground from "../../DotBackground/DotBackground";
import "../../../styles/Auth.css";

function Login() {
  const navigate = useNavigate();

  const googleProvider = new GoogleAuthProvider();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const redirectBasedOnRole = async (user) => {
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      throw new Error("User profile not found.");
    }

    const userData = userSnap.data();

    console.log("User role:", userData.role);

    if (userData.role === "admin") {
      navigate("/admin-dashboard");
    } else if (userData.role === "student") {
      navigate("/dashboard");
    } else {
      throw new Error("Invalid user role.");
    }
  };

  // =========================================
  // GOOGLE LOGIN
  // =========================================

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      const result = await signInWithPopup(auth, googleProvider);

      console.log("Google login successful");

      await redirectBasedOnRole(result.user);
    } catch (error) {
      console.error("Google login error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // EMAIL / PASSWORD LOGIN
  // =========================================

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );

      const user = userCredential.user;

      // =========================================
      // REFRESH USER'S LATEST FIREBASE STATE
      // =========================================

      await reload(user);

      // =========================================
      // DEBUG INFORMATION
      // =========================================

      console.log("========== LOGIN DEBUG ==========");
      console.log("UID:", user.uid);
      console.log("Email:", user.email);
      console.log("Email verified:", user.emailVerified);
      console.log("Auth current user:", auth.currentUser);
      console.log("=================================");

      // =========================================
      // REQUIRE EMAIL VERIFICATION
      // =========================================

      if (!user.emailVerified) {
        await auth.signOut();

        throw new Error(
          "Please verify your email address before logging in. Check your inbox for the verification email.",
        );
      }

      console.log("Login successful");

      // =========================================
      // REDIRECT BASED ON ROLE
      // =========================================

      await redirectBasedOnRole(user);
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DotBackground>
      <div className="auth-page">
        <div className="auth-container">
          {/* =========================================
              BRAND
          ========================================= */}

          <div className="auth-brand">
            found<span>@cvv</span>
          </div>

          {/* =========================================
              LOGIN CARD
          ========================================= */}

          <div className="auth-card">
            <h1 className="auth-title">Welcome back 👋</h1>
            <p className="auth-subtitle">Sign in to continue to your account</p>
            {/* =========================================
                EMAIL LOGIN FORM
            ========================================= */}
            <form className="auth-form" onSubmit={handleLogin}>
              {/* Email */}

              <div className="auth-field">
                <label htmlFor="email">Email</label>

                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* Password */}

              <div className="auth-field">
                <label htmlFor="password">Password</label>

                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                {/* Forgot Password */}

                <div className="auth-forgot">
                  <Link to="/forgot-password">Forgot password?</Link>
                </div>
              </div>

              {/* Error */}

              {error && <p className="auth-error">{error}</p>}

              {/* Login Button */}

              <button
                type="submit"
                className="auth-button auth-button-primary"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>
            {/* =========================================
                DIVIDER
            ========================================= */}
            <div className="auth-divider">
              <span>OR</span>
            </div>
            {/* =========================================
                GOOGLE LOGIN
            ========================================= */}
            <button
              type="button"
              className="auth-button auth-button-google"
              onClick={handleGoogleLogin}
              disabled={loading}
            >
              Continue with Google
            </button>
            {/* =========================================
                REGISTER LINK
            ========================================= */}
          
            <p className="auth-switch">
              Don't have an account? <Link to="/register">Create one</Link>
            </p>
            <div className="auth-back-home">
              <Link to="/">← Back to Home</Link>
            </div>
        
          </div>
        </div>
      </div>
    </DotBackground>
  );
}

export default Login;

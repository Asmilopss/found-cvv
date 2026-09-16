import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import {
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";

import DotBackground from "../../DotBackground/DotBackground";
import "../../../styles/Auth.css";

import { auth, db } from "../../../firebase/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [loading, setLoading] = useState(false);

  const googleProvider = new GoogleAuthProvider();

  // Email / Password Registration
  const handleRegister = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );

      await updateProfile(userCredential.user, {
        displayName: name,
      });

      // Create user document in Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), {
        name: name,
        email: userCredential.user.email,
        role: "student",
        createdAt: serverTimestamp(),
      });

      // Send verification email
      // Send verification email
      console.log("========== VERIFICATION DEBUG ==========");
      console.log("UID:", userCredential.user.uid);
      console.log("Email:", userCredential.user.email);
      console.log("Email verified BEFORE:", userCredential.user.emailVerified);

      try {
        await sendEmailVerification(userCredential.user);

        console.log("Verification email request SENT successfully");
        console.log("Email verified AFTER:", userCredential.user.emailVerified);

        setSuccess(
          "Account created successfully. Please check your email and verify your account before logging in.",
        );
      } catch (verificationError) {
        console.error("VERIFICATION EMAIL ERROR:", verificationError);
        console.error("Error code:", verificationError.code);
        console.error("Error message:", verificationError.message);

        throw verificationError;
      }

      // Sign out until email is verified
      await auth.signOut();

      // Sign out until email is verified
      await auth.signOut();

      setName("");
      setEmail("");
      setPassword("");
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Google Registration / Login
  const handleGoogleLogin = async () => {
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const result = await signInWithPopup(auth, googleProvider);

      console.log("Google login successful:", result.user);

      navigate("/dashboard");
    } catch (error) {
      console.error("Google login error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DotBackground>
      <div className="auth-page">
        <div className="auth-container">
          {/* Branding */}
          <div className="auth-brand">
            found<span>@cvv</span>
          </div>

          {/* Card */}
          <div className="auth-card">
            <h1 className="auth-title">Create an account ✨</h1>
            <p className="auth-subtitle">
              Join Found@CVV and help reunite lost items with their owners
            </p>
            <form className="auth-form" onSubmit={handleRegister}>
              {/* Name */}
              <div className="auth-field">
                <label htmlFor="name">Name</label>

                <input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

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
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {/* Error */}
              {error && <p className="auth-error">{error}</p>}

              {/* Success */}
              {success && <p className="auth-success">{success}</p>}

              {/* Register */}
              <button
                type="submit"
                className="auth-button auth-button-primary"
                disabled={loading}
              >
                {loading ? "Creating account..." : "Create account"}
              </button>
            </form>
            {/* Divider */}
            <div className="auth-divider">
              <span>OR</span>
            </div>
            {/* Google */}
            <button
              type="button"
              className="auth-button auth-button-google"
              onClick={handleGoogleLogin}
              disabled={loading}
            >
              Continue with Google
            </button>
          
            {/* Login Link */}
            <p className="auth-switch">
              Already have an account? <Link to="/login">Login</Link>
            </p>
            {/* Back to Home */}
            <div className="auth-back-home">
              <Link to="/">← Back to Home</Link>
            </div>
          
          </div>
        </div>
      </div>
    </DotBackground>
  );
}

export default Register;

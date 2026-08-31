import { useState } from "react";
import { Link } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../../firebase/firebase";
import DotBackground from "../../DotBackground/DotBackground";

import "../../../styles/Auth.css";

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleResetPassword = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");
        setLoading(true);

        try {
            await sendPasswordResetEmail(auth, email);

            setSuccess(
                "Password reset email sent. Please check your inbox."
            );

            setEmail("");
        } catch (error) {
            console.error("Password reset error:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <DotBackground>
            <div className="auth-page">
                <div className="auth-container">

                    <div className="auth-brand">
                        found<span>@cvv</span>
                    </div>

                    <div className="auth-card">

                        <h1 className="auth-title">
                            Reset your password 🔐
                        </h1>

                        <p className="auth-subtitle">
                            Enter your email and we'll send you
                            a link to reset your password.
                        </p>

                        <form
                            className="auth-form"
                            onSubmit={handleResetPassword}
                        >

                            <div className="auth-field">
                                <label htmlFor="email">
                                    Email
                                </label>

                                <input
                                    id="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) =>
                                        setEmail(e.target.value)
                                    }
                                    required
                                />
                            </div>

                            {error && (
                                <p className="auth-error">
                                    {error}
                                </p>
                            )}

                            {success && (
                                <p className="auth-success">
                                    {success}
                                </p>
                            )}

                            <button
                                type="submit"
                                className="auth-button auth-button-primary"
                                disabled={loading}
                            >
                                {loading
                                    ? "Sending..."
                                    : "Send reset link"}
                            </button>

                        </form>

                        <p className="auth-switch">
                            Remember your password?{" "}
                            <Link to="/login">
                                Back to Login
                            </Link>
                        </p>

                    </div>
                </div>
            </div>
        </DotBackground>
    );
}

export default ForgotPassword;
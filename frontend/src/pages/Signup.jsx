import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Wallet } from "lucide-react";
import { signup } from "../utils/authApi";

function Signup({ setUser }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await signup(name, email, password);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify({ name: data.name, email: data.email }));
      setUser({ name: data.name, email: data.email });
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.detail || "Signup failed");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--paper)" }}>
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-sm surface p-8"
      >
        <div className="flex items-center gap-2.5 mb-8 justify-center">
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 18 }}
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "var(--ink)" }}
          >
            <Wallet size={19} style={{ color: "var(--paper)" }} />
          </motion.div>
          <p className="font-display font-semibold text-lg" style={{ color: "var(--ink)" }}>Moneta</p>
        </div>

        <h1 className="text-xl font-display font-semibold mb-1" style={{ color: "var(--ink)" }}>Create your account</h1>
        <p className="text-sm mb-6" style={{ color: "var(--ink-faint)" }}>Start tracking your finances</p>

        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: "auto", marginBottom: 16 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              className="text-sm px-3 py-2 rounded-lg"
              style={{ background: "var(--rust-tint)", color: "var(--rust)" }}
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="text-sm font-medium block mb-1.5" style={{ color: "var(--ink-soft)" }}>Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} required className="field" />
          </div>
          <div className="mb-4">
            <label className="text-sm font-medium block mb-1.5" style={{ color: "var(--ink-soft)" }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="field" />
          </div>
          <div className="mb-6">
            <label className="text-sm font-medium block mb-1.5" style={{ color: "var(--ink-soft)" }}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={8} className="field" />
          </div>
          <motion.button
            type="submit"
            disabled={loading}
            whileTap={{ scale: 0.97 }}
            className="btn-brass w-full py-2.5 rounded-lg text-sm font-semibold disabled:opacity-50"
          >
            {loading ? "Creating account…" : "Sign Up"}
          </motion.button>
        </form>

        <p className="text-sm text-center mt-6" style={{ color: "var(--ink-faint)" }}>
          Already have an account?{" "}
          <Link to="/login" className="font-medium" style={{ color: "var(--brass-strong)" }}>Log in</Link>
        </p>
      </motion.div>
    </div>
  );
}

export default Signup;

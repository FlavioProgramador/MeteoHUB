import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../Contexts/AuthContext";
import { backendApi } from "../../Services/backend";
import styles from "./Login.module.css";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await backendApi.post("/auth/login", {
        email,
        password,
      });

      if (response.data.success) {
        login(response.data.data.user);
        navigate("/");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.error || "Erro ao fazer login. Tente novamente.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h2 className={styles.title}>Bem-vindo de volta!</h2>
          <p className={styles.subtitle}>
            Faça login para acessar os dados da sua estação.
          </p>
        </div>

        {error && (
          <div
            style={{
              color: "#ff6b6b",
              textAlign: "center",
              marginBottom: "1rem",
              background: "rgba(255, 107, 107, 0.1)",
              padding: "10px",
              borderRadius: "8px",
            }}
          >
            {error}
          </div>
        )}

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>
              E-mail
            </label>
            <input
              type="email"
              id="email"
              className={styles.input}
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>
              Senha
            </label>
            <input
              type="password"
              id="password"
              className={styles.input}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={isLoading}
          >
            {isLoading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <div className={styles.footer}>
          Não tem uma conta?
          <Link to="/register" className={styles.link}>
            Crie agora
          </Link>
        </div>
      </div>
    </div>
  );
}

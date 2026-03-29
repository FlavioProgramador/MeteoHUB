import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../Contexts/AuthContext";
import { backendApi } from "../../Services/backend";
import styles from "./Register.module.css";

export function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      return setError("As senhas não coincidem");
    }

    setIsLoading(true);

    try {
      const response = await backendApi.post("/auth/register", {
        name,
        email,
        password,
      });

      if (response.data.success) {
        login(response.data.data.user);
        navigate("/");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.error || "Erro ao criar conta. Tente novamente.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h2 className={styles.title}>Criar Conta</h2>
          <p className={styles.subtitle}>
            Junte-se ao MeteoHub para dados climáticos em tempo real.
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
            <label htmlFor="name" className={styles.label}>
              Nome Completo
            </label>
            <input
              type="text"
              id="name"
              className={styles.input}
              placeholder="João Silva"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

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
              autoComplete="new-password"
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="confirmPassword" className={styles.label}>
              Confirmar Senha
            </label>
            <input
              type="password"
              id="confirmPassword"
              className={styles.input}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
          </div>

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={isLoading}
          >
            {isLoading ? "Cadastrando..." : "Cadastrar"}
          </button>
        </form>

        <div className={styles.footer}>
          Já tem uma conta?
          <Link to="/login" className={styles.link}>
            Fazer login
          </Link>
        </div>
      </div>
    </div>
  );
}

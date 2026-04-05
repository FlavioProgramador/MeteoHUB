import { CloudSun, LogIn, LogOut, UserPlus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../Contexts/AuthContext";
import styles from "./Header.module.css";

export const Header = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className={styles.header} role="banner">
      <Link
        to="/"
        className={styles.logoContainer}
        style={{ textDecoration: "none" }}
        aria-label="MeteoHub — Página inicial"
        onClick={(e) => {
          if (window.location.pathname === "/") {
            e.preventDefault();
            window.location.reload();
          }
        }}
      >
        <CloudSun size={42} className={styles.logoIcon} aria-hidden="true" />
        <h1 className={styles.logoText}>MeteoHub</h1>
      </Link>

      <nav className={styles.authContainer} aria-label="Autenticação">
        {isAuthenticated ? (
          <>
            <span
              className={styles.userName}
              style={{
                color: "var(--text-primary)",
                marginRight: "1rem",
                fontWeight: 500,
                fontSize: "1rem",
              }}
              aria-live="polite"
            >
              Olá, {user?.name?.split(" ")[0] || "Usuário"}
            </span>
            <button
              className={styles.loginBtn}
              onClick={handleLogout}
              aria-label="Sair da conta"
            >
              <LogOut size={18} aria-hidden="true" />
              <span>Sair</span>
            </button>
          </>
        ) : (
          <>
            <button
              className={styles.loginBtn}
              onClick={() => navigate("/login")}
              aria-label="Entrar na conta"
            >
              <LogIn size={18} aria-hidden="true" />
              <span>Entrar</span>
            </button>
            <button
              className={styles.registerBtn}
              onClick={() => navigate("/register")}
              aria-label="Criar uma nova conta"
            >
              <UserPlus size={18} aria-hidden="true" />
              <span>Criar Conta</span>
            </button>
          </>
        )}
      </nav>
    </header>
  );
};

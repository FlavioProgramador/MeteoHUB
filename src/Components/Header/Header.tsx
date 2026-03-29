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
    <header className={styles.header}>
      <Link
        to="/"
        className={styles.logoContainer}
        style={{ textDecoration: "none" }}
        onClick={(e) => {
          if (window.location.pathname === "/") {
            e.preventDefault();
            window.location.reload();
          }
        }}
      >
        <CloudSun size={42} className={styles.logoIcon} />
        <h1 className={styles.logoText}>MeteoHub</h1>
      </Link>

      <div className={styles.authContainer}>
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
            >
              Olá, {user?.name?.split(" ")[0] || "Usuário"}
            </span>
            <button className={styles.loginBtn} onClick={handleLogout}>
              <LogOut size={18} />
              <span>Sair</span>
            </button>
          </>
        ) : (
          <>
            <button
              className={styles.loginBtn}
              onClick={() => navigate("/login")}
            >
              <LogIn size={18} />
              <span>Entrar</span>
            </button>
            <button
              className={styles.registerBtn}
              onClick={() => navigate("/register")}
            >
              <UserPlus size={18} />
              <span>Criar Conta</span>
            </button>
          </>
        )}
      </div>
    </header>
  );
};

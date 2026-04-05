import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = {
    hasError: false,
    error: null,
  };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "200px",
            padding: "2rem",
            background: "var(--card-bg-glass)",
            borderRadius: "16px",
            border: "1px solid var(--card-border)",
            backdropFilter: "var(--card-backdrop)",
            textAlign: "center",
          }}
          role="alert"
        >
          <AlertTriangle
            size={48}
            style={{ color: "var(--alert-warning-text, #b45309)", marginBottom: "1rem" }}
          />
          <h2 style={{ margin: "0 0 0.5rem", color: "var(--text-main)" }}>
            Algo deu errado
          </h2>
          <p style={{ margin: "0 0 1.5rem", color: "var(--text-muted)", maxWidth: "400px" }}>
            {this.state.error?.message || "Um erro inesperado ocorreu."}
          </p>
          <button
            onClick={this.handleReset}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.5rem 1rem",
              border: "none",
              borderRadius: "8px",
              background: "var(--input-border)",
              color: "white",
              cursor: "pointer",
              fontSize: "0.9rem",
              fontWeight: 500,
            }}
            aria-label="Tentar novamente"
          >
            <RotateCcw size={16} />
            Tentar novamente
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

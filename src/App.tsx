import { Routes, Route } from "react-router-dom";
import "./App.css";

import { Header } from "./Components/Header/Header";
import { ErrorBoundary } from "./Components/ErrorBoundary/ErrorBoundary";
import { PrivateRoute } from "./Components/PrivateRoute/PrivateRoute";
import { Home } from "./Pages/Home/Home";
import { Login } from "./Pages/Login/Login";
import { Register } from "./Pages/Register/Register";

function App() {
  return (
    <div className="app-container">
      <Header />
      <Routes>
        <Route
          path="/"
          element={
            <PrivateRoute>
              <ErrorBoundary>
                <Home />
              </ErrorBoundary>
            </PrivateRoute>
          }
        />
        <Route
          path="/login"
          element={
            <ErrorBoundary>
              <Login />
            </ErrorBoundary>
          }
        />
        <Route
          path="/register"
          element={
            <ErrorBoundary>
              <Register />
            </ErrorBoundary>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
import { Routes, Route } from "react-router-dom";
import "./App.css";

import { Header } from "./Components/Header/Header";
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
              <Home />
            </PrivateRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  );
}

export default App;

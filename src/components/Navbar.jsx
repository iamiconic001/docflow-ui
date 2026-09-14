import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-brand">DocFlow</div>
      <div className="navbar-links">
        <NavLink
          to="/documents"
          className={({ isActive }) =>
            isActive ? "navbar-link active" : "navbar-link"
          }
        >
          Documents
        </NavLink>
        <NavLink
          to="/upload"
          className={({ isActive }) =>
            isActive ? "navbar-link active" : "navbar-link"
          }
        >
          Upload
        </NavLink>
      </div>
      <button className="navbar-logout" onClick={logout}>
        Logout
      </button>
    </nav>
  );
}

import { NavLink } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Navbar() {
  const { token, logout } = useAuth();

  return (
    <header>
      <p>Fitness Trackr</p>
      <nav>
        <NavLink to="/" end>
          Home
        </NavLink>
        <NavLink to="/activities">Activities</NavLink>
        {!token && (
          <>
            <NavLink to="/register">Register</NavLink>
            <NavLink to="/login">Login</NavLink>
          </>
        )}
        {token && <button onClick={logout}>Logout</button>}
      </nav>
    </header>
  );
}

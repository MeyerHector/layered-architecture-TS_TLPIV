import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { authState, logout } = useAuth();

  return (
    <header className="border-b">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link to={authState.isLogged ? "/tasks" : "/"}>
          <h1 className="text-2xl font-bold">Taskify</h1>
        </Link>
        {authState.isLogged ? (
          <ul className="flex gap-x-2">
            <li>
              <h1 className="text-black">Bienvenido {authState.user.name}!</h1>
            </li>
            <li>
              <Link
                to="/add-task"
                className="bg-indigo-500 px-4 py-1 rounded-sm"
              >
                Agrega una Tarea
              </Link>
            </li>
            <li>
              <Link
                to="/calendar" 
                className="bg-indigo-500 px-4 py-1 rounded-sm"
              >
                Ver Calendario
              </Link>
            </li>
            <li>
              <Link to="/" onClick={logout}>
                Cerrar Sesión
              </Link>
            </li>
          </ul>
        ) : (
          <ul className="flex gap-x-2">
            <li>
              <Link to="/login" className="bg-indigo-500 px-4 py-1 rounded-sm">
                Login
              </Link>
            </li>
            <li>
              <Link to="/register" className="bg-indigo-500 px-4 py-1 rounded-sm">
                Register
              </Link>
            </li>
          </ul>
        )}
      </div>
    </header>
  );
}

export default Navbar;


import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "./ui/button";

function Navbar() {
  const { authState, logout } = useAuth();
  const scrollToFeatures = () => {
    const featuresSection = document.getElementById('cont-section');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };
  return (
    <header className="border-b">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link to={authState.isLogged ? "/tasks" : "/"}>
          <h1 className="text-2xl font-bold">Taskify</h1>
        </Link>
        {authState.isLogged ? (
          <ul className="flex gap-x-2">
            <li style={{ margin: 5 }}>
              <h1 className="text-black">Bienvenido {authState.user.name}!</h1>
            </li>
            <li>
              <Link
                to="/calendar"
              >
                <Button size="sm">
                  Ver Calendario
                </Button>
              </Link>
            </li>
            <li style={{ margin: 5 }}>
              <Link to="/" onClick={logout}>
                Cerrar Sesión
              </Link>
            </li>
          </ul>
        ) : (
          <ul className="flex gap-x-2">
            <button
              onClick={scrollToFeatures}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Características
            </button>
            <li style={{padding:8}}>
              <Link
                to="/login"
                className="text-sm font-medium hover:text-primary"
              >
                Iniciar Sesión
              </Link>
            </li>
            <Button asChild>
              <Link to="/register">Registrarse</Link>
            </Button>
          </ul>
        )}
      </div>
    </header>
  );
}

export default Navbar;

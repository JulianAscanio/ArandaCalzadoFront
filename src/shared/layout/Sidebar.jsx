import { NavLink } from "react-router-dom";
import { useAuth } from "../../modules/auth/context/AuthContext";

export default function Sidebar({ isOpen }) {
  const { logout } = useAuth();

  return (
    <aside className={`sidebar ${!isOpen ? "collapsed" : ""}`}>
      <div className="sidebar-top">
        <div className="brand-block">
          <div className="brand-logo">AC</div>
          <div className="brand-text">
            <h2>Aranda Calzado</h2>
            <p>Panel de control</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          <NavLink
            to="/inventario"
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
          >
            Inventario
          </NavLink>

          <NavLink
            to="/productos"
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
          >
            Productos
          </NavLink>

          <NavLink
            to="/pedidos"
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
          >
            Pedidos
          </NavLink>
          <NavLink
            to="/produccion"
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
          >
            Producción
          </NavLink>
        </nav>
      </div>

      <div className="sidebar-user" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div className="brand-logo small">AD</div>
          <div>
            <strong>Admin</strong>
            <p>Administrador</p>
          </div>
        </div>
        <button 
          onClick={logout} 
          style={{background: 'none', border: 'none', color: '#d2bcc3', cursor: 'pointer', fontSize: '13px', textDecoration: 'underline', padding: 0}}
        >
          Salir
        </button>
      </div>
    </aside>
  );
}
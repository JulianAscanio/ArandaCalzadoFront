import { NavLink } from "react-router-dom";
import { useAuth } from "../../modules/auth/context/AuthContext";
import { Package, ShoppingCart, Factory, LogOut, Grid, Users, BarChart3 } from "lucide-react";

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
          <NavLink to="/inventario" className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"} style={{ gap: "14px" }}>
            <Package size={20} strokeWidth={2.5} />
            <span>Inventario</span>
          </NavLink>

          <NavLink to="/productos" className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"} style={{ gap: "14px" }}>
            <Grid size={20} strokeWidth={2.5} />
            <span>Productos</span>
          </NavLink>

          <NavLink to="/pedidos" className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"} style={{ gap: "14px" }}>
            <ShoppingCart size={20} strokeWidth={2.5} />
            <span>Pedidos</span>
          </NavLink>

          <NavLink to="/clientes" className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"} style={{ gap: "14px" }}>
            <Users size={20} strokeWidth={2.5} />
            <span>Clientes</span>
          </NavLink>

          <NavLink to="/produccion" className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"} style={{ gap: "14px" }}>
            <Factory size={20} strokeWidth={2.5} />
            <span>Producción</span>
          </NavLink>

          <NavLink to="/reportes" className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"} style={{ gap: "14px" }}>
            <BarChart3 size={20} strokeWidth={2.5} />
            <span>Reportes</span>
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
          style={{ background: 'none', border: 'none', color: '#d2bcc3', cursor: 'pointer', fontSize: '13px', padding: 0, display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '500', transition: 'color 0.2s' }}
          onMouseOver={(e) => e.currentTarget.style.color = '#fff'}
          onMouseOut={(e) => e.currentTarget.style.color = '#d2bcc3'}
          title="Cerrar sesión"
        >
          <LogOut size={16} strokeWidth={2.5} />
          <span>Salir</span>
        </button>
      </div>
    </aside>
  );
}
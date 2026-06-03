import { User, MapPin, Phone, Mail, ShoppingBag, DollarSign } from "lucide-react";

function CustomerDetail({ customer }) {
  if (!customer)
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#8a7870' }}>
        <User size={64} style={{ marginBottom: '16px', opacity: 0.2 }} />
        <p style={{ fontSize: '16px', fontWeight: '500' }}>Selecciona un cliente para ver su información</p>
      </div>
    );

  const initials = customer.name ? customer.name.substring(0, 2).toUpperCase() : 'C';

  return (
    <div className="customer-detail" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', borderBottom: '1px solid #f0ede8', paddingBottom: '24px' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, #b1223a 0%, #8a1a2e 100%)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '28px', boxShadow: '0 8px 16px rgba(177, 34, 58, 0.25)', flexShrink: 0 }}>
            {initials}
        </div>
        <div>
            <h2 style={{ margin: '0 0 6px 0', fontSize: '24px' }}>{customer.name}</h2>
            <span style={{ display: 'inline-block', padding: '4px 12px', background: '#e8ddd3', color: '#4b3a35', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>Cliente Activo</span>
        </div>
      </div>

      <div>
          <h4 style={{ color: '#8a7870', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>Información de Contacto</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ padding: '10px', background: '#f5f0ed', borderRadius: '12px', color: '#b1223a' }}><Phone size={20} /></div>
                  <div><p style={{ margin: 0, fontSize: '12px', color: '#8a7870' }}>Teléfono</p><p style={{ margin: '2px 0 0 0', fontWeight: '500', fontSize: '15px' }}>{customer.phone || 'No registrado'}</p></div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ padding: '10px', background: '#f5f0ed', borderRadius: '12px', color: '#b1223a' }}><Mail size={20} /></div>
                  <div><p style={{ margin: 0, fontSize: '12px', color: '#8a7870' }}>Correo Electrónico</p><p style={{ margin: '2px 0 0 0', fontWeight: '500', fontSize: '15px' }}>{customer.email || 'No registrado'}</p></div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ padding: '10px', background: '#f5f0ed', borderRadius: '12px', color: '#b1223a' }}><MapPin size={20} /></div>
                  <div><p style={{ margin: 0, fontSize: '12px', color: '#8a7870' }}>Ciudad</p><p style={{ margin: '2px 0 0 0', fontWeight: '500', fontSize: '15px' }}>{customer.city || 'No registrada'}</p></div>
              </div>
          </div>
      </div>

      <div>
          <h4 style={{ color: '#8a7870', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>Estadísticas</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ padding: '20px', background: '#fdfcfb', border: '1px solid #f0ede8', borderRadius: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}><div style={{ padding: '8px', background: '#e8ddd3', borderRadius: '10px', color: '#4b3a35' }}><ShoppingBag size={18} /></div><p style={{ margin: 0, fontSize: '13px', color: '#8a7870', fontWeight: '600' }}>Pedidos</p></div>
                  <h3 style={{ margin: 0, fontSize: '26px' }}>{customer.orders || 0}</h3>
              </div>
              <div style={{ padding: '20px', background: '#fdfcfb', border: '1px solid #f0ede8', borderRadius: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}><div style={{ padding: '8px', background: '#e8ddd3', borderRadius: '10px', color: '#4b3a35' }}><DollarSign size={18} /></div><p style={{ margin: 0, fontSize: '13px', color: '#8a7870', fontWeight: '600' }}>Total</p></div>
                  <h3 style={{ margin: 0, fontSize: '26px' }}>${customer.totalPurchased?.toLocaleString() || 0}</h3>
              </div>
          </div>
      </div>
    </div>
  );
}

export default CustomerDetail;
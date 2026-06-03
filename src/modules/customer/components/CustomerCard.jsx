import { MapPin, Phone } from "lucide-react";

function CustomerCard({ customer, onSelect }) {
    const initials = customer.name ? customer.name.substring(0, 2).toUpperCase() : 'C';

    return (
        <div 
            className="card" 
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '16px' }}
            onClick={() => onSelect(customer)}
        >
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#f5f0ed', color: '#b1223a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '16px', flexShrink: 0 }}>
                {initials}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
                <h3 style={{ margin: '0 0 6px 0', fontSize: '16px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{customer.name}</h3>
                <div style={{ display: 'flex', gap: '12px', color: '#8a7870', fontSize: '13px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={14}/> {customer.city || 'Sin ciudad'}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Phone size={14}/> {customer.phone || 'Sin teléfono'}</span>
                </div>
            </div>
        </div>
    );
}

export default CustomerCard;
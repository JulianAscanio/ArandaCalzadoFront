import { useState } from "react";
import AppLayout from "../../../shared/layout/AppLayout";
import CustomerCard from "../components/CustomerCard";
import CustomerDetail from "../components/CustomerDetail";
import CustomerModal from "../components/CustomerModal";
import { useCustomer } from "../context/CustomerContext";
import { Plus, Search, ArrowLeft } from "lucide-react";

export default function CustomerPage() {
    const { customers } = useCustomer();
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    // Filtrado de clientes
    const filteredCustomers = customers?.filter(c => 
        c.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        c.city?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AppLayout title="Clientes">
            <div style={pageStyle}>
                {!selectedCustomer ? (
                <div style={listContainerStyle}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                        <div>
                            <h2 style={{ margin: 0 }}>Directorio</h2>
                            <p style={{ color: "#8a7870", margin: 0, fontSize: "14px" }}>{customers?.length || 0} clientes en total</p>
                        </div>
                        <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }} onClick={() => setIsModalOpen(true)}>
                            <Plus size={18} /> Nuevo Cliente
                        </button>
                    </div>

                    <div className="search-bar" style={{ width: "100%", marginBottom: "20px" }}>
                        <Search className="search-bar__icon" />
                        <input 
                            type="text" 
                            className="search-bar__input" 
                            placeholder="Buscar por nombre o ciudad..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "12px", overflowY: "auto", maxHeight: "calc(100vh - 280px)", paddingRight: "8px" }} className="custom-scrollbar">
                        {filteredCustomers?.length === 0 ? (
                            <div style={{ textAlign: "center", padding: "40px 0", color: "#8a7870" }}><p>No se encontraron clientes.</p></div>
                        ) : (
                            filteredCustomers?.map((customer) => (
                                <div key={customer.id} style={{ border: selectedCustomer?.id === customer.id ? '2px solid #b1223a' : '2px solid transparent', borderRadius: '14px', transition: 'all 0.2s ease' }}>
                                    <CustomerCard customer={customer} onSelect={setSelectedCustomer} />
                                </div>
                            ))
                        )}
                    </div>
                </div>
                ) : (
                    <div style={detailContainerStyle} className="custom-scrollbar">
                        <button 
                            onClick={() => setSelectedCustomer(null)}
                            style={backButtonStyle}
                        >
                            <ArrowLeft size={18} /> Volver al directorio
                        </button>
                        <CustomerDetail customer={selectedCustomer} />
                    </div>
                )}
            </div>

            {isModalOpen && <CustomerModal onClose={() => setIsModalOpen(false)} />}
        </AppLayout>
    );
}

const pageStyle = {
    padding: "24px",
    height: "calc(100vh - 90px)"
};

const listContainerStyle = {
    background: "white",
    padding: "24px",
    borderRadius: "18px",
    boxShadow: "0 8px 22px rgba(0,0,0,0.04)",
    display: "flex",
    flexDirection: "column",
    height: "100%",
    maxWidth: "900px",
    margin: "0 auto"
};

const detailContainerStyle = {
    background: "white",
    padding: "32px",
    borderRadius: "18px",
    boxShadow: "0 8px 22px rgba(0,0,0,0.04)",
    height: "100%",
    overflowY: "auto",
    maxWidth: "900px",
    margin: "0 auto"
};

const backButtonStyle = {
    display: "flex", 
    alignItems: "center", 
    gap: "8px", 
    background: "none", 
    border: "none", 
    color: "#8a7870", 
    cursor: "pointer", 
    marginBottom: "24px", 
    fontWeight: "600", 
    padding: 0
};
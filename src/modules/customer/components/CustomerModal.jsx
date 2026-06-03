import { useState } from "react";
import toast from "react-hot-toast";
import { useCustomer } from "../context/CustomerContext";

export default function CustomerModal({ onClose }) {
    const { addCustomer } = useCustomer();
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [city, setCity] = useState("");
    const [address, setAddress] = useState("");
    
    const [hoveredButton, setHoveredButton] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name || !phone) {
            toast.error("Por favor completa los campos obligatorios");
            return;
        }

        // Armamos el payload plano tal como lo espera el nuevo CustomerSerializer
        const payload = {
            full_name: name,
            email: email,
            phone: phone,
            address: address || "Sin dirección",
            city: city
        };

        try {
            await addCustomer(payload);
            toast.success("Cliente registrado exitosamente");
            onClose();
        } catch (error) {
            console.error("Error detallado:", error);
            toast.error("Error al registrar cliente. Revisa la consola para más detalles.");
        }
    };

    return (
        <div style={overlayStyle} onClick={onClose}>
            <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
                <div style={headerStyle}>
                    <div>
                        <h2 style={{ marginTop: 0, marginBottom: "4px", fontSize: "24px", fontWeight: "700" }}>Nuevo Cliente</h2>
                        <p style={{ color: "#8b7b78", marginBottom: 0, fontSize: "14px", fontWeight: "500" }}>Registra un nuevo contacto en el sistema</p>
                    </div>
                    <button 
                        onClick={onClose}
                        style={closeButtonStyle}
                        title="Cerrar"
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <label style={labelStyle}>Nombre Completo *</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={inputStyle}
                        placeholder="Ej: Distribuidora Central"
                        required
                    />

                    <label style={labelStyle}>Teléfono *</label>
                    <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        style={inputStyle}
                        placeholder="Ej: 300 123 4567"
                        required
                    />

                    <label style={labelStyle}>Correo Electrónico</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={inputStyle}
                        placeholder="Ej: contacto@empresa.com"
                    />

                    <label style={labelStyle}>Dirección</label>
                    <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        style={inputStyle}
                        placeholder="Ej: Calle 123 # 45-67"
                    />

                    <label style={labelStyle}>Ciudad</label>
                    <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        style={inputStyle}
                        placeholder="Ej: Bogotá"
                    />

                    <div style={{ display: "flex", gap: "12px", marginTop: "28px" }}>
                        <button 
                            type="submit" 
                            className="btn-primary"
                            style={confirmButtonStyle}
                        >
                            Guardar Cliente
                        </button>

                        <button 
                            type="button" 
                            onClick={onClose} 
                            className="btn-secondary"
                            style={{
                                ...cancelButtonStyle,
                                background: hoveredButton === "cancel" ? "#dcccc1" : "#e8ddd3",
                            }}
                            onMouseEnter={() => setHoveredButton("cancel")}
                            onMouseLeave={() => setHoveredButton(null)}
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// --- ESTILOS COMPARTIDOS (Basados en el tema de Aranda) ---
const overlayStyle = { position: "fixed", inset: 0, backgroundColor: "rgba(0, 0, 0, 0.4)", display: "flex", justifyContent: "center", alignItems: "center", padding: "20px", animation: "fadeInOverlay 0.3s ease-out", backdropFilter: "blur(2px)", zIndex: 1000 };
const modalStyle = { width: "100%", maxWidth: "460px", maxHeight: "90vh", overflowY: "auto", background: "white", borderRadius: "20px", padding: "32px", boxShadow: "0 20px 60px rgba(0,0,0,0.25)", animation: "slideUpModal 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)", border: "1px solid rgba(255,255,255,0.8)" };
const labelStyle = { display: "block", marginBottom: "8px", marginTop: "0", fontWeight: "600", color: "#2d1f20", fontSize: "14px" };
const headerStyle = { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px", paddingBottom: "16px", borderBottom: "1px solid #f0ede8" };
const closeButtonStyle = { background: "none", border: "none", fontSize: "24px", color: "#b9a39a", cursor: "pointer", padding: "0", width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "8px", transition: "all 0.2s ease" };
const inputStyle = { width: "100%", padding: "14px 16px", border: "2px solid #e8dcd2", borderRadius: "10px", marginBottom: "20px", fontSize: "15px", fontFamily: "inherit", background: "linear-gradient(to bottom, #ffffff, #fffdfb)", color: "#2d1f20", transition: "all 0.3s ease", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.02)", boxSizing: "border-box" };
const confirmButtonStyle = { flex: 1, padding: "14px 16px", borderRadius: "10px", fontWeight: "600", fontSize: "15px", boxShadow: "0 6px 16px rgba(177, 34, 58, 0.25)" };
const cancelButtonStyle = { flex: 1, padding: "14px 16px", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "600", fontSize: "15px", transition: "all 0.3s ease", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)" };
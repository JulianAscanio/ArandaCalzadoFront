import { useState } from "react";
import { useInventory } from "../context/InventoryContext";

export default function MovemmentModal({ material, onClose }) {
    const { registerMovement } = useInventory();

    const [movementType, setMovementType] = useState("entrada");
    const [quantity, setQuantity] = useState("");
    const [reason, setReason] = useState("");
    const [hoveredButton, setHoveredButton] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const numericQuantity = Number(quantity);

        if (!quantity || Number(quantity) <= 0) {
            alert("La cantidad debe ser mayor a 0");
            return;
        }

        if (movementType === "salida" && numericQuantity > material.stock) {
            alert("No hay stock suficiente para registrar la salida");
            return;
        }

        try {
            await registerMovement({
                materialId: material.id,
                materialName: material.name,
                movementType,
                quantity: numericQuantity,
                reason,
            });
            alert("Movimiento registrado correctamente");
            onClose();
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div style={overlayStyle} onClick={onClose}>
            <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
                <div style={headerStyle}>
                    <div>
                        <h2 style={{ marginTop: 0, marginBottom: "4px", fontSize: "24px", fontWeight: "700" }}>Registrar movimiento</h2>
                        <p style={{ color: "#8b7b78", marginBottom: 0, fontSize: "14px", fontWeight: "500" }}>{material.name}</p>
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
                    <label style={labelStyle}>Tipo de movimiento</label>

                    <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
                        <button
                            type="button"
                            onClick={() => setMovementType("entrada")}
                            onMouseEnter={() => setHoveredButton("entrada")}
                            onMouseLeave={() => setHoveredButton(null)}
                            style={{
                                ...typeButtonStyle,
                                backgroundColor:
                                    movementType === "entrada" ? "#0f9d58" : hoveredButton === "entrada" ? "#f0f0f0" : "#f5f5f5",
                                color: movementType === "entrada" ? "white" : "#2d1f20",
                                borderColor: movementType === "entrada" ? "#0f9d58" : "#e8dcd2",
                                boxShadow: movementType === "entrada" ? "0 4px 12px rgba(15, 157, 88, 0.2)" : "0 2px 8px rgba(0, 0, 0, 0.04)",
                                fontWeight: movementType === "entrada" ? "600" : "500",
                            }}
                        >
                            ↑ Entrada
                        </button>

                        <button
                            type="button"
                            onClick={() => setMovementType("salida")}
                            onMouseEnter={() => setHoveredButton("salida")}
                            onMouseLeave={() => setHoveredButton(null)}
                            style={{
                                ...typeButtonStyle,
                                backgroundColor:
                                    movementType === "salida" ? "#b1223a" : hoveredButton === "salida" ? "#f0f0f0" : "#f5f5f5",
                                color: movementType === "salida" ? "white" : "#2d1f20",
                                borderColor: movementType === "salida" ? "#b1223a" : "#e8dcd2",
                                boxShadow: movementType === "salida" ? "0 4px 12px rgba(177, 34, 58, 0.2)" : "0 2px 8px rgba(0, 0, 0, 0.04)",
                                fontWeight: movementType === "salida" ? "600" : "500",
                            }}
                        >
                            ↓ Salida
                        </button>
                    </div>

                    <label style={labelStyle}>Cantidad</label>
                    <input
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        style={inputStyle}
                        placeholder="Ingresa la cantidad"
                    />

                    <label style={labelStyle}>Motivo (opcional)</label>
                    <input
                        type="text"
                        placeholder="Ej: Compra a proveedor"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        style={inputStyle}
                    />

                    <div style={{ display: "flex", gap: "12px", marginTop: "28px" }}>
                        <button 
                            type="submit" 
                            style={confirmButtonStyle}
                            onMouseEnter={() => setHoveredButton("confirm")}
                            onMouseLeave={() => setHoveredButton(null)}
                        >
                            Confirmar
                        </button>

                        <button 
                            type="button" 
                            onClick={onClose} 
                            style={{
                                ...cancelButtonStyle,
                                background: hoveredButton === "cancel" ? "#e8dcd2" : "#f5f0ed",
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

const overlayStyle = {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    animation: "fadeInOverlay 0.3s ease-out",
    backdropFilter: "blur(2px)",
};

const modalStyle = {
    width: "100%",
    maxWidth: "420px",
    background: "white",
    borderRadius: "20px",
    padding: "28px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.6)",
    animation: "slideUpModal 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
    border: "1px solid rgba(255,255,255,0.8)",
};

const labelStyle = {
    display: "block",
    marginBottom: "10px",
    marginTop: "0",
    fontWeight: "600",
    color: "#2d1f20",
    fontSize: "14px",
    textTransform: "capitalize",
};

const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "24px",
    paddingBottom: "16px",
    borderBottom: "1px solid #f0ede8",
};

const closeButtonStyle = {
    background: "none",
    border: "none",
    fontSize: "24px",
    color: "#b9a39a",
    cursor: "pointer",
    padding: "0",
    width: "32px",
    height: "32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "8px",
    transition: "all 0.2s ease",
};

const inputStyle = {
    width: "100%",
    padding: "12px 14px",
    border: "2px solid #e8dcd2",
    borderRadius: "10px",
    marginBottom: "20px",
    fontSize: "15px",
    fontFamily: "inherit",
    background: "linear-gradient(to bottom, #ffffff, #fffdfb)",
    color: "#2d1f20",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
    boxSizing: "border-box",
};

const typeButtonStyle = {
    flex: 1,
    padding: "13px 14px",
    border: "2px solid",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "600",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
};

const confirmButtonStyle = {
    flex: 1,
    padding: "13px 16px",
    background: "linear-gradient(135deg, #0f9d58 0%, #0b7d46 100%)",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "15px",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    boxShadow: "0 6px 16px rgba(15, 157, 88, 0.25)",
};

const cancelButtonStyle = {
    flex: 1,
    padding: "13px 16px",
    background: "#f5f0ed",
    color: "#2d1f20",
    border: "1.5px solid #e8dcd2",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "15px",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
};
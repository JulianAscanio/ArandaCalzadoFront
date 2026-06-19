import { useState } from "react";
import toast from "react-hot-toast";

export default function DateRangeFilter({ onFilter }) {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const handleApply = () => {
        if (!startDate || !endDate) {
            toast.error("Selecciona ambas fechas");
            return;
        }
        if (new Date(startDate) > new Date(endDate)) {
            toast.error("La fecha de inicio no puede ser posterior a la fecha fin");
            return;
        }
        onFilter({ startDate, endDate });
    };

    const handleClear = () => {
        setStartDate("");
        setEndDate("");
        onFilter({ startDate: "", endDate: "" });
    };

    return (
        <div style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            flexWrap: "wrap",
        }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <label style={{ fontSize: "14px", fontWeight: "500", color: "#4b3a35" }}>
                    Desde:
                </label>
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    style={inputStyle}
                />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <label style={{ fontSize: "14px", fontWeight: "500", color: "#4b3a35" }}>
                    Hasta:
                </label>
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    style={inputStyle}
                />
            </div>
            <button onClick={handleApply} style={applyBtnStyle}>
                Aplicar
            </button>
            <button onClick={handleClear} style={clearBtnStyle}>
                Limpiar
            </button>
        </div>
    );
}

const inputStyle = {
    padding: "8px 12px",
    borderRadius: "8px",
    border: "1px solid #e8ddd3",
    fontSize: "14px",
    color: "#4b3a35",
    background: "white",
    outline: "none",
};

const applyBtnStyle = {
    padding: "8px 16px",
    borderRadius: "8px",
    border: "none",
    background: "#b1223a",
    color: "white",
    fontWeight: "600",
    fontSize: "14px",
    cursor: "pointer",
};

const clearBtnStyle = {
    padding: "8px 16px",
    borderRadius: "8px",
    border: "1px solid #e8ddd3",
    background: "white",
    color: "#4b3a35",
    fontWeight: "500",
    fontSize: "14px",
    cursor: "pointer",
};

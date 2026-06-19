import { useMemo, useState } from "react";
import { useReports } from "../context/ReportsContext";
import ReportTable from "../components/ReportTable";
import ReportSummaryCards from "../components/ReportSummaryCards";
import DateRangeFilter from "../components/DateRangeFilter";

const typeColors = {
    entrada: "#27ae60",
    salida: "#e74c3c",
    "creación": "#3498db",
    eliminación: "#e67e22",
};

export default function ConsumptionReportPage() {
    const { movements, loading } = useReports();
    const [dateRange, setDateRange] = useState({ startDate: "", endDate: "" });

    const filteredMovements = useMemo(() => {
        if (!dateRange.startDate || !dateRange.endDate) return movements;

        const start = new Date(dateRange.startDate);
        start.setHours(0, 0, 0, 0);
        const end = new Date(dateRange.endDate);
        end.setHours(23, 59, 59, 999);

        return movements.filter((m) => {
            const mDate = new Date(m.date);
            return mDate >= start && mDate <= end;
        });
    }, [movements, dateRange]);

    const summary = useMemo(() => {
        const entradas = filteredMovements.filter((m) => m.movementType === "entrada");
        const salidas = filteredMovements.filter((m) => m.movementType === "salida");
        const totalEntrada = entradas.reduce((acc, m) => acc + (Number(m.quantity) || 0), 0);
        const totalSalida = salidas.reduce((acc, m) => acc + (Number(m.quantity) || 0), 0);
        return {
            totalMovements: filteredMovements.length,
            totalEntrada,
            totalSalida,
            neto: totalEntrada - totalSalida,
        };
    }, [filteredMovements]);

    const columns = [
        {
            key: "materialName",
            label: "Material",
            render: (val) => <span style={{ fontWeight: "600" }}>{val}</span>,
        },
        {
            key: "movementType",
            label: "Tipo",
            render: (val) => (
                <span style={{
                    padding: "4px 12px",
                    borderRadius: "20px",
                    background: (typeColors[val] || "#999") + "18",
                    color: typeColors[val] || "#999",
                    fontSize: "12px",
                    fontWeight: "600",
                    textTransform: "capitalize",
                }}>
                    {val}
                </span>
            ),
        },
        {
            key: "quantity",
            label: "Cantidad",
            render: (val) => <span style={{ fontWeight: "600" }}>{val}</span>,
        },
        { key: "reason", label: "Motivo" },
        {
            key: "date",
            label: "Fecha",
            render: (val) => <span style={{ fontSize: "13px", color: "#8b7b78" }}>{val}</span>,
        },
    ];

    if (loading) {
        return (
            <div style={{ padding: "40px", textAlign: "center", color: "#6f5d56" }}>
                Cargando reporte de consumo...
            </div>
        );
    }

    return (
        <>
            <div style={{ marginBottom: "20px" }}>
                <DateRangeFilter onFilter={setDateRange} />
            </div>

            <ReportSummaryCards cards={[
                { label: "Total movimientos", value: summary.totalMovements, color: "#4b3a35" },
                { label: "Entradas", value: summary.totalEntrada, color: "#27ae60" },
                { label: "Salidas", value: summary.totalSalida, color: "#e74c3c" },
                { label: "Balance neto", value: summary.neto, color: summary.neto >= 0 ? "#2d6a4f" : "#e74c3c" },
            ]} />

            <ReportTable
                columns={columns}
                rows={filteredMovements}
                emptyMessage="No hay movimientos registrados en el periodo seleccionado."
            />
        </>
    );
}

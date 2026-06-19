export default function ReportTable({ columns, rows, emptyMessage = "No hay datos para mostrar." }) {
    return (
        <div style={{
            background: "white",
            borderRadius: "16px",
            overflow: "hidden",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.03)",
        }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                    <tr style={{ background: "white" }}>
                        {columns.map((col) => (
                            <th key={col.key} style={thStyle}>
                                {col.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, index) => (
                        <tr key={row.id ?? index}>
                            {columns.map((col) => (
                                <td key={col.key} style={tdStyle}>
                                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                                </td>
                            ))}
                        </tr>
                    ))}
                    {rows.length === 0 && (
                        <tr>
                            <td
                                colSpan={columns.length}
                                style={{ textAlign: "center", padding: "30px", color: "#8b7b78" }}
                            >
                                {emptyMessage}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

const thStyle = {
    textAlign: "left",
    padding: "16px 20px",
    borderBottom: "1px solid #f0e8e4",
    color: "#4b3a35",
    fontWeight: "600",
    fontSize: "14px",
};

const tdStyle = {
    padding: "16px 20px",
    borderBottom: "1px solid #f7f2ee",
    verticalAlign: "middle",
    fontSize: "14px",
    color: "#2c2620",
};

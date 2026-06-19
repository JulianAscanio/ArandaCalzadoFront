export default function ReportSummaryCards({ cards }) {
    return (
        <div style={{
            display: "grid",
            gridTemplateColumns: `repeat(${cards.length}, 1fr)`,
            gap: "16px",
            marginBottom: "24px",
        }}>
            {cards.map((card) => (
                <div key={card.label} style={cardStyle}>
                    <span style={{ fontSize: "13px", color: "#8b7b78", fontWeight: "500" }}>
                        {card.label}
                    </span>
                    <span style={{ fontSize: "28px", fontWeight: "700", color: card.color || "#2c2620", marginTop: "4px" }}>
                        {card.value}
                    </span>
                </div>
            ))}
        </div>
    );
}

const cardStyle = {
    background: "white",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
    display: "flex",
    flexDirection: "column",
};

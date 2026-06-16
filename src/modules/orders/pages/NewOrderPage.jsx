import { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppLayout from "../../../shared/layout/AppLayout";
import { useOrders } from "../context/OrdersContext";
import toast from "react-hot-toast";
import { MdArrowBack as ArrowLeft } from "react-icons/md";

export default function NewOrderPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const { orders, customers, products, addOrder, updateOrder, fetchOrders } = useOrders();

  const isEditMode = Boolean(id);

  const [form, setForm] = useState({
    customer: "",
    total: "0",
    status: "pending",
    additional_info: "",
  });

  const [items, setItems] = useState([]);

  // Cargar datos del pedido a editar (si estamos en modo edición)
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedSize, setSelectedSize] = useState("38");
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  useEffect(() => {
    if (isEditMode && orders.length > 0) {
      const orderToEdit = orders.find(
        (item) => String(item.id) === String(id)
      );

      if (orderToEdit) {
        setForm({
          customer: orderToEdit.customer || (orderToEdit.customer_detail?.user?.id) || "",
          total: orderToEdit.total_amount ?? "0",
          status: orderToEdit.status || "pending",
          additional_info: orderToEdit.additional_info || "",
        });
        setItems(orderToEdit.items || []);
      }
    }
  }, [id, isEditMode, orders]);

  // Recalcular total cada vez que cambian los ítems
  useEffect(() => {
    const sum = items.reduce((acc, item) => {
      const price = Number(item.unit_price || item.product_detail?.price || 0);
      return acc + (price * item.quantity);
    }, 0);
    setForm(prev => ({
      ...prev,
      total: sum.toString()
    }));
  }, [items]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!selectedProduct) {
      toast.error("Selecciona un calzado para agregar.");
      return;
    }

    const prod = products.find(p => String(p.id) === String(selectedProduct));
    if (!prod) return;

    // Verificar si ya existe el mismo producto con la misma talla en la lista de ítems
    const existingIndex = items.findIndex(
      (item) => String(item.product || item.product_detail?.id) === String(selectedProduct) &&
                Number(item.size) === Number(selectedSize)
    );

    if (existingIndex > -1) {
      const updated = [...items];
      updated[existingIndex].quantity += Number(selectedQuantity);
      setItems(updated);
    } else {
      setItems([
        ...items,
        {
          product: Number(selectedProduct),
          product_detail: prod,
          quantity: Number(selectedQuantity),
          unit_price: Number(prod.price),
          size: Number(selectedSize),
        }
      ]);
    }

    // Reset entry controls
    setSelectedProduct("");
    setSelectedQuantity(1);
  };

  const handleRemoveItem = (index) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.customer || !form.status) {
      alert("Completa todos los campos obligatorios del pedido");
      return;
    }

    if (items.length === 0) {
      alert("Debes agregar al menos un calzado al pedido");
      return;
    }

    const payload = {
      customer: Number(form.customer),
      status: form.status,
      total_amount: Number(form.total),
      additional_info: form.additional_info,
      items: items.map(item => ({
        product: item.product || item.product_detail?.id,
        quantity: item.quantity,
        unit_price: Number(item.unit_price || item.product_detail?.price || 0),
        size: Number(item.size)
      }))
    };

    try {
      if (isEditMode) {
        await updateOrder(id, payload);
        toast.success("Pedido actualizado correctamente");
      } else {
        await addOrder(payload);
        toast.success("Pedido registrado correctamente");
      }

      navigate("/pedidos");
    } catch (error) {
      console.error(error);
      toast.error("Ocurrió un error al guardar el pedido");
    }
  };

  return (
    <AppLayout title={isEditMode ? "Editar pedido" : "Nuevo pedido"}>
      <div style={pageStyle}>
        <div style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
            <div>
              <h1 style={{ marginTop: 0, marginBottom: "8px" }}>
                {isEditMode ? "Editar pedido" : "Registrar nuevo pedido"}
              </h1>
              <p style={{ color: "#6f5d56", margin: 0 }}>
                {isEditMode
                  ? "Actualiza la información del pedido"
                  : "Agrega un nuevo pedido"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate("/pedidos")}
              style={{ ...cancelButtonStyle, display: "flex", alignItems: "center", gap: "6px", padding: "8px 12px" }}
            >
              <ArrowLeft size={16} /> Volver
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={rowStyle}>
              <div>
                <label style={labelStyle}>Cliente *</label>
                <select
                  style={inputStyle}
                  name="customer"
                  value={form.customer}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecciona un cliente</option>
                  {customers?.map(customer => {
                    const displayName = customer.name || customer.full_name || `${customer.user?.first_name || ''} ${customer.user?.last_name || ''}`.trim() || "Cliente Desconocido";
                    const displayInfo = customer.email || customer.user?.username || "";
                    return (
                      <option key={customer.id} value={customer.id}>
                        {displayName} {displayInfo ? `(${displayInfo})` : ""}
                      </option>
                    );
                  })}
                </select>
              </div>
              
            </div>

            <div style={{ ...rowStyle, gridTemplateColumns: "1fr" }}>
              <div>
                <label style={labelStyle}>Información Adicional (Dirección, Observaciones)</label>
                <input
                  style={inputStyle}
                  type="text"
                  name="additional_info"
                  value={form.additional_info}
                  onChange={handleChange}
                  placeholder="Ej: Entrega urgente en la tarde"
                />
              </div>
            </div>

            {/* SECCIÓN AGREGAR CALZADO */}
            <div style={{
              margin: "24px 0",
              padding: "20px",
              background: "#fdfbfa",
              borderRadius: "14px",
              border: "1.5px dashed #e8ded8"
            }}>
              <h3 style={{ marginTop: 0, marginBottom: "14px", color: "#4b3a35" }}>Añadir calzado al pedido</h3>
              <div style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr 1fr auto",
                gap: "12px",
                alignItems: "end"
              }}>
                <div>
                  <label style={{ ...labelStyle, marginTop: 0 }}>Zapato (Diseño/Referencia)</label>
                  <select
                    style={inputStyle}
                    value={selectedProduct}
                    onChange={(e) => setSelectedProduct(e.target.value)}
                  >
                    <option value="">Selecciona un diseño</option>
                    {products?.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.reference} - {p.name} ({p.heel_height}) - {formatCurrency(p.price)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ ...labelStyle, marginTop: 0 }}>Talla</label>
                  <select
                    style={inputStyle}
                    value={selectedSize}
                    onChange={(e) => setSelectedSize(e.target.value)}
                  >
                    <option value="35">35</option>
                    <option value="36">36</option>
                    <option value="37">37</option>
                    <option value="38">38</option>
                    <option value="39">39</option>
                    <option value="40">40</option>
                  </select>
                </div>

                <div>
                  <label style={{ ...labelStyle, marginTop: 0 }}>Cantidad</label>
                  <input
                    style={inputStyle}
                    type="number"
                    min="1"
                    value={selectedQuantity}
                    onChange={(e) => setSelectedQuantity(e.target.value)}
                  />
                </div>

                <button
                  type="button"
                  onClick={handleAddItem}
                  style={{
                    ...saveButtonStyle,
                    background: "#4b3a35",
                    height: "44px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  + Agregar
                </button>
              </div>
            </div>

            {/* TABLA DE ÍTEMS AGREGADOS */}
            <h3 style={{ color: "#4b3a35", marginBottom: "12px" }}>Artículos en este pedido</h3>
            <div style={{ overflowX: "auto", marginBottom: "20px" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", background: "white", borderRadius: "10px", overflow: "hidden" }}>
                <thead>
                  <tr style={{ background: "#f7f2ee", textAlign: "left" }}>
                    <th style={{ padding: "10px", borderBottom: "1px solid #e8ded8" }}>Referencia</th>
                    <th style={{ padding: "10px", borderBottom: "1px solid #e8ded8" }}>Zapato</th>
                    <th style={{ padding: "10px", borderBottom: "1px solid #e8ded8" }}>Talla</th>
                    <th style={{ padding: "10px", borderBottom: "1px solid #e8ded8" }}>Cantidad</th>
                    <th style={{ padding: "10px", borderBottom: "1px solid #e8ded8" }}>P. Unitario</th>
                    <th style={{ padding: "10px", borderBottom: "1px solid #e8ded8" }}>Subtotal</th>
                    <th style={{ padding: "10px", borderBottom: "1px solid #e8ded8", textAlign: "center" }}>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {items.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{ padding: "20px", textAlign: "center", color: "#8b7b78", fontStyle: "italic" }}>
                        No has añadido ningún calzado al pedido todavía.
                      </td>
                    </tr>
                  ) : (
                    items.map((item, idx) => {
                      const prodDetail = item.product_detail;
                      const ref = prodDetail?.reference || "N/A";
                      const name = prodDetail?.name || "Desconocido";
                      const price = Number(item.unit_price || prodDetail?.price || 0);
                      const subtotal = price * item.quantity;
                      return (
                        <tr key={idx} style={{ borderBottom: "1px solid #f7f2ee" }}>
                          <td style={{ padding: "10px" }}>{ref}</td>
                          <td style={{ padding: "10px" }}>{name}</td>
                          <td style={{ padding: "10px" }}>{item.size}</td>
                          <td style={{ padding: "10px" }}>{item.quantity}</td>
                          <td style={{ padding: "10px" }}>{formatCurrency(price)}</td>
                          <td style={{ padding: "10px", fontWeight: "600" }}>{formatCurrency(subtotal)}</td>
                          <td style={{ padding: "10px", textAlign: "center" }}>
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(idx)}
                              style={{
                                background: "none",
                                border: "none",
                                color: "#b1223a",
                                cursor: "pointer",
                                padding: "4px 8px",
                                fontWeight: "600"
                              }}
                            >
                              Remover
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            <div style={rowStyle}>
              <div>
                <label style={labelStyle}>Monto Total del Pedido</label>
                <input
                  style={{ ...inputStyle, fontWeight: "bold", color: "#b1223a", fontSize: "16px" }}
                  type="text"
                  name="total"
                  value={formatCurrency(Number(form.total))}
                  readOnly
                />
              </div>
            </div>

            <div style={actionsStyle}>
              <button type="submit" style={saveButtonStyle}>
                {isEditMode ? "Actualizar pedido" : "Guardar pedido"}
              </button>

              <button
                type="button"
                style={cancelButtonStyle}
                onClick={() => navigate("/pedidos")}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}

const pageStyle = {
  padding: "30px",
};

const cardStyle = {
  maxWidth: "900px",
  background: "white",
  padding: "28px",
  borderRadius: "18px",
  boxShadow: "0 8px 22px rgba(0,0,0,0.06)",
};

const labelStyle = {
  display: "block",
  marginBottom: "8px",
  marginTop: "14px",
  fontWeight: "600",
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  borderRadius: "12px",
  border: "1px solid #d8ccc4",
  boxSizing: "border-box",
};

const rowStyle = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "16px",
};

const actionsStyle = {
  display: "flex",
  gap: "12px",
  marginTop: "24px",
};

const saveButtonStyle = {
  border: "none",
  background: "#b1223a",
  color: "white",
  padding: "12px 18px",
  borderRadius: "12px",
  cursor: "pointer",
};

const cancelButtonStyle = {
  border: "none",
  background: "#e8ded8",
  color: "#4b3a35",
  padding: "12px 18px",
  borderRadius: "12px",
  cursor: "pointer",
};
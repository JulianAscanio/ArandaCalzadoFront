import { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppLayout from "../../../shared/layout/AppLayout";
import { useOrders } from "../context/OrdersContext";

export default function NewOrderPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const { orders, customers, products, addOrder, updateOrder } = useOrders();

  const isEditMode = Boolean(id);

  const [form, setForm] = useState({
    customer: "",
    product: "",
    quantity: 1,
    total: "",
    status: "",
    additional_info: "",
  });

  useEffect(() => {
    if (isEditMode && orders.length > 0) {
      const orderToEdit = orders.find(
        (item) => String(item.id) === String(id)
      );

      if (orderToEdit) {
        setForm({
          customer: orderToEdit.customer || (orderToEdit.customer_detail?.user?.id) || "",
          product: orderToEdit.items?.[0]?.product || (orderToEdit.items?.[0]?.product_detail?.id) || "",
          quantity: orderToEdit.items?.[0]?.quantity || 1,
          total: orderToEdit.total_amount ?? "",
          status: orderToEdit.status || "pending",
          additional_info: orderToEdit.additional_info || "",
        });
      }
    }
  }, [id, isEditMode, orders]);

  // Calculate total automatically when product or quantity changes
  useEffect(() => {
    if (form.product && form.quantity) {
      const selectedProduct = products.find(p => String(p.id) === String(form.product));
      if (selectedProduct) {
        setForm(prev => ({
          ...prev,
          total: (selectedProduct.price * prev.quantity).toString()
        }));
      }
    }
  }, [form.product, form.quantity, products]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.customer ||
      !form.product ||
      !form.quantity ||
      !form.total ||
      !form.status
    ) {
      alert("Completa todos los campos obligatorios");
      return;
    }

    const selectedProduct = products.find(p => String(p.id) === String(form.product));

    const payload = {
      customer: Number(form.customer),
      status: form.status,
      total_amount: Number(form.total),
      additional_info: form.additional_info,
      items: [
        {
          product: Number(form.product),
          quantity: Number(form.quantity),
          unit_price: selectedProduct ? selectedProduct.price : 0
        }
      ]
    };

    try {
      if (isEditMode) {
        await updateOrder(id, payload);
        alert("Pedido actualizado correctamente");
      } else {
        await addOrder(payload);
        alert("Pedido registrado correctamente");
      }

      navigate("/pedidos");
    } catch (error) {
      console.error(error);
      alert("Ocurrió un error al guardar el pedido");
    }
  };

  return (
    <AppLayout title={isEditMode ? "Editar pedido" : "Nuevo pedido"}>
      <div style={pageStyle}>
        <div style={cardStyle}>
          <h1 style={{ marginTop: 0, marginBottom: "8px" }}>
            {isEditMode ? "Editar pedido" : "Registrar nuevo pedido"}
          </h1>
          <p style={{ color: "#6f5d56", marginBottom: "24px" }}>
            {isEditMode
              ? "Actualiza la información del pedido"
              : "Agrega un nuevo pedido"}
          </p>

          <form onSubmit={handleSubmit}>
            <div style={rowStyle}>
              <div>
                <label style={labelStyle}>Cliente</label>
                <select
                  style={inputStyle}
                  name="customer"
                  value={form.customer}
                  onChange={handleChange}
                >
                  <option value="">Selecciona un cliente</option>
                  {customers?.map(customer => (
                    <option key={customer.id} value={customer.id}>
                      {customer.user?.first_name} {customer.user?.last_name} ({customer.user?.username})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={labelStyle}>Estado del Pedido</label>
                <select
                  style={inputStyle}
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                >
                  <option value="" disabled>
                    Seleccione estado del pedido
                  </option>
                  <option value="pending">Pendiente</option>
                  <option value="in_production">En Producción</option>
                  <option value="finished">Terminado</option>
                  <option value="sent">Enviado</option>
                </select>
              </div>
            </div>

            <div style={rowStyle}>
              <div>
                <label style={labelStyle}>Producto</label>
                <select
                  style={inputStyle}
                  name="product"
                  value={form.product}
                  onChange={handleChange}
                >
                  <option value="">Selecciona un producto</option>
                  {products?.map(product => (
                    <option key={product.id} value={product.id}>
                      {product.name} (Talla: {product.size}) - ${product.price}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={labelStyle}>Cantidad</label>
                <input
                  style={inputStyle}
                  type="number"
                  min="1"
                  name="quantity"
                  value={form.quantity}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div style={rowStyle}>
              <div>
                <label style={labelStyle}>Monto Total</label>
                <input
                  style={inputStyle}
                  type="number"
                  min="0"
                  step="0.01"
                  name="total"
                  value={form.total}
                  onChange={handleChange}
                  readOnly
                />
              </div>

              <div>
                <label style={labelStyle}>Información Adicional</label>
                <input
                  style={inputStyle}
                  type="text"
                  name="additional_info"
                  value={form.additional_info}
                  onChange={handleChange}
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
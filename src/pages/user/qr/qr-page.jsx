import { useParams, useNavigate } from "react-router-dom";
import "./qr-page.css";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { useState, useEffect } from "react";
import Loader from "@components/loader/loader";
import { API_URL } from "@config/api";

function QRPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [qrCode, setQrCode] = useState(null);
  const [numeroPedido, setNumeroPedido] = useState("");

  useEffect(() => {
    const fetchQR = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(`${API_URL}/orders/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        console.log("QR recibido:", data.qr_code);

        if (data.qr_code) {
          setQrCode(data.qr_code);
          setNumeroPedido(data.order.numero_pedido);
        }

      } catch (error) {
        console.error("Error al cargar QR:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQR();
  }, [id]);

  if (loading) {
    return <Loader text="Cargando código QR..." />;
  }

  return (
    <div className="qr-container">
      <div className="qr-card">

        <div className="qr-header">
          <button
            className="back-button"
            type="button"
            onClick={() => navigate(-1)}
          >
            <AiOutlineArrowLeft size={20} />
          </button>
          <h2 className="qr-titulo">Código QR</h2>
        </div>

        <div className="qr-content">
          <p>
            Este es el código QR para tu pedido <strong>#{numeroPedido}</strong>
          </p>

          {qrCode ? (
            <img src={qrCode} alt="QR"/>
          ) : (
            <p>No se pudo cargar el QR.</p>
          )}
        </div>

      </div>
    </div>
  );
}

export default QRPage;

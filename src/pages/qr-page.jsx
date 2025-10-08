import { useParams, useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import Navbar from "@components/navbar";
import "@styles/qr-page.css";
import { AiOutlineArrowLeft } from "react-icons/ai";
import Footer from "@components/footer";

function QRPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <div className="qr-container">
        <div className="qr-card">
          {/* Encabezado con flecha */}
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

          {/* Contenido del QR */}
          <div className="qr-content">
            <p>
              Este es el código QR para tu pedido <strong>#{id}</strong>
            </p>
            <QRCodeCanvas value={`Pedido-${id}`} size={220} />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default QRPage;




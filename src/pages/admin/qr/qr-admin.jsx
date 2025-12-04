import { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import { Html5Qrcode, Html5QrcodeScannerState } from "html5-qrcode";
import { API_URL } from "@config/api";
import "./qr-admin.css";

export default function QRAdmin() {
  const [codigo, setCodigo] = useState("");
  const scannerRef = useRef(null);
  const isProcessingRef = useRef(false);
  const initializedRef = useRef(false);
  const [mensaje, setMensaje] = useState("");
  const [mensajeTipo, setMensajeTipo] = useState(""); 

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const scanner = new Html5Qrcode("qr-reader");
    scannerRef.current = scanner;

    scanner
      .start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        onScanSuccess
      )
      .catch((err) => {
        console.error("Error al iniciar scanner:", err);
        toast.error("No se pudo iniciar la cámara");
        setMensaje("No se pudo iniciar la cámara");
        setMensajeTipo("error");
        setTimeout(() => setMensaje(""), 5000);
      });

    return () => {
      if (scannerRef.current) {
        try {
          const state = scannerRef.current.getState();
          if (
            state === Html5QrcodeScannerState.STARTED ||
            state === Html5QrcodeScannerState.PAUSED
          ) {
            scannerRef.current.stop();
          }
          scannerRef.current.clear();
        } catch (err) {
          console.warn("Error al limpiar scanner:", err);
        }
      }
    };
  }, []);

  const onScanSuccess = async (decodedText) => {
    if (isProcessingRef.current) return;

    isProcessingRef.current = true;
    setCodigo(decodedText);

    await procesarCodigo(decodedText);

    // Pausar escaneo por unos segundos
    if (scannerRef.current) {
      try {
        scannerRef.current.pause();
        setTimeout(() => {
          try {
            scannerRef.current.resume();
            isProcessingRef.current = false;
          } catch (err) {
            console.warn("Error al reanudar scanner:", err);
          }
        }, 3000);
      } catch (err) {
        console.warn("Error al pausar scanner:", err);
      }
    }
  };

  const procesarCodigo = async (codigoLeido) => {
    if (!codigoLeido.trim()) {
      isProcessingRef.current = false;
      setMensaje("Código inválido");
      setMensajeTipo("error");
      setTimeout(() => setMensaje(""), 5000);
      return toast.error("Código inválido");
    }

    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${API_URL}/orders/${codigoLeido}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok || !data.success || !data.order) {
        isProcessingRef.current = false;
        setMensaje("Pedido no encontrado");
        setMensajeTipo("error");
        setTimeout(() => setMensaje(""), 5000);
        return toast.error(data.message || "Pedido no encontrado");
      }

      const pedido = data.order;

      if (pedido.estado?.toLowerCase() === "entregado") {
        toast.info(`El pedido #${pedido.id} ya fue entregado`);
        setMensaje(`El pedido #${pedido.id} ya estaba entregado`);
        setMensajeTipo("info");
        setTimeout(() => setMensaje(""), 5000);
        setCodigo(""); 
        return;
      }

      const resUpdate = await fetch(`${API_URL}/orders/${pedido.id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ estado: "entregado" }),
      });

      const dataUpdate = await resUpdate.json();

      if (!resUpdate.ok) {
        throw new Error(dataUpdate.message);
      }

      toast.success(`Pedido #${pedido.id} marcado como ENTREGADO ✔`);
      setMensaje(`Pedido #${pedido.id} marcado como ENTREGADO ✔`);
      setMensajeTipo("success");
      setTimeout(() => setMensaje(""), 5000);
      setCodigo("");
    } catch (err) {
      setMensaje("Error: " + err.message);
      setMensajeTipo("error");
      setTimeout(() => setMensaje(""), 5000);
      toast.error("Error: " + err.message);
    }
  };

  const manejarEscaneo = async (e) => {
    e.preventDefault();
    isProcessingRef.current = true;
    await procesarCodigo(codigo);
    isProcessingRef.current = false;
  };

  return (
    <div className="admin-qr-container">
      <h1 className="admin-qr-titulo">Escaneo de QR</h1>

      <div id="qr-reader" style={{ width: "300px", margin: "0 auto" }}></div>

      {mensaje && (
        <p className={`admin-qr-mensaje ${mensajeTipo}`}>{mensaje}</p>
      )}

      <form className="admin-qr-form" onSubmit={manejarEscaneo}>
        <input
          type="text"
          className="admin-qr-input"
          placeholder="Ingresar número de pedido (ej: 1)"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
        />
        <button type="submit" className="admin-qr-boton">
          Procesar código
        </button>
      </form>
    </div>
  );
}

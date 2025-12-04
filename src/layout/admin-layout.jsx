import React, { useEffect } from "react";
import { io } from "socket.io-client";
import { toast } from "react-toastify";
import AdminSidebar from "@admincomponents/sidebar/admin-sidebar.jsx";
import { API_URL } from "@config/api";

function AdminLayout({ children }) {
  useEffect(() => {
    const socket = io(API_URL.replace("/api", ""), {
      transports: ["websocket"],
    });

    socket.on("nuevo_pedido", (pedido) => {
      toast.info(`Nuevo pedido de ${pedido.user} - Total: $${pedido.total}`);
      new Audio("/sounds/notification.mp3").play();
    });

    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    const audio = new Audio("/sounds/notification.mp3");

    const enableAudio = () => {
      audio.play().catch(() => {
      });
      document.removeEventListener("click", enableAudio);
    };

    document.addEventListener("click", enableAudio);

    return () => {
      document.removeEventListener("click", enableAudio);
    };
  }, []);

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <AdminSidebar />
      <main style={{ flex: 1 }}>{children}</main>
    </div>
  );
}

export default AdminLayout;

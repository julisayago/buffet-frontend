import "./home.css";
import ProductCard from "@usercomponents/product-card/product-card";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { API_URL } from "@config/api";
import { handleAddToCart } from "@userpages/carrito/carrito";

function Home() {
  const navigate = useNavigate();

  const [categorias, setCategorias] = useState([]);
  const [promociones, setPromociones] = useState([]);
  const [loadingPromos, setLoadingPromos] = useState(true);
  const [mensaje, setMensaje] = useState("");

  // Traer categorías
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const res = await fetch(`${API_URL}/categories`);
        if (!res.ok) throw new Error("Error al traer categorías");
        const data = await res.json();

        const categoriasBack = data.categories.map((cat) => ({
          id: cat.id,
          nombre: cat.nombre.charAt(0).toUpperCase() + cat.nombre.slice(1),
        }));

        setCategorias([{ id: "all", nombre: "Todo" }, ...categoriasBack]);
      } catch (error) {
        console.error("Error cargando categorías:", error);
      }
    };
    fetchCategorias();
  }, []);

  // Traer productos en promoción
  useEffect(() => {
    const fetchPromociones = async () => {
      try {
        const res = await fetch(`${API_URL}/products?promociones=true`);
        if (!res.ok) throw new Error("Error al traer promociones");
        const data = await res.json();
        setPromociones(data.products);
      } catch (error) {
        console.error("Error cargando promociones:", error);
      } finally {
        setLoadingPromos(false);
      }
    };
    fetchPromociones();
  }, []);

  // Carrusel automático del Hero
  useEffect(() => {
    let slideIndex = 0;
    const slides = document.querySelectorAll(".hero-slide");
    const dots = document.querySelectorAll(".dot");

    const showSlide = (n) => {
      slides.forEach((slide, i) => {
        slide.classList.remove("active");
        dots[i].classList.remove("active");
        if (i === n) {
          slide.classList.add("active");
          dots[i].classList.add("active");
        }
      });
    };

    const nextSlide = () => {
      slideIndex = (slideIndex + 1) % slides.length;
      showSlide(slideIndex);
    };

    const prevSlide = () => {
      slideIndex = (slideIndex - 1 + slides.length) % slides.length;
      showSlide(slideIndex);
    };

    const interval = setInterval(nextSlide, 5000);

    document.querySelector(".hero-next").onclick = nextSlide;
    document.querySelector(".hero-prev").onclick = prevSlide;
    dots.forEach((dot, i) => (dot.onclick = () => showSlide((slideIndex = i))));

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="home-container">
      {/* Hero Carrusel */}
      <section className="hero-carousel">
        <div className="hero-slide active">
          <div className="hero-content">
            <h1>Buffet UNaB</h1>
            <p>Disfrutá de la mejor comida con variedad y calidad</p>
            <button
              className="btn-primary"
              onClick={() => navigate("/productos")}
            >
              Ver productos
            </button>
          </div>
        </div>

        <div className="hero-slide">
          <div className="hero-content">
            <h1>Sabores que te acompañan</h1>
            <p>Desde el desayuno hasta la merienda</p>
            <button
              className="btn-primary"
              onClick={() => navigate("/productos")}
            >
              Ver menú
            </button>
          </div>
        </div>

        <div className="hero-slide">
          <div className="hero-content">
            <h1>Pedidos rápidos</h1>
            <p>Hacé tu pedido sin filas ni esperas</p>
            <button
              className="btn-primary"
              onClick={() => navigate("/productos")}
            >
              Pedir ahora
            </button>
          </div>
        </div>

        <button className="hero-prev">&#10094;</button>
        <button className="hero-next">&#10095;</button>

        <div className="hero-dots">
          <span className="dot active"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </div>
      </section>

      {/* Banners */}
      <section className="home-banners">
        <div className="banner-card">
          <img src="/home/card-image-1.png" alt="Promo del día" />
          <div className="banner-text">
            <h3>Pedí desde tu aula</h3>
            <p>Sin filas, sin esperas</p>
          </div>
        </div>

        <div className="banner-card">
          <img src="/home/card-image-2.png" alt="Desayuno" />
          <div className="banner-text">
            <h3>Un Desayuno Perfecto</h3>
            <p>Para tu mañana</p>
          </div>
        </div>

        <div className="banner-card">
          <img src="/home/card-image-3.png" alt="Snacks" />
          <div className="banner-text">
            <h3>Promo Snacks</h3>
            <p>¡No te lo pierdas!</p>
          </div>
        </div>

        <div className="banner-card">
          <img src="/home/card-image-4.png" alt="Desayuno" />
          <div className="banner-text">
            <h3>Refresca tu día</h3>
            <p>Variedad de bebidas para elegir</p>
          </div>
        </div>
      </section>

      {/* Categorías */}
      <section className="home-categorias-section">
        <h2>Categorías</h2>
        <div className="home-categorias-list">
          {categorias.map((cat) => (
            <div
              key={cat.id}
              className="home-categoria-card"
              onClick={() => navigate("/productos")}
            >
              <span className="home-categoria-nombre">{cat.nombre}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Banner Café */}
      <section className="home-banner-cafe">
        <div className="banner-cafe">
          <img src="/home/banner-Buffet.png" alt="Banner Buffet" />
          <div className="banner-cafe-text">
            <h2>Promociones del Buffet</h2>
            <p>Por compras superiores a $5.000 obtené un café gratis</p>
            <button
              className="btn-banner"
              onClick={() => navigate("/productos")}
            >
              Pedir ahora
            </button>
          </div>
        </div>
      </section>
      {mensaje && <div className="mensaje-carrito">{mensaje}</div>}
      {/* Promociones dinámicas */}
      <section className="promociones-section">
        <h2>Promociones</h2>
        {loadingPromos ? (
          <p>Cargando promociones...</p>
        ) : (
          <div className="promociones-productos-grid">
            {promociones.length > 0 ? (
              promociones.map((promo) => (
                <ProductCard
                  key={promo.id}
                  producto={promo}
                  onAddToCart={() => handleAddToCart(promo, setMensaje)}
                />
              ))
            ) : (
              <p>No hay promociones disponibles.</p>
            )}
          </div>
        )}
      </section>

      {/* Banners Promocionales Buffet */}
      <section className="home-banners-buffet">
        <div className="buffet-banner-item">
          <div className="buffet-banner-text">
            <h3>
              HASTA <span>20% OFF</span>
            </h3>
            <p>En combos de almuerzo</p>
            <div className="banner-extra">Con pedidos desde el aula </div>
          </div>
          <div className="buffet-banner-img">
            <img src="/home/banner-combo.png" alt="Combo de almuerzo" />
          </div>
        </div>

        <div className="buffet-banner-item">
          <div className="buffet-banner-text">
            <h3>
              <span>2x1</span> EN DESAYUNOS
            </h3>
            <p>De 8:00 a 10:00 hs</p>
            <div className="banner-extra">Con café o medialunas </div>
          </div>
          <div className="buffet-banner-img">
            <img src="/home/banner-desayuno.png" alt="Desayuno Buffet" />
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;

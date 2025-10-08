import Navbar from '@components/navbar.jsx';
import Footer from '@components/footer.jsx';
import '@styles/home.css';
import ProductCard from "@components/product-card";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const categorias = [
    { id: "bebidas", nombre: "Bebidas", img: "/src/assets/categorias/soda.png" },
    { id: "golosinas", nombre: "Golosinas", img: "/src/assets/categorias/candy.png" },
    { id: "sandwiches", nombre: "Sándwiches", img: "/src/assets/categorias/sandwich.png" },
    { id: "snacks", nombre: "Snacks", img: "/src/assets/categorias/potato-chips.png" },
    { id: "postres", nombre: "Postres", img: "/src/assets/categorias/cookie.png" },
  ];

  const promociones = [
    { id: 1, nombre: "Café + 2 medialunas", precio: 2000, categoria: "bebidas", img: "/assets/cafe-medialunas.png" },
    { id: 2, nombre: "Sándwich + Coca-Cola", precio: 2500, categoria: "sandwiches", img: "/assets/sandwich-coca.png" },
    { id: 3, nombre: "Hamburguesa + papas", precio: 3500, categoria: "sandwiches", img: "/assets/hamburguesa-papas.png" },
    { id: 4, nombre: "Ensalada fresca", precio: 2100, categoria: "snacks", img: "/assets/ensalada.png" },
    { id: 5, nombre: "Brownie", precio: 1200, categoria: "postres", img: "/assets/brownie.png" },
    { id: 5, nombre: "Chocolate", precio: 1200, categoria: "golosinas", img: "/assets/chocolate.png" }
  ];

  // Función para añadir productos (Promociones)
  const handleAddToCart = (producto) => {
    console.log("Añadido al carrito:", producto);
  };

  return (
    <>
      <Navbar />
      <main className="home-container">

        {/* Hero */}
        <section className="hero">
          <h1>Buffet UNaB</h1>
          <p>Disfrutá de la mejor comida con variedad y calidad</p>
          <button className="btn-primary" onClick={() => navigate("/productos")}>
            Ver productos
          </button>
        </section>

        {/* Banners */}
        <section className="home-banners">
          <div className="banner-card">
            <img src="/src/assets/card-image-1.png" alt="Promo del día" />
            <div className="banner-text">
              <h3>Pedí desde tu aula</h3>
              <p>Sin filas, sin esperas</p>
              <button className="btn-secondary" onClick={() => navigate("/productos")}> Ver productos</button>
            </div>
          </div>

          <div className="banner-card">
            <img src="/src/assets/card-image-2.png" alt="Desayuno" />
            <div className="banner-text">
              <h3>Un Desayuno Perfecto</h3>
              <p>Para tu mañana</p>
              <button className="btn-secondary"onClick={() => navigate("/productos")}> Ver más</button>
            </div>
          </div>

          <div className="banner-card">
            <img src="/src/assets/card-image-3.png" alt="Snacks" />
            <div className="banner-text">
              <h3>Promo Snacks</h3>
              <p>¡No te lo pierdas!</p>
              <button className="btn-secondary" onClick={() => navigate("/productos")}> Ver más</button>
            </div>
          </div>

          <div className="banner-card">
            <img src="/src/assets/card-image-4.png" alt="Desayuno" />
            <div className="banner-text">
              <h3>Refresca tu día</h3>
              <p>Variedad de bebidas para elegir</p>
              <button className="btn-secondary"onClick={() => navigate("/productos")}> Ver más</button>
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
                <div className="home-categoria-icon">
                  <img src={cat.img} alt={cat.nombre} />
                </div>
                <span>{cat.nombre}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Promociones */}
        <section className="promociones-section">
          <h2>Promociones </h2>
          <div className="promociones-productos-grid">
            {promociones.map((promo) => (
              <ProductCard key={promo.id} producto={promo} onAddToCart={handleAddToCart} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default Home;

import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../../NavBar/NavBar";
import { Link } from "react-router-dom";
import Footer from "../../Footer/Footer";

const AirpodsUsed = () => {
  const [AirpodsProducts, setAirpodsProducts] = useState([]);
  const [productImages, setProductImages] = useState({});

  useEffect(() => {
    const fetchAirpodsProducts = async () => {
      try {
        const responses = await Promise.all([
          axios.get(
            "https://back-endtiendamacandtiendam-production.up.railway.app/products/category/Audifonos/subcategory/Auriculares/name/AirPods%20Pro%20(2.ª generación)%20con%20estuche%20MagSafe%20(USB-C)"
          ),
        ]);
        const products = responses.flatMap((response) => response.data);
        setAirpodsProducts(products);
        products.forEach(async (product) => {
          try {
            const imageResponse = await axios.get(
              `https://back-endtiendamacandtiendam-production.up.railway.app/products/${product.id}/images`
            );
            const imageFileNames = imageResponse.data;
            const imageUrls = imageFileNames.map(
              (fileName) =>
                `https://back-endtiendamacandtiendam-production.up.railway.app/images/${fileName}`
            );
            setProductImages((prevState) => ({
              ...prevState,
              [product.id]: imageUrls,
            }));
          } catch (error) {
            console.error(
              `Error getting images for product ${product.id}:`,
              error
            );
          }
        });
      } catch (error) {
        console.error("Error fetching Airpods products:", error);
      }
    };
    fetchAirpodsProducts();
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
    }).format(price);
  };

  return (
    <div className="Airpods-products">
      <Navbar />
      <div className="container py-5">
        <h1 className="text-center mb-4 fs-4" style={{ color: "black" }}>
          Airpods Usados
        </h1>
        <h2 className="text-center mb-4 fs-4" style={{ color: "black" }}>
          Productos no disponibles en el momento
        </h2>
        {/* <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {AirpodsProducts.map((product) => (
            <div className="col" key={product.id}>
              <a href={`/detalle-producto/${product.id}`} className="text-decoration-none">
                <div className="card h-100 small-card">
                  <div className="card-img-top ratio ratio-16x9 border border-secondary rounded-top">
                    {productImages[product.id] && productImages[product.id][0] && (
                      <img src={productImages[product.id][0]} alt={`Product ${product.name}`} className="img-fluid rounded-top" />
                    )}
                  </div>
                  <div className="card-body d-flex flex-column">
                    <h5 className="text-lg font-semibold mb-2 line-clamp-2">{product.name}</h5>
                    <p className="card-text fs-7 text-truncate">Almacenamiento Interno: <strong>{product.capacityName}</strong></p>
                    <p className="card-text fs-7 text-truncate">Color: <strong>{product.colorName}</strong></p>
                    <p className="card-text fs-7 text-truncate">Precio: <strong>{formatPrice(product.price)}</strong></p>
                    <div className="mt-auto d-flex justify-content-between">
                      <span className="btn btn-primary btn-sm">Comprar</span>
                    </div>
                  </div>
                </div>
              </a>
            </div>
          ))}
        </div> */}
      </div>
      <Footer />
    </div>
  );
};

export default AirpodsUsed;

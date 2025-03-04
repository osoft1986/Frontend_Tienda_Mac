import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../../NavBar/NavBar";
import Footer from "../../Footer/Footer";
import { Link } from "react-router-dom";

const AppleTV4k = () => {
  const [iphoneProducts, setIphoneProducts] = useState([]);
  const [productImages, setProductImages] = useState({});

  useEffect(() => {
    const fetchIphoneProducts = async () => {
      try {
        const responses = await Promise.all([
          axios.get(
            "https://back-endtiendamacandtiendam-production.up.railway.app/products/category/Televisores/subcategory/AppleTV/name/Apple%20TV%204K"
          ), // Agregar la URL correspondiente aquí
        ]);

        const products = responses.flatMap((response) => response.data);
        setIphoneProducts(products);

        // Fetch images for all products
        await fetchProductImages(products);
      } catch (error) {
        console.error("Error fetching iPhone products:", error);
      }
    };

    const fetchProductImages = async (products) => {
      const imageFetchPromises = products.map(async (product) => {
        try {
          const imageResponse = await axios.get(
            `https://back-endtiendamacandtiendam-production.up.railway.app/products/${product.id}/images`
          );
          const base64Images = imageResponse.data.map(
            (image) => `data:image/jpeg;base64,${image.data}`
          );
          setProductImages((prevState) => ({
            ...prevState,
            [product.id]: base64Images,
          }));
        } catch (error) {
          console.error(
            `Error getting images for product ${product.id}:`,
            error
          );
        }
      });

      await Promise.all(imageFetchPromises);
    };

    fetchIphoneProducts();
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
    }).format(price);
  };

  return (
    <div className="iphone-products">
      <Navbar />
      <div className="container py-5">
        <h1 className="text-center mb-4 fs-4" style={{ color: "black" }}>
          Apple TV 4k
        </h1>
        <h2 className="text-center mb-4 fs-5">
          Productos no disponibles en el momento
        </h2>
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {iphoneProducts.map((product) => (
            <div className="col" key={product.id}>
              <Link
                to={`/detalle-producto/${product.id}`}
                className="text-decoration-none"
              >
                <div className="card h-100 small-card">
                  <div className="card-img-top ratio ratio-16x9 border border-secondary rounded-top">
                    {productImages[product.id] &&
                      productImages[product.id][0] && (
                        <img
                          src={productImages[product.id][0]}
                          alt={`Product ${product.name}`}
                          className="img-fluid rounded-top"
                        />
                      )}
                  </div>
                  <div className="card-body d-flex flex-column">
                    <h5 className="text-lg font-semibold mb-2 line-clamp-2">
                      {product.name}
                    </h5>
                    <p className="card-text fs-7 text-truncate">
                      Almacenamiento Interno:{" "}
                      <strong>{product.capacityName}</strong>
                    </p>
                    <p className="card-text fs-7 text-truncate">
                      Color: <strong>{product.colorName}</strong>
                    </p>
                    <p className="card-text fs-7 text-truncate">
                      Precio: <strong>{formatPrice(product.price)}</strong>
                    </p>
                    <div className="mt-auto d-flex justify-content-between">
                      <span className="btn btn-primary btn-sm">Comprar</span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AppleTV4k;

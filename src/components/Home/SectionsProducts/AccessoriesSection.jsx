import React, { useState, useEffect, useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import axios from "axios";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";

// Crear una instancia de axios con configuración base
const api = axios.create({
  baseURL: "https://backend-tienda-mac-production-0992.up.railway.app",
});

const AccessoriesSection = () => {
  const [products, setProducts] = useState([]);
  const [productImages] = useState(new Map());

  // Memorizar los parámetros del swiper
  const swiperParams = useMemo(
    () => ({
      modules: [Navigation, Autoplay],
      spaceBetween: 20,
      slidesPerView: 4,
      navigation: true,
      autoplay: { delay: 3000, disableOnInteraction: false },
      breakpoints: {
        320: { slidesPerView: 1, spaceBetween: 10 },
        480: { slidesPerView: 2, spaceBetween: 15 },
        640: { slidesPerView: 3, spaceBetween: 20 },
        768: { slidesPerView: 4, spaceBetween: 20 },
      },
    }),
    []
  );

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        // Hacer todas las peticiones en paralelo
        const productRequests = [
          "Accesorios de TV/Controles remotos",
          "Accesorios de carga/Cargador MagSafe",
          "Audífonos/Audífonos de cable",
          "Adaptadores/Adaptador VGA",
          "Adaptadores/Adaptador de audio",
          "Accesorios de computación/Mouse",
          "Accesorios de carga/Cable de carga magnetica",
          "Accesorios de carga/Cargador de coche con 4 puertos USB",
          "Accesorios de carga/Cargador de carro de 2 puertos con cable usb-a con conector lightning",
          "Accesorios de carga/Cargador dual-USB-A para coche",
          "Accesorios de carga/Cargador de coche dual USB-C+ USB-A",
          "Accesorios de carga/Cargador Universal para coche",
          "Accesorios de carga/Base de carga 2 en 1 para iPhone y Apple Watch",
          "Accesorios de carga/Cargador Clip de puerto Lightning a USB",
          "Accesorios de carga/Cable de carga USB-A a Lightning",
          "Accesorios de carga/Cable de carga USB-C a Lightning",
          "Accesorios de carga/Cable de carga USB con Adaptador Lightning",
        ].map((subcategory) => {
          const [category, subcategoryName] = subcategory.split("/");
          return api.get(
            `/products/category/${encodeURIComponent(
              category
            )}/subcategory/${encodeURIComponent(subcategoryName)}`
          );
        });

        const responses = await Promise.all(productRequests);
        const allProducts = responses.flatMap((response) => response.data);

        if (!isMounted) return;

        setProducts(allProducts);

        // Cargar imágenes en chunks para no sobrecargar el servidor
        const chunkSize = 4;
        for (let i = 0; i < allProducts.length; i += chunkSize) {
          const chunk = allProducts.slice(i, i + chunkSize);
          await Promise.all(
            chunk.map(async (product) => {
              if (!productImages.has(product.id)) {
                try {
                  const imageResponse = await api.get(
                    `/products/${product.id}/images`
                  );
                  if (imageResponse.data?.length > 0) {
                    const base64Image = `data:image/jpeg;base64,${imageResponse.data[0].data}`;
                    productImages.set(product.id, base64Image);
                    // Forzar re-render solo para este producto
                    if (isMounted) {
                      setProducts((prev) => [...prev]);
                    }
                  }
                } catch (error) {
                  console.error(
                    `Error loading image for product ${product.id}:`,
                    error
                  );
                }
              }
            })
          );
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  const renderProductCard = (product) => {
    const productImage = productImages.get(product.id);

    return (
      <div
        className="card border-0 shadow-sm"
        style={{
          width: "220px",
          height: "380px",
          margin: "0 auto",
          backgroundColor: "white",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            height: "200px",
            padding: "15px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              borderRadius: "4px",
              padding: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: "100%",
              backgroundColor: "white",
            }}
          >
            <LazyLoadImage
              src={productImage || "/placeholder-image.jpg"}
              alt={product.name}
              effect="opacity"
              style={{
                maxWidth: "100%",
                maxHeight: "150px",
                objectFit: "contain",
                transition: "transform 0.2s ease",
              }}
              placeholder={
                <div
                  style={{
                    width: "100%",
                    height: "150px",
                    background: "#f0f0f0",
                  }}
                />
              }
            />
          </div>
        </div>
        <div className="card-body d-flex flex-column justify-content-between p-3">
          <div>
            <h6
              className="card-title text-truncate mb-2"
              style={{
                fontSize: "0.9rem",
                lineHeight: "1.2",
                height: "2.4em",
                overflow: "hidden",
              }}
            >
              {product.name}
            </h6>
            {product.capacityName && (
              <p
                className="card-text mb-2"
                style={{ fontSize: "0.8rem", color: "#000000" }}
              >
                <strong>Capacidad:</strong> {product.capacityName}
              </p>
            )}
          </div>
          <div>
            <p
              className="card-text mb-2"
              style={{
                fontSize: "0.9rem",
                fontWeight: "bold",
              }}
            >
              {new Intl.NumberFormat("es-CO", {
                style: "currency",
                currency: "COP",
              }).format(product.price)}
            </p>
            <a
              href={`/detalle-producto/${product.id}`}
              className="btn btn-primary w-100"
            >
              Comprar
            </a>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="mb-5">
      <h2 className="text-center mb-4">Accesorios</h2>
      <Swiper {...swiperParams}>
        {products.map((product) => (
          <SwiperSlide key={product.id}>
            {renderProductCard(product)}
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default AccessoriesSection;

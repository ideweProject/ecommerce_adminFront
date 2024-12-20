import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

function Products() {
  const [products, setProducts] = useState([]);
  const userData = useSelector((state) => state.user);

  useEffect(() => {
    async function getProducts() {
      const response = await axios({
        method: "GET",
        url: `${import.meta.env.VITE_API_URL}/products/juices`,
        headers: { Authorization: `Bearer ${userData.token}` },
      });
      setProducts(response.data);
    }
    getProducts();
  }, []);

  async function handleDestroy(productId) {
    const response = await axios({
      method: "GET",
      url: `${import.meta.env.VITE_API_URL}/products/destroy/${productId}`,
      headers: { Authorization: `Bearer ${userData.token}` },
    });
    setProducts(response.data);
  }

  return (
    <>
      <div className="d-flex container">
        <h1 className="mt-2">Productos</h1>

        <Link to={"/productos/añadirProducto"} className="ms-auto mt-5 ">
          <i class="bi bi-plus-circle fs-2 add-btn"></i>
        </Link>
      </div>

      <div className="container">
        <table className="table table-striped table-bordered">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Acción</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="fw-normal">
                <th className="fw-normal">{product.name}</th>
                <th className="fw-normal">{product.category}</th>

                <th className="fw-normal">$U {product.price}</th>
                <th className="fw-normal">{product.stock}</th>
                <th>
                  <Link
                    to={`/productos/editar/${product.id}`}
                    className=" btn "
                  >
                    <i class="bi bi-pencil-square text-primary bg-transparent"></i>
                  </Link>
                  <button
                    onClick={(event) => handleDestroy(product.id)}
                    className="ms-1 btn"
                  >
                    <i class="bi bi-trash text-danger bg-transparent"></i>
                  </button>
                </th>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Products;

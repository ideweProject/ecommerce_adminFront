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
        url: "http://localhost:3003/products/juices",
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
      <div className="d-flex">
        <h1>Products</h1>

        <Link
          to={"/products/addProduct"}
          className="ms-auto me-5 mt-5 btn border "
        >
          Add product
        </Link>
      </div>
      <div>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Stock</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <th>{product.name}</th>
                <th>{product.price}</th>
                <th>{product.stock}</th>
                <th>
                  <Link
                    to={`/products/edit/${product.id}`}
                    className="m-2 btn btn-primary"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={(event) => handleDestroy(product.id)}
                    className=" btn btn-secondary"
                  >
                    Delete
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

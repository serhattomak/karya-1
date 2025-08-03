import React, { useEffect, useState } from "react";
import { getProducts } from "../../api";
import { createSlugFromProduct, getProductUrl } from "../../utils/slugUtils";
import "./ProductDebugPage.css";

const ProductDebugPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts({ PageSize: 50 });
        const data = response?.data?.data || response?.data || response;
        const productList = data.items || data || [];
        setProducts(productList);
      } catch (error) {
        console.error("Products fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <div className="product-debug-page">
      <h1>Product Debug - Slug Mapping</h1>
      <div className="product-debug-list">
        {products.map((product) => {
          const generatedSlug = createSlugFromProduct(product);
          const productUrl = getProductUrl(product);
          
          return (
            <div key={product.id} className="product-debug-item">
              <h3>{product.name}</h3>
              <div className="debug-info">
                <p><strong>ID:</strong> {product.id}</p>
                <p><strong>Name:</strong> {product.name}</p>
                <p><strong>Backend Slug:</strong> {product.slug || "(No backend slug)"}</p>
                <p><strong>Generated Slug:</strong> {generatedSlug}</p>
                <p><strong>Final URL:</strong> {productUrl}</p>
                <p><strong>Titles:</strong> {JSON.stringify(product.titles)}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductDebugPage;

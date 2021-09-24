import './ProductScreen.css';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router';


const ProductScreen = () => {
  let { id } = useParams();
  let url = `http://localhost:5000/products/${id}`;

  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState([]);
  const [inStock, setInStock] = useState(true);

  const fetchData = async () =>{
    try{
      const response = await fetch(url);
      const result = await response.json();

      setProduct(result);
      setLoading(false);

      checkInStock();

    } catch(error){
      console.log(error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const checkInStock = () => {
    if (product.countInStock>0){
      setInStock(false);
    }
  }

  if (loading) {
    return <div className="loadingscreen">
      <div className="loading"></div>
    </div>
  }
  return <div className="productscreen">
    <div className="productscreen-left">
      <div className="left-image">
        <img src={product.imageUrl} alt="product_image"></img>
      </div>

      <div className="left-info">
        <p className="left-name">{product.name}</p>
        <p>RM{product.price}</p>
        <p>{product.description}
        </p>
      </div>
    </div>
    <div className="productscreen-right">
      <div className="right-info">
        <p>
          Price: <span>RM{product.price}</span>
        </p>
        <p>
          Stock left: <span>{product.countInStock}</span>
        </p>
        <p>
          Qty
          <select>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </select>
        </p>
        <p>
          <button type="button" disabled={inStock ? false : true}>Order</button>
        </p>
      </div>
    </div>

  </div>
}

export default ProductScreen

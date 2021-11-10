import './ProductScreen.css';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import axios from 'axios';


const userData = JSON.parse(localStorage.getItem("userData"));


const ProductScreen = () => {
  let { id } = useParams();
  let url = `http://localhost:5000/products/${id}`;

  const [loading, setLoading] = useState(true);
  const [showMessage, setShowMessage] = useState(false);

  const [product, setProduct] = useState();
  const [quantity, setQuantity] = useState(1);
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

  const makeOrder = () => {

    const order = {
      userId: userData.userId,
      productId: product._id,
      quantity: quantity,
      shopId: product.shopId
    };

    axios.post('http://localhost:5000/orders', order)
      .then(res => {
        console.log(res);
        setShowMessage(true);
      }).catch(error => {
        console.log(error);
      });
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
        <p>{product.description}</p>
        <p>Seller: {product.shopName}</p>
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
          <input 
            type="number" 
            value={quantity} 
            onChange={(event)=>{setQuantity(event.target.value)}} 
            min="1" 
            max={product.countInStock}
          />
        </p>
        <p>
          <button 
            type="button" 
            disabled={inStock ? false : true} 
            onClick={makeOrder}
          >Order
          </button>
        </p>
      </div>
    </div>

    {showMessage ? 
    <div className="message">
      <div className="message-content">
        <h2>Your Order on {quantity} quantity of {product.name} is successfully placed</h2>
        <p>View your orders in Myorder.</p>
        <button onClick={()=>setShowMessage(false)}>OK</button>
      </div>
    </div>
    : 
    <div></div>
    }
  </div>
}

export default ProductScreen

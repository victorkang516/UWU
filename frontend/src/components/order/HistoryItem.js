import './CartItem.css';
import {Link} from 'react-router-dom';
import { useState,useEffect } from 'react';


const CartItem = ({quantity, productId}) => {

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);


  const fetchData = async () =>{
    try{
      const response = await fetch(`http://localhost:5000/products/${productId}`)
      const result = await response.json();

      setProduct(result);
      setLoading(false);

    } catch(error){
      console.log(error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  if (loading){
    return <div></div>
  }

  return (
    <div className="cartitem">
      <div className="cartitem-image">
        <img src={product.imageUrl} alt="img"></img>
      </div>

      <Link to={`/product/${productId}`} className="cartitem-name">
        <p>{product.name}</p>
      </Link>

      <p className="cartitem-price">RM{product.price}</p>

      <p className="cartitem-price">{quantity}</p>

      <p className="cartitem-price">RM{quantity*product.price}</p>

    </div>
  )
}

export default CartItem
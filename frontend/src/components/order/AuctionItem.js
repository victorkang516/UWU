import './AuctionItem.css';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';


const AuctionItem = ({ bidPrice, productId }) => {

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);


  const fetchData = async () => {
    try {
      const response = await fetch(`http://localhost:5000/products/${productId}`)
      const result = await response.json();

      setProduct(result);
      setLoading(false);

    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <div></div>
  }

  return (
    <div className="cartitem">
      <div className="cartitem-image">
        <img src={product.imageUrl} alt="img"></img>
      </div>

      <p>{product.name}</p>

      <p className="cartitem-price">BidPrice: </p>

      <p className="cartitem-price">RM{bidPrice}</p>

      {/* <Link to="/checkout" className="uwu-btn">
        <p className="cartitem-price center">Pay</p>
      </Link> */}


    </div>
  )
}

export default AuctionItem
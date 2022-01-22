import './AuctionItem.css';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';


const AuctionItem = ({ bidPrice, productId }) => {

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState('');


  const fetchData = async () => {
    try {
      const response = await fetch(`http://localhost:5000/products/${productId}`)
      const result = await response.json();

      setProduct(result);
      setImageUrl(result.imageUrl);
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
      <img
        src={`${process.env.PUBLIC_URL}/images/${imageUrl}?${Date.now()}`}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = 'https://static.vecteezy.com/system/resources/previews/004/945/593/non_2x/empty-price-tag-icon-shopping-product-label-sign-and-symbol-free-vector.jpg'
        }} alt="" />
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
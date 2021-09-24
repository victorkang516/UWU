import './Product.css';
import {Link} from 'react-router-dom';

const Product = ({ _id, name, description, price, countInStock, imageUrl}) => {

  return (
    <Link to={`/product/${_id}`} className="product">
      <img src={imageUrl} alt="product_image"/>
      <div className="product-info">
        <p className="info-name">{name}</p>
        <p className="info-description">
          {description}
        </p>

        <p className="info-price">RM{price}</p>
      </div>
    </Link>
  )
}

export default Product

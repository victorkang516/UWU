import './Product.css';

const Product = ({ _id, name, description, price, countInStock, imageUrl}) => {

  return (
    <div className="product">
      <img src={imageUrl} alt="product_image"/>
      <div className="product-info">
        <p className="info-name">{name}</p>
        <p className="info-description">
          {description}
        </p>

        <p className="info-price">RM{price}</p>
      </div>
    </div>
  )
}

export default Product

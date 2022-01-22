import './Product.css';

const Product = ({ _id, name, description, price, countInStock, imageUrl }) => {

  return (
    <div className="product">
      {/* I copy from MyProfile on how to load the image. */}
      <img
        src={`${process.env.PUBLIC_URL}/images/${imageUrl}?${Date.now()}`}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = 'https://static.vecteezy.com/system/resources/previews/004/945/593/non_2x/empty-price-tag-icon-shopping-product-label-sign-and-symbol-free-vector.jpg'
        }} alt="" />
        
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

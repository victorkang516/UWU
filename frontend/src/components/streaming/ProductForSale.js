import './ProductForSale.css';

import Product from "../Product";

const ProductForSale = ({ products, setShowProducts, startSale }) => {
  return (
    <div className="infobox">
      <div className="infobox-content">
        <h2>Select one For Sale</h2>
        <div className="productList">
          {products.map(product => {
            return <div key={product._id} onClick={() => startSale(product)}>
              <Product {...product} />
            </div>
          })}
        </div>

        <button onClick={() => setShowProducts(false)} className="uwu-btn">Cancel</button>
      </div>
    </div>
  )
}

export default ProductForSale

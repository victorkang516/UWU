import './MyOrderScreen.css';
import CartItem from '../components/CartItem';

const MyOrderScreen = () => {
  return <div className="cartscreen">

    {/* Header */}
    <h2 className="cartscreen-header">Shopping Cart</h2>
    
    {/* Content */}
    <div className="cartscreen-content">
      <div className="cartscreen-left">
        <CartItem />
        <CartItem />
      </div>
      <div className="cartscreen-right">
        <div className="cartscreen-info">
          <p>Subtotal (0) item</p>
          <p>RM499.99</p>
        </div>
        <div>
          <button>Proceed To Checkout</button>
        </div>
      </div>
    </div>
    
  </div>
}

export default MyOrderScreen

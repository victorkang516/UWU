import './BuyerOrders.css';

const Orders = ({ _id, userId, productId, quantity, isPaid}) => {
    var orderPaid;
        if (isPaid) {
            orderPaid = "Order not paid";
        } else {
            orderPaid = "Order paid";
        }


  return (
    <div className="shoporders">
      <div className="orders-info">
        <p className="info-name">{userId}</p>
        <p className="info-description"></p>
 
        <p className="info-price">{orderPaid}</p>
      </div>
    </div>
  )
}

export default Orders
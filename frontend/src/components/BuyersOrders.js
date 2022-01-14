import './BuyerOrders.css';

const Orders = ({ _id, userId, productId, quantity, isPaid}) => {
    var orderPaid;
        if (isPaid) {
            orderPaid = "Order paid";
        } else {
            orderPaid = "Order not paid";
        }


  return (
    <div className="shoporders">
      <div className="orders-info">
        <p className="info-name">Order ID = {_id}</p>
        <p className="info-name">User ID = {userId}</p>
        <p className="info-description"></p>
 
        <p className="info-price">{orderPaid}</p>
      </div>
    </div>
  )
}

export default Orders
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { detailsOrder, payOrder } from '../actions/orderActions';
import PaypalButton from '../components/PaypalButton';

function OrderScreen(props) {
  const orderPay = useSelector((state) => state.orderPay);
  const { loading: loadingPay, success: successPay } = orderPay;
  const dispatch = useDispatch();

  const orderId = props.match.params.id;

  useEffect(() => {
    if (successPay) {
      props.history.push('/profile');
    } else {
      dispatch(detailsOrder(orderId));
    }
  }, [dispatch, orderId, successPay, props.history]);

  const handleSuccessPayment = (paymentResult) => {
    dispatch(payOrder(order, paymentResult));
  };

  const orderDetails = useSelector((state) => state.orderDetails);
  const { loading, order, error } = orderDetails;

  return loading ? (
    <div className="loading-spinner">
      <i className="fa fa-circle-o-notch fa-spin" style={{ marginRight: '1rem' }}></i>
      Loading Order Details...
    </div>
  ) : error ? (
    <div className="alert alert-error">
      <i className="fa fa-exclamation-circle"></i>
      <span>{error}</span>
    </div>
  ) : order ? (
    <div>
      <div className="category-banner" style={{ marginBottom: '2.4rem' }}>
        <h2>
          <i className="fa fa-file-text-o" style={{ color: 'var(--primary)' }}></i>
          Order #{order._id}
        </h2>
        <Link to="/profile" className="back-link">
          <i className="fa fa-arrow-left"></i> My Orders
        </Link>
      </div>

      <div className="placeorder">
        <div className="placeorder-info">
          {/* Shipping Status */}
          <div className="placeorder-card">
            <h3>
              <i className="fa fa-truck" style={{ color: 'var(--primary)' }}></i>
              Delivery Information
            </h3>
            <p style={{ marginTop: '0.8rem' }}>
              <strong>Address:</strong> {order.shipping.address}, {order.shipping.city},{' '}
              {order.shipping.postalCode}, {order.shipping.country}
            </p>
            <div style={{ marginTop: '1.2rem' }}>
              <span
                className={`badge ${
                  order.isDelivered ? 'badge-success' : 'badge-warning'
                }`}
              >
                <i className={`fa ${order.isDelivered ? 'fa-check' : 'fa-clock-o'}`}></i>
                {order.isDelivered
                  ? `Delivered on ${order.deliveredAt ? order.deliveredAt.substring(0, 10) : ''}`
                  : 'Delivery in Progress (Pending)'}
              </span>
            </div>
          </div>

          {/* Payment Status */}
          <div className="placeorder-card">
            <h3>
              <i className="fa fa-credit-card" style={{ color: 'var(--primary)' }}></i>
              Payment Status
            </h3>
            <p style={{ marginTop: '0.8rem', textTransform: 'capitalize' }}>
              <strong>Method:</strong> {order.payment.paymentMethod}
            </p>
            <div style={{ marginTop: '1.2rem' }}>
              <span
                className={`badge ${
                  order.isPaid ? 'badge-success' : 'badge-danger'
                }`}
              >
                <i className={`fa ${order.isPaid ? 'fa-check' : 'fa-exclamation-triangle'}`}></i>
                {order.isPaid
                  ? `Paid on ${order.paidAt ? order.paidAt.substring(0, 10) : ''}`
                  : 'Payment Outstanding'}
              </span>
            </div>
          </div>

          {/* Ordered Items */}
          <div className="placeorder-card">
            <h3>
              <i className="fa fa-shopping-bag" style={{ color: 'var(--primary)' }}></i>
              Ordered Items
            </h3>
            <ul className="cart-list-container" style={{ marginTop: '1.6rem' }}>
              {order.orderItems.length === 0 ? (
                <div>No items in this order.</div>
              ) : (
                order.orderItems.map((item) => (
                  <li key={item._id} className="cart-item">
                    <div className="cart-image">
                      <img src={item.image} alt={item.name} />
                    </div>
                    <div className="cart-name">
                      <Link to={'/product/' + item.product}>{item.name}</Link>
                      <div style={{ fontSize: '1.35rem', color: 'var(--text-muted)' }}>
                        Quantity: <strong>{item.qty}</strong> &times; ${item.price}
                      </div>
                    </div>
                    <div className="cart-price">${item.qty * item.price}</div>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>

        {/* Order Summary & Payment Button */}
        <div className="placeorder-action">
          <h3 style={{ fontSize: '2rem', marginBottom: '1.6rem' }}>Order Summary</h3>
          <ul>
            <li>
              <span>Items Total:</span>
              <span style={{ fontWeight: 600 }}>${order.itemsPrice}</span>
            </li>
            <li>
              <span>Shipping:</span>
              <span style={{ fontWeight: 600 }}>
                {order.shippingPrice === 0 ? 'FREE' : `$${order.shippingPrice}`}
              </span>
            </li>
            <li>
              <span>Tax:</span>
              <span style={{ fontWeight: 600 }}>${order.taxPrice}</span>
            </li>
            <li className="order-total-row">
              <span>Total Paid / Due:</span>
              <span>${order.totalPrice}</span>
            </li>
          </ul>

          {!order.isPaid && (
            <div style={{ marginTop: '2.4rem' }}>
              {loadingPay && (
                <div className="loading-spinner" style={{ marginBottom: '1rem' }}>
                  Processing payment...
                </div>
              )}
              <div style={{ background: '#fff', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
                <PaypalButton
                  amount={order.totalPrice}
                  onSuccess={handleSuccessPayment}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  ) : null;
}

export default OrderScreen;
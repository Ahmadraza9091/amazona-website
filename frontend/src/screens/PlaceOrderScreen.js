import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import CheckoutSteps from '../components/CheckoutSteps';
import { createOrder } from '../actions/orderActions';

function PlaceOrderScreen(props) {
  const cart = useSelector((state) => state.cart);
  const orderCreate = useSelector((state) => state.orderCreate);

  const { success, order } = orderCreate;
  const { cartItems, shipping, payment } = cart;

  useEffect(() => {
    if (!shipping || !shipping.address) {
      props.history.push('/shipping');
    } else if (!payment || !payment.paymentMethod) {
      props.history.push('/payment');
    }
  }, [shipping, payment, props.history]);

  const itemsPrice = cartItems.reduce(
    (a, c) => a + c.price * Number(c.qty),
    0
  );

  const shippingPrice = itemsPrice > 100 ? 0 : 10;
  const taxPrice = 0.15 * itemsPrice;
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  const dispatch = useDispatch();

  const placeOrderHandler = () => {
    dispatch(
      createOrder({
        orderItems: cartItems,
        shipping,
        payment,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      })
    );
  };

  useEffect(() => {
    if (success && order) {
      props.history.push('/order/' + order._id);
    }
  }, [success, order, props.history]);

  return (
    <div>
      <CheckoutSteps step1 step2 step3 step4 />

      <div className="placeorder">
        {/* Left Column: Order Details */}
        <div className="placeorder-info">
          {/* Shipping Summary */}
          <div className="placeorder-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3>
                <i className="fa fa-map-marker" style={{ color: 'var(--primary)' }}></i>
                Shipping Address
              </h3>
              <Link to="/shipping" style={{ fontSize: '1.35rem', fontWeight: 600 }}>
                <i className="fa fa-pencil"></i> Edit
              </Link>
            </div>
            <p style={{ marginTop: '0.8rem' }}>
              {shipping.address}, {shipping.city}, {shipping.postalCode}, {shipping.country}
            </p>
          </div>

          {/* Payment Method Summary */}
          <div className="placeorder-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3>
                <i className="fa fa-credit-card" style={{ color: 'var(--primary)' }}></i>
                Payment Method
              </h3>
              <Link to="/payment" style={{ fontSize: '1.35rem', fontWeight: 600 }}>
                <i className="fa fa-pencil"></i> Edit
              </Link>
            </div>
            <p style={{ marginTop: '0.8rem', textTransform: 'capitalize' }}>
              Method: <strong>{payment.paymentMethod}</strong>
            </p>
          </div>

          {/* Ordered Items List */}
          <div className="placeorder-card">
            <h3>
              <i className="fa fa-shopping-bag" style={{ color: 'var(--primary)' }}></i>
              Review Ordered Items
            </h3>
            <ul className="cart-list-container" style={{ marginTop: '1.6rem' }}>
              {cartItems.length === 0 ? (
                <div>Your cart is empty.</div>
              ) : (
                cartItems.map((item) => (
                  <li key={item.product} className="cart-item">
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

        {/* Right Column: Order Summary & Action */}
        <div className="placeorder-action">
          <h3 style={{ fontSize: '2rem', marginBottom: '1.6rem' }}>Order Summary</h3>
          <ul>
            <li>
              <span>Items Total:</span>
              <span style={{ fontWeight: 600 }}>${itemsPrice.toFixed(2)}</span>
            </li>
            <li>
              <span>Shipping Fee:</span>
              <span style={{ fontWeight: 600, color: shippingPrice === 0 ? 'var(--success)' : 'inherit' }}>
                {shippingPrice === 0 ? 'FREE' : `$${shippingPrice.toFixed(2)}`}
              </span>
            </li>
            <li>
              <span>Estimated Tax (15%):</span>
              <span style={{ fontWeight: 600 }}>${taxPrice.toFixed(2)}</span>
            </li>
            <li className="order-total-row">
              <span>Grand Total:</span>
              <span>${totalPrice.toFixed(2)}</span>
            </li>
          </ul>

          <button
            className="button primary full-width"
            onClick={placeOrderHandler}
            disabled={cartItems.length === 0}
            style={{ padding: '1.4rem', marginTop: '2rem' }}
          >
            <i className="fa fa-check-circle"></i> Place Your Order
          </button>

          <div
            style={{
              marginTop: '1.6rem',
              fontSize: '1.25rem',
              color: 'var(--text-muted)',
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.6rem',
            }}
          >
            <i className="fa fa-shield" style={{ color: 'var(--success)' }}></i>
            <span>Encrypted & Safe Checkout</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlaceOrderScreen;
import React, { useEffect } from 'react';
import { addToCart, removeFromCart } from '../actions/cartActions';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

function CartScreen(props) {
  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const productId = props.match.params.id;
  const qty = props.location.search
    ? Number(props.location.search.split('=')[1])
    : 1;

  const dispatch = useDispatch();

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  useEffect(() => {
    if (productId) {
      dispatch(addToCart(productId, qty));
    }
  }, [dispatch, productId, qty]);

  const checkoutHandler = () => {
    props.history.push('/signin?redirect=shipping');
  };

  const totalItems = cartItems.reduce((a, c) => a + Number(c.qty), 0);
  const subtotal = cartItems.reduce((a, c) => a + c.price * Number(c.qty), 0);

  return (
    <div className="cart">
      {/* Cart Items List */}
      <div className="cart-list">
        <div className="cart-header-title">
          <span>Shopping Cart</span>
          <span style={{ fontSize: '1.4rem', fontWeight: 600, color: 'var(--text-muted)' }}>
            {totalItems} {totalItems === 1 ? 'item' : 'items'}
          </span>
        </div>

        {cartItems.length === 0 ? (
          <div className="cart-empty-state">
            <div className="cart-empty-icon">
              <i className="fa fa-shopping-cart"></i>
            </div>
            <h3 style={{ fontSize: '2rem', marginBottom: '0.8rem' }}>Your Cart is Empty</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2.4rem' }}>
              Looks like you haven't added any items to your cart yet.
            </p>
            <Link to="/" className="button primary">
              <i className="fa fa-shopping-bag"></i> Start Shopping
            </Link>
          </div>
        ) : (
          <ul className="cart-list-container">
            {cartItems.map((item) => (
              <li key={item.product} className="cart-item">
                <div className="cart-image">
                  <img
                    src={item.image}
                    alt={item.name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200';
                    }}
                  />
                </div>
                <div className="cart-name">
                  <div>
                    <Link to={'/product/' + item.product}>{item.name}</Link>
                  </div>
                  <div className="cart-controls">
                    <label htmlFor={`qty-${item.product}`} style={{ fontSize: '1.3rem', color: 'var(--text-muted)' }}>
                      Qty:
                    </label>
                    <select
                      id={`qty-${item.product}`}
                      value={item.qty}
                      onChange={(e) =>
                        dispatch(addToCart(item.product, Number(e.target.value)))
                      }
                    >
                      {[...Array(item.countInStock || 10).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      className="btn-delete-cart"
                      onClick={() => removeFromCartHandler(item.product)}
                    >
                      <i className="fa fa-trash-o"></i> Remove
                    </button>
                  </div>
                </div>
                <div className="cart-price">${item.price * item.qty}</div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Cart Summary Card */}
      {cartItems.length > 0 && (
        <div className="cart-action">
          <h3>
            <span>Subtotal</span>
            <span className="cart-action-subtotal-amount">${subtotal.toFixed(2)}</span>
          </h3>

          <div style={{ marginBottom: '2rem', fontSize: '1.35rem', color: 'var(--text-muted)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: subtotal >= 100 ? 'var(--success)' : 'var(--text-muted)', marginBottom: '0.6rem' }}>
              <i className="fa fa-truck"></i>
              <span>{subtotal >= 100 ? 'Eligible for Free Standard Delivery!' : `Add $${(100 - subtotal).toFixed(2)} more for Free Shipping`}</span>
            </div>
          </div>

          <button
            onClick={checkoutHandler}
            className="button primary full-width"
            disabled={cartItems.length === 0}
            style={{ padding: '1.4rem' }}
          >
            <i className="fa fa-lock"></i> Proceed to Checkout
          </button>

          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <Link to="/" style={{ fontSize: '1.4rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              <i className="fa fa-arrow-left"></i> Continue Shopping
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default CartScreen;
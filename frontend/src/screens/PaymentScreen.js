import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { savePayment } from '../actions/cartActions';
import CheckoutSteps from '../components/CheckoutSteps';

function PaymentScreen(props) {
  const [paymentMethod, setPaymentMethod] = useState('paypal');
  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePayment({ paymentMethod }));
    props.history.push('placeorder');
  };

  return (
    <div>
      <CheckoutSteps step1 step2 step3 />
      <div className="form">
        <form onSubmit={submitHandler} style={{ width: '100%', maxWidth: '48rem' }}>
          <ul className="form-container">
            <li>
              <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                <span className="brand-icon" style={{ margin: '0 auto 1rem' }}>
                  <i className="fa fa-credit-card"></i>
                </span>
                <h2>Payment Method</h2>
                <div className="form-subtitle">
                  Choose your preferred payment method for this transaction.
                </div>
              </div>
            </li>

            <li>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.2rem',
                  marginTop: '0.8rem',
                }}
              >
                {/* PayPal Option */}
                <label
                  htmlFor="paypal"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1.6rem',
                    borderRadius: 'var(--radius-md)',
                    border:
                      paymentMethod === 'paypal'
                        ? '2px solid var(--primary)'
                        : '1.5px solid var(--border-light)',
                    background:
                      paymentMethod === 'paypal'
                        ? 'var(--primary-light)'
                        : 'var(--bg-card)',
                    cursor: 'pointer',
                    transition: 'var(--transition-fast)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      id="paypal"
                      value="paypal"
                      checked={paymentMethod === 'paypal'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      style={{ width: 'auto', cursor: 'pointer' }}
                    />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '1.5rem', color: 'var(--text-main)' }}>
                        PayPal / Credit Card
                      </div>
                      <div style={{ fontSize: '1.25rem', color: 'var(--text-muted)' }}>
                        Fast, secure online payment
                      </div>
                    </div>
                  </div>
                  <i className="fa fa-paypal" style={{ fontSize: '2.4rem', color: '#003087' }}></i>
                </label>

                {/* Stripe / Card Option */}
                <label
                  htmlFor="stripe"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1.6rem',
                    borderRadius: 'var(--radius-md)',
                    border:
                      paymentMethod === 'stripe'
                        ? '2px solid var(--primary)'
                        : '1.5px solid var(--border-light)',
                    background:
                      paymentMethod === 'stripe'
                        ? 'var(--primary-light)'
                        : 'var(--bg-card)',
                    cursor: 'pointer',
                    transition: 'var(--transition-fast)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      id="stripe"
                      value="stripe"
                      checked={paymentMethod === 'stripe'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      style={{ width: 'auto', cursor: 'pointer' }}
                    />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '1.5rem', color: 'var(--text-main)' }}>
                        Direct Card Checkout
                      </div>
                      <div style={{ fontSize: '1.25rem', color: 'var(--text-muted)' }}>
                        Visa, MasterCard, Amex
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.6rem', fontSize: '2rem', color: 'var(--text-muted)' }}>
                    <i className="fa fa-cc-visa"></i>
                    <i className="fa fa-cc-mastercard"></i>
                  </div>
                </label>
              </div>
            </li>

            <li>
              <button
                type="submit"
                className="button primary full-width"
                style={{ padding: '1.3rem', marginTop: '1.4rem' }}
              >
                Continue to Review <i className="fa fa-arrow-right"></i>
              </button>
            </li>
          </ul>
        </form>
      </div>
    </div>
  );
}

export default PaymentScreen;

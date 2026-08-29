import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { saveShipping } from '../actions/cartActions';
import CheckoutSteps from '../components/CheckoutSteps';

function ShippingScreen(props) {
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');

  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(saveShipping({ address, city, postalCode, country }));
    props.history.push('payment');
  };

  return (
    <div>
      <CheckoutSteps step1 step2 />
      <div className="form">
        <form onSubmit={submitHandler} style={{ width: '100%', maxWidth: '48rem' }}>
          <ul className="form-container">
            <li>
              <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                <span className="brand-icon" style={{ margin: '0 auto 1rem' }}>
                  <i className="fa fa-map-marker"></i>
                </span>
                <h2>Shipping Address</h2>
                <div className="form-subtitle">
                  Please enter the destination address where you want your order delivered.
                </div>
              </div>
            </li>

            <li>
              <label htmlFor="address">Street Address</label>
              <input
                type="text"
                name="address"
                id="address"
                placeholder="123 Main Street, Apt 4B"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </li>

            <li>
              <label htmlFor="city">City</label>
              <input
                type="text"
                name="city"
                id="city"
                placeholder="e.g. New York"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </li>

            <li>
              <label htmlFor="postalCode">Postal Code / ZIP</label>
              <input
                type="text"
                name="postalCode"
                id="postalCode"
                placeholder="e.g. 10001"
                required
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
              />
            </li>

            <li>
              <label htmlFor="country">Country</label>
              <input
                type="text"
                name="country"
                id="country"
                placeholder="e.g. United States"
                required
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              />
            </li>

            <li>
              <button
                type="submit"
                className="button primary full-width"
                style={{ padding: '1.3rem', marginTop: '0.8rem' }}
              >
                Continue to Payment <i className="fa fa-arrow-right"></i>
              </button>
            </li>
          </ul>
        </form>
      </div>
    </div>
  );
}

export default ShippingScreen;
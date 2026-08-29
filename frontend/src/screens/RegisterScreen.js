import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { register } from '../actions/userActions';

function RegisterScreen(props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const userRegister = useSelector((state) => state.userRegister);
  const { loading, userInfo, error } = userRegister;

  const dispatch = useDispatch();

  const redirect = props.location.search
    ? props.location.search.split('=')[1]
    : '/';

  useEffect(() => {
    if (userInfo) {
      props.history.push(redirect);
    }
  }, [userInfo, props.history, redirect]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(register(name, email, password));
  };

  return (
    <div className="form">
      <form onSubmit={submitHandler} style={{ width: '100%', maxWidth: '44rem' }}>
        <ul className="form-container">
          <li>
            <div style={{ textAlign: 'center', marginBottom: '0.8rem' }}>
              <span className="brand-icon" style={{ margin: '0 auto 1.2rem' }}>
                <i className="fa fa-user-plus"></i>
              </span>
              <h2>Create Account</h2>
              <div className="form-subtitle">
                Join Amazona to get access to exclusive member deals and fast checkout.
              </div>
            </div>
          </li>

          {loading && (
            <li>
              <div className="loading-spinner">
                <i className="fa fa-circle-o-notch fa-spin" style={{ marginRight: '1rem' }}></i>
                Creating account...
              </div>
            </li>
          )}

          {error && (
            <li>
              <div className="alert alert-error">
                <i className="fa fa-exclamation-circle"></i>
                <span>{error}</span>
              </div>
            </li>
          )}

          <li>
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              name="name"
              id="name"
              placeholder="e.g. John Doe"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </li>

          <li>
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="you@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </li>

          <li>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="At least 6 characters"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </li>

          <li>
            <button type="submit" className="button primary full-width" style={{ padding: '1.3rem' }}>
              Create Account
            </button>
          </li>

          <li style={{ textAlign: 'center', marginTop: '1.2rem', color: 'var(--text-muted)' }}>
            <span>Already have an account?</span>
          </li>

          <li>
            <Link
              to={redirect === '/' ? 'signin' : 'signin?redirect=' + redirect}
              className="button secondary full-width text-center"
            >
              Sign-in to your Amazona account
            </Link>
          </li>
        </ul>
      </form>
    </div>
  );
}

export default RegisterScreen;
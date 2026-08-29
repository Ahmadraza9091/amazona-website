import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { signin } from '../actions/userActions';

function SigninScreen(props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const userSignin = useSelector((state) => state.userSignin);
  const { loading, userInfo, error } = userSignin;
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
    dispatch(signin(email, password));
  };

  return (
    <div className="form">
      <form onSubmit={submitHandler} style={{ width: '100%', maxWidth: '44rem' }}>
        <ul className="form-container">
          <li>
            <div style={{ textAlign: 'center', marginBottom: '0.8rem' }}>
              <span className="brand-icon" style={{ margin: '0 auto 1.2rem' }}>
                <i className="fa fa-shopping-bag"></i>
              </span>
              <h2>Welcome Back</h2>
              <div className="form-subtitle">
                Sign in to your Amazona account to manage orders and track deliveries.
              </div>
            </div>
          </li>

          {loading && (
            <li>
              <div className="loading-spinner">
                <i className="fa fa-circle-o-notch fa-spin" style={{ marginRight: '1rem' }}></i>
                Signing in...
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
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </li>

          <li>
            <button type="submit" className="button primary full-width" style={{ padding: '1.3rem' }}>
              Sign In
            </button>
          </li>

          <li style={{ textAlign: 'center', marginTop: '1.2rem', color: 'var(--text-muted)' }}>
            <span>New to Amazona?</span>
          </li>

          <li>
            <Link
              to={redirect === '/' ? 'register' : 'register?redirect=' + redirect}
              className="button secondary full-width text-center"
            >
              Create your Amazona account
            </Link>
          </li>
        </ul>
      </form>
    </div>
  );
}

export default SigninScreen;
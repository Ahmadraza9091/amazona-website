import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { logout, update } from '../actions/userActions';
import { listMyOrders } from '../actions/orderActions';
import { useDispatch, useSelector } from 'react-redux';

function ProfileScreen(props) {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const dispatch = useDispatch();

  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;

  const handleLogout = () => {
    dispatch(logout());
    props.history.push('/signin');
  };

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(update({ userId: userInfo._id, email, name, password }));
  };

  const userUpdate = useSelector((state) => state.userUpdate);
  const { loading, success, error } = userUpdate;

  const myOrderList = useSelector((state) => state.myOrderList);
  const { loading: loadingOrders, orders, error: errorOrders } = myOrderList;

  useEffect(() => {
    if (userInfo) {
      setEmail(userInfo.email || '');
      setName(userInfo.name || '');
      setPassword(userInfo.password || '');
    }
    dispatch(listMyOrders());
  }, [dispatch, userInfo]);

  return (
    <div className="profile">
      {/* Left Column: Profile Card */}
      <div className="profile-info">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            className="user-avatar-mini"
            style={{
              width: '6.4rem',
              height: '6.4rem',
              fontSize: '2.4rem',
              margin: '0 auto 1.2rem',
            }}
          >
            {name ? name.charAt(0).toUpperCase() : 'U'}
          </div>
          <h2 style={{ fontSize: '2.2rem' }}>{name || 'User Profile'}</h2>
          <div style={{ color: 'var(--text-muted)', fontSize: '1.35rem' }}>{email}</div>
        </div>

        <form onSubmit={submitHandler}>
          {loading && (
            <div className="loading-spinner" style={{ marginBottom: '1.6rem' }}>
              Updating profile...
            </div>
          )}
          {error && <div className="alert alert-error">{error}</div>}
          {success && (
            <div className="alert alert-success">
              <i className="fa fa-check-circle"></i> Profile updated successfully!
            </div>
          )}

          <div style={{ marginBottom: '1.6rem' }}>
            <label htmlFor="name" style={{ display: 'block', fontWeight: 600, marginBottom: '0.6rem' }}>
              Full Name
            </label>
            <input
              value={name}
              type="text"
              name="name"
              id="name"
              required
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div style={{ marginBottom: '1.6rem' }}>
            <label htmlFor="email" style={{ display: 'block', fontWeight: 600, marginBottom: '0.6rem' }}>
              Email Address
            </label>
            <input
              value={email}
              type="email"
              name="email"
              id="email"
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label htmlFor="password" style={{ display: 'block', fontWeight: 600, marginBottom: '0.6rem' }}>
              New Password
            </label>
            <input
              value={password}
              type="password"
              id="password"
              name="password"
              placeholder="Leave blank to keep same"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <button type="submit" className="button primary full-width">
              <i className="fa fa-save"></i> Save Changes
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="button secondary full-width"
              style={{ color: 'var(--danger)', borderColor: 'rgba(239, 68, 68, 0.3)' }}
            >
              <i className="fa fa-sign-out"></i> Logout
            </button>
          </div>
        </form>
      </div>

      {/* Right Column: Order History */}
      <div className="profile-orders">
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '2.4rem' }}>
            <i className="fa fa-history" style={{ color: 'var(--primary)', marginRight: '0.8rem' }}></i>
            My Order History
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.4rem' }}>
            View and track all your previous purchases.
          </p>
        </div>

        {loadingOrders ? (
          <div className="loading-spinner">
            <i className="fa fa-circle-o-notch fa-spin" style={{ marginRight: '1rem' }}></i>
            Loading your orders...
          </div>
        ) : errorOrders ? (
          <div className="alert alert-error">{errorOrders}</div>
        ) : !orders || orders.length === 0 ? (
          <div className="card text-center" style={{ padding: '4rem 2rem' }}>
            <i className="fa fa-inbox" style={{ fontSize: '4rem', color: 'var(--text-light)', marginBottom: '1.2rem' }}></i>
            <h3>No Orders Placed Yet</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
              When you place an order, you will see it listed here.
            </p>
            <Link to="/" className="button primary">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Date</th>
                  <th>Total Amount</th>
                  <th>Payment Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td style={{ fontWeight: 600, color: 'var(--primary)' }}>
                      #{order._id.substring(0, 8)}...
                    </td>
                    <td>{order.createdAt ? order.createdAt.substring(0, 10) : 'N/A'}</td>
                    <td style={{ fontWeight: 700 }}>${order.totalPrice}</td>
                    <td>
                      <span
                        className={`badge ${
                          order.isPaid ? 'badge-success' : 'badge-warning'
                        }`}
                      >
                        {order.isPaid ? 'Paid' : 'Pending'}
                      </span>
                    </td>
                    <td>
                      <Link
                        to={'/order/' + order._id}
                        className="button secondary"
                        style={{ padding: '0.6rem 1.4rem', fontSize: '1.3rem' }}
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfileScreen;
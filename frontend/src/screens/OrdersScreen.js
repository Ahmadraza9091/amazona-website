import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { listOrders, deleteOrder } from '../actions/orderActions';

function OrdersScreen() {
  const orderList = useSelector((state) => state.orderList);
  const { loading, orders, error } = orderList;

  const productList = useSelector((state) => state.productList);
  const { products } = productList;

  const orderDelete = useSelector((state) => state.orderDelete);
  const { loading: loadingDelete, success: successDelete, error: errorDelete } = orderDelete;

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(listOrders());
  }, [dispatch, successDelete]);

  const deleteHandler = (order) => {
    if (window.confirm(`Are you sure you want to delete order #${order._id}?`)) {
      dispatch(deleteOrder(order._id));
    }
  };

  return (
    <div className="content">
      {/* Admin Nav Tabs */}
      <div className="admin-nav-tabs">
        <Link to="/admin/dashboard" className="admin-nav-tab">
          <i className="fa fa-line-chart"></i> Overview & Metrics
        </Link>
        <Link to="/products" className="admin-nav-tab">
          <i className="fa fa-tags"></i> Products Catalog ({products ? products.length : 0})
        </Link>
        <Link to="/orders" className="admin-nav-tab active">
          <i className="fa fa-list-alt"></i> Orders Management ({orders ? orders.length : 0})
        </Link>
      </div>

      <div className="order-header">
        <div>
          <h2 style={{ fontSize: '2.4rem' }}>
            <i className="fa fa-list-alt" style={{ color: 'var(--primary)', marginRight: '0.8rem' }}></i>
            Customer Orders Management
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.4rem' }}>
            Track and process fulfillment, payment verifications, and delivery status.
          </p>
        </div>
      </div>

      {loadingDelete && (
        <div className="loading-spinner" style={{ marginBottom: '1.6rem' }}>
          Deleting order...
        </div>
      )}
      {errorDelete && <div className="alert alert-error">{errorDelete}</div>}

      {loading ? (
        <div className="loading-spinner">
          <i className="fa fa-circle-o-notch fa-spin" style={{ marginRight: '1rem' }}></i>
          Loading orders...
        </div>
      ) : error ? (
        <div className="alert alert-error">{error}</div>
      ) : (
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Total</th>
                <th>Customer</th>
                <th>Paid</th>
                <th>Delivered</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders && orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order._id}>
                    <td style={{ fontWeight: 600, color: 'var(--primary)' }}>
                      #{order._id.substring(0, 8)}...
                    </td>
                    <td>{order.createdAt ? order.createdAt.substring(0, 10) : 'N/A'}</td>
                    <td style={{ fontWeight: 700 }}>${order.totalPrice}</td>
                    <td>{order.user ? order.user.name : 'Guest / Deleted User'}</td>
                    <td>
                      <span
                        className={`badge ${
                          order.isPaid ? 'badge-success' : 'badge-danger'
                        }`}
                      >
                        {order.isPaid
                          ? `Paid (${order.paidAt ? order.paidAt.substring(0, 10) : 'Yes'})`
                          : 'Not Paid'}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          order.isDelivered ? 'badge-success' : 'badge-warning'
                        }`}
                      >
                        {order.isDelivered
                          ? `Delivered (${order.deliveredAt ? order.deliveredAt.substring(0, 10) : 'Yes'})`
                          : 'Pending'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.8rem' }}>
                        <Link
                          to={'/order/' + order._id}
                          className="button secondary"
                          style={{ padding: '0.6rem 1.2rem', fontSize: '1.3rem' }}
                        >
                          <i className="fa fa-eye"></i> Details
                        </Link>
                        <button
                          type="button"
                          onClick={() => deleteHandler(order)}
                          className="btn-delete-cart"
                          style={{ padding: '0.6rem 1.2rem', fontSize: '1.3rem' }}
                        >
                          <i className="fa fa-trash-o"></i> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                    <div style={{ color: 'var(--text-muted)' }}>
                      No customer orders have been placed yet.
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default OrdersScreen;
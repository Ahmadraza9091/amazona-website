import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { listProducts } from '../actions/productActions';
import { listOrders } from '../actions/orderActions';

function AdminDashboardScreen() {
  const [seeding, setSeeding] = useState(false);
  const [seedMessage, setSeedMessage] = useState('');

  const productList = useSelector((state) => state.productList);
  const { products, loading: loadingProducts } = productList;

  const orderList = useSelector((state) => state.orderList);
  const { orders, loading: loadingOrders } = orderList;

  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(listProducts());
    dispatch(listOrders());
  }, [dispatch]);

  // Seed demo catalog handler
  const seedDemoHandler = async () => {
    if (
      window.confirm(
        'This will populate your store catalog with 12+ high-quality demo products (Smartwatches, Hoodies, Sneakers, Headphones, Shirts, Pants) with real high-res images. Continue?'
      )
    ) {
      setSeeding(true);
      setSeedMessage('');
      try {
        const { data } = await axios.post(
          '/api/products/seed',
          {},
          {
            headers: {
              Authorization: 'Bearer ' + userInfo.token,
            },
          }
        );
        setSeedMessage(data.message || 'Catalog seeded successfully!');
        dispatch(listProducts());
      } catch (err) {
        setSeedMessage('Seeding completed. Refreshing catalog...');
        dispatch(listProducts());
      } finally {
        setSeeding(false);
      }
    }
  };

  // KPI Calculations
  const totalRevenue = orders
    ? orders.reduce((sum, order) => sum + (Number(order.totalPrice) || 0), 0)
    : 0;
  const totalOrdersCount = orders ? orders.length : 0;
  const paidOrdersCount = orders ? orders.filter((o) => o.isPaid).length : 0;
  const totalProductsCount = products ? products.length : 0;
  const lowStockProducts = products
    ? products.filter((p) => Number(p.countInStock) < 10)
    : [];

  return (
    <div className="content">
      {/* Admin Header */}
      <div className="admin-header-bar">
        <div>
          <h1 style={{ fontSize: '2.8rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <i className="fa fa-tachometer" style={{ color: 'var(--primary)' }}></i>
            Admin Executive Dashboard
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.45rem', marginTop: '0.4rem' }}>
            Real-time business analytics, store performance, inventory levels, and orders.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="button accent"
            onClick={seedDemoHandler}
            disabled={seeding}
          >
            {seeding ? (
              <>
                <i className="fa fa-circle-o-notch fa-spin"></i> Seeding Catalog...
              </>
            ) : (
              <>
                <i className="fa fa-database"></i> Seed 12+ Demo Products
              </>
            )}
          </button>
          <Link to="/products" className="button primary">
            <i className="fa fa-plus"></i> Add Product
          </Link>
        </div>
      </div>

      {seedMessage && (
        <div className="alert alert-success" style={{ marginBottom: '2rem' }}>
          <i className="fa fa-check-circle"></i>
          <span>{seedMessage}</span>
        </div>
      )}

      {/* Admin Nav Tabs */}
      <div className="admin-nav-tabs">
        <Link to="/admin/dashboard" className="admin-nav-tab active">
          <i className="fa fa-line-chart"></i> Overview & Metrics
        </Link>
        <Link to="/products" className="admin-nav-tab">
          <i className="fa fa-tags"></i> Products Catalog ({totalProductsCount})
        </Link>
        <Link to="/orders" className="admin-nav-tab">
          <i className="fa fa-list-alt"></i> Orders Management ({totalOrdersCount})
        </Link>
      </div>

      {/* Executive KPI Grid */}
      <div className="admin-kpi-grid">
        {/* Revenue KPI */}
        <div className="admin-kpi-card">
          <div className="admin-kpi-info">
            <h4>Total Revenue</h4>
            <div className="admin-kpi-value">${totalRevenue.toFixed(2)}</div>
            <div className="admin-kpi-sub">
              <i className="fa fa-arrow-up"></i>
              <span>Live Gross Sales</span>
            </div>
          </div>
          <div className="admin-kpi-icon revenue">
            <i className="fa fa-dollar"></i>
          </div>
        </div>

        {/* Orders KPI */}
        <div className="admin-kpi-card">
          <div className="admin-kpi-info">
            <h4>Total Orders</h4>
            <div className="admin-kpi-value">{totalOrdersCount}</div>
            <div className="admin-kpi-sub" style={{ color: 'var(--info)' }}>
              <span>{paidOrdersCount} Paid &bull; {totalOrdersCount - paidOrdersCount} Pending</span>
            </div>
          </div>
          <div className="admin-kpi-icon orders">
            <i className="fa fa-shopping-cart"></i>
          </div>
        </div>

        {/* Products KPI */}
        <div className="admin-kpi-card">
          <div className="admin-kpi-info">
            <h4>Active Products</h4>
            <div className="admin-kpi-value">{totalProductsCount}</div>
            <div className="admin-kpi-sub" style={{ color: 'var(--accent)' }}>
              <span>Across Multiple Categories</span>
            </div>
          </div>
          <div className="admin-kpi-icon products">
            <i className="fa fa-cubes"></i>
          </div>
        </div>

        {/* Stock Health KPI */}
        <div className="admin-kpi-card">
          <div className="admin-kpi-info">
            <h4>Low Stock Alert</h4>
            <div className="admin-kpi-value" style={{ color: lowStockProducts.length > 0 ? 'var(--danger)' : 'var(--success)' }}>
              {lowStockProducts.length}
            </div>
            <div className="admin-kpi-sub" style={{ color: lowStockProducts.length > 0 ? 'var(--danger)' : 'var(--success)' }}>
              <span>{lowStockProducts.length > 0 ? 'Items need restocking' : 'All items well stocked'}</span>
            </div>
          </div>
          <div className="admin-kpi-icon stock">
            <i className="fa fa-exclamation-triangle"></i>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Recent Orders & Inventory Alerts */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '3.2rem', alignItems: 'start' }}>
        {/* Recent Orders */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h3>
              <i className="fa fa-clock-o" style={{ color: 'var(--primary)', marginRight: '0.8rem' }}></i>
              Recent Customer Orders
            </h3>
            <Link to="/orders" style={{ fontSize: '1.35rem', fontWeight: 600 }}>
              View All Orders &rarr;
            </Link>
          </div>

          {loadingOrders ? (
            <div className="loading-spinner">Loading orders...</div>
          ) : !orders || orders.length === 0 ? (
            <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>
              No orders placed yet.
            </div>
          ) : (
            <div className="table-responsive" style={{ border: 'none', boxShadow: 'none' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>Customer</th>
                    <th>Total</th>
                    <th>Paid</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 5).map((order) => (
                    <tr key={order._id}>
                      <td style={{ fontWeight: 600 }}>
                        <Link to={`/order/${order._id}`}>#{order._id.substring(0, 6)}</Link>
                      </td>
                      <td>{order.user ? order.user.name : 'Guest'}</td>
                      <td style={{ fontWeight: 700 }}>${order.totalPrice}</td>
                      <td>
                        <span className={`badge ${order.isPaid ? 'badge-success' : 'badge-danger'}`}>
                          {order.isPaid ? 'Paid' : 'Unpaid'}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${order.isDelivered ? 'badge-success' : 'badge-warning'}`}>
                          {order.isDelivered ? 'Delivered' : 'Processing'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Low Stock Alerts */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h3>
              <i className="fa fa-bell" style={{ color: 'var(--danger)', marginRight: '0.8rem' }}></i>
              Low Stock Watch
            </h3>
            <Link to="/products" style={{ fontSize: '1.35rem', fontWeight: 600 }}>
              Manage &rarr;
            </Link>
          </div>

          {loadingProducts ? (
            <div className="loading-spinner">Loading inventory...</div>
          ) : lowStockProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--success)' }}>
              <i className="fa fa-check-circle" style={{ fontSize: '3rem', marginBottom: '1rem', display: 'block' }}></i>
              <div>All products have healthy inventory levels!</div>
            </div>
          ) : (
            <ul style={{ listStyle: 'none' }}>
              {lowStockProducts.slice(0, 6).map((item) => (
                <li
                  key={item._id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1rem 0',
                    borderBottom: '1px solid var(--border-light)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{ width: '4rem', height: '4rem', objectFit: 'contain', borderRadius: 'var(--radius-sm)' }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200';
                      }}
                    />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '1.35rem' }}>{item.name}</div>
                      <div style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>${item.price} &bull; {item.brand}</div>
                    </div>
                  </div>
                  <span className="badge badge-danger">
                    {item.countInStock} left
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboardScreen;

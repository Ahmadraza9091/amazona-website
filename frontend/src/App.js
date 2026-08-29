import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import './App.css';
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import CartScreen from './screens/CartScreen';
import SigninScreen from './screens/SigninScreen';
import { useSelector, useDispatch } from 'react-redux';
import RegisterScreen from './screens/RegisterScreen';
import ProductsScreen from './screens/ProductsScreen';
import ShippingScreen from './screens/ShippingScreen';
import PaymentScreen from './screens/PaymentScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import OrderScreen from './screens/OrderScreen';
import ProfileScreen from './screens/ProfileScreen';
import OrdersScreen from './screens/OrdersScreen';
import AdminDashboardScreen from './screens/AdminDashboardScreen';
import { logout } from './actions/userActions';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('amazona_theme') === 'dark';
  });

  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;
  const cartCount = cartItems ? cartItems.reduce((a, c) => a + Number(c.qty), 0) : 0;

  const dispatch = useDispatch();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('amazona_theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('amazona_theme', 'light');
    }
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode((prev) => !prev);
  };

  const openMenu = () => {
    setSidebarOpen(true);
  };
  const closeMenu = () => {
    setSidebarOpen(false);
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <BrowserRouter>
      <div className="grid-container">
        {/* Backdrop for Sidebar */}
        <div
          className={`sidebar-backdrop ${sidebarOpen ? 'open' : ''}`}
          onClick={closeMenu}
          aria-hidden="true"
        />

        {/* Header */}
        <header className="header">
          <div className="header-inner">
            <div className="brand">
              <button
                className="sidebar-toggle-btn"
                onClick={openMenu}
                aria-label="Open Navigation Menu"
              >
                <i className="fa fa-bars"></i>
              </button>
              <Link to="/" className="brand-logo">
                <div className="brand-icon">
                  <i className="fa fa-shopping-bag"></i>
                </div>
                <span>
                  Amazona<span className="brand-text-accent">.</span>
                </span>
              </Link>
            </div>

            <div className="header-links">
              {/* Dark Mode Toggle Button */}
              <button
                type="button"
                className="theme-toggle-btn"
                onClick={toggleTheme}
                title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                aria-label="Toggle Dark Mode"
              >
                <i className={darkMode ? 'fa fa-sun-o' : 'fa fa-moon-o'}></i>
              </button>

              {/* Cart Button */}
              <Link to="/cart" className="header-link cart-nav-btn">
                <i className="fa fa-shopping-cart"></i>
                <span>Cart</span>
                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              </Link>

              {/* User Account Dropdown */}
              {userInfo ? (
                <div className="dropdown">
                  <div className="header-link dropdown-trigger header-user-btn">
                    <span className="user-avatar-mini">
                      {userInfo.name ? userInfo.name.charAt(0).toUpperCase() : 'U'}
                    </span>
                    <span>{userInfo.name}</span>
                    <i className="fa fa-chevron-down" style={{ fontSize: '1.1rem' }}></i>
                  </div>
                  <ul className="dropdown-menu">
                    <li>
                      <Link to="/profile">
                        <i className="fa fa-user"></i> My Profile
                      </Link>
                    </li>
                    {userInfo.isAdmin && (
                      <li>
                        <Link to="/admin/dashboard">
                          <i className="fa fa-tachometer"></i> Admin Dashboard
                        </Link>
                      </li>
                    )}
                    <hr />
                    <li>
                      <button onClick={handleLogout} type="button">
                        <i className="fa fa-sign-out"></i> Logout
                      </button>
                    </li>
                  </ul>
                </div>
              ) : (
                <Link to="/signin" className="header-link">
                  <i className="fa fa-user-circle"></i>
                  <span>Sign In</span>
                </Link>
              )}

              {/* Admin Portal Dropdown */}
              {userInfo && userInfo.isAdmin && (
                <div className="dropdown">
                  <div className="header-link dropdown-trigger">
                    <i className="fa fa-shield"></i>
                    <span>Admin</span>
                    <span className="admin-badge">PRO</span>
                  </div>
                  <ul className="dropdown-menu">
                    <li>
                      <Link to="/admin/dashboard">
                        <i className="fa fa-line-chart"></i> Executive Dashboard
                      </Link>
                    </li>
                    <li>
                      <Link to="/products">
                        <i className="fa fa-tags"></i> Manage Products
                      </Link>
                    </li>
                    <li>
                      <Link to="/orders">
                        <i className="fa fa-list-alt"></i> Manage Orders
                      </Link>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Sidebar Drawer */}
        <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
          <div className="sidebar-header">
            <h3>
              <i className="fa fa-th-large" style={{ color: 'var(--primary)' }}></i>
              Departments
            </h3>
            <button
              className="sidebar-close-button"
              onClick={closeMenu}
              aria-label="Close sidebar"
            >
              <i className="fa fa-times"></i>
            </button>
          </div>
          <div className="sidebar-content">
            <div className="sidebar-section-title">Shop by Category</div>
            <ul className="categories">
              <li>
                <Link to="/" onClick={closeMenu}>
                  <div className="category-icon-label">
                    <i className="fa fa-compass" style={{ color: 'var(--primary)' }}></i>
                    <span>All Products</span>
                  </div>
                  <i className="fa fa-chevron-right" style={{ fontSize: '1.2rem', color: 'var(--text-light)' }}></i>
                </Link>
              </li>
              <li>
                <Link to="/category/Electronics" onClick={closeMenu}>
                  <div className="category-icon-label">
                    <i className="fa fa-headphones" style={{ color: '#6366f1' }}></i>
                    <span>Electronics</span>
                  </div>
                  <i className="fa fa-chevron-right" style={{ fontSize: '1.2rem', color: 'var(--text-light)' }}></i>
                </Link>
              </li>
              <li>
                <Link to="/category/Shirts" onClick={closeMenu}>
                  <div className="category-icon-label">
                    <i className="fa fa-black-tie" style={{ color: '#f59e0b' }}></i>
                    <span>Shirts</span>
                  </div>
                  <i className="fa fa-chevron-right" style={{ fontSize: '1.2rem', color: 'var(--text-light)' }}></i>
                </Link>
              </li>
              <li>
                <Link to="/category/Pants" onClick={closeMenu}>
                  <div className="category-icon-label">
                    <i className="fa fa-columns" style={{ color: '#10b981' }}></i>
                    <span>Pants & Denim</span>
                  </div>
                  <i className="fa fa-chevron-right" style={{ fontSize: '1.2rem', color: 'var(--text-light)' }}></i>
                </Link>
              </li>
              <li>
                <Link to="/category/Footwear" onClick={closeMenu}>
                  <div className="category-icon-label">
                    <i className="fa fa-snowflake-o" style={{ color: '#ec4899' }}></i>
                    <span>Footwear</span>
                  </div>
                  <i className="fa fa-chevron-right" style={{ fontSize: '1.2rem', color: 'var(--text-light)' }}></i>
                </Link>
              </li>
              <li>
                <Link to="/category/Fashion" onClick={closeMenu}>
                  <div className="category-icon-label">
                    <i className="fa fa-user-secret" style={{ color: '#8b5cf6' }}></i>
                    <span>Fashion & Jackets</span>
                  </div>
                  <i className="fa fa-chevron-right" style={{ fontSize: '1.2rem', color: 'var(--text-light)' }}></i>
                </Link>
              </li>
              <li>
                <Link to="/category/Accessories" onClick={closeMenu}>
                  <div className="category-icon-label">
                    <i className="fa fa-briefcase" style={{ color: '#06b6d4' }}></i>
                    <span>Accessories & Bags</span>
                  </div>
                  <i className="fa fa-chevron-right" style={{ fontSize: '1.2rem', color: 'var(--text-light)' }}></i>
                </Link>
              </li>
            </ul>
          </div>
        </aside>

        {/* Main Content */}
        <main className="main">
          <div className="content">
            <Route path="/admin/dashboard" component={AdminDashboardScreen} />
            <Route path="/dashboard" component={AdminDashboardScreen} />
            <Route path="/orders" component={OrdersScreen} />
            <Route path="/profile" component={ProfileScreen} />
            <Route path="/order/:id" component={OrderScreen} />
            <Route path="/products" component={ProductsScreen} />
            <Route path="/shipping" component={ShippingScreen} />
            <Route path="/payment" component={PaymentScreen} />
            <Route path="/placeorder" component={PlaceOrderScreen} />
            <Route path="/signin" component={SigninScreen} />
            <Route path="/register" component={RegisterScreen} />
            <Route path="/product/:id" component={ProductScreen} />
            <Route path="/cart/:id?" component={CartScreen} />
            <Route path="/category/:id" component={HomeScreen} />
            <Route path="/" exact={true} component={HomeScreen} />
          </div>
        </main>

        {/* Modern Multi-Column Footer */}
        <footer className="footer">
          <div className="footer-inner">
            <div className="footer-grid">
              <div className="footer-col">
                <h4>
                  <i className="fa fa-shopping-bag" style={{ color: '#818cf8', marginRight: '0.8rem' }}></i>
                  Amazona
                </h4>
                <p>
                  Discover the latest trends in fashion, cutting-edge electronics, and everyday essentials with premium quality,
                  lightning-fast delivery, and 100% buyer protection.
                </p>
                <div className="footer-payments">
                  <i className="fa fa-cc-visa" title="Visa"></i>
                  <i className="fa fa-cc-mastercard" title="MasterCard"></i>
                  <i className="fa fa-cc-paypal" title="PayPal"></i>
                  <i className="fa fa-cc-amex" title="American Express"></i>
                </div>
              </div>

              <div className="footer-col">
                <h4>Categories</h4>
                <ul className="footer-links">
                  <li><Link to="/category/Electronics">Electronics & Wearables</Link></li>
                  <li><Link to="/category/Shirts">Shirts Collection</Link></li>
                  <li><Link to="/category/Pants">Pants & Denim</Link></li>
                  <li><Link to="/category/Footwear">Footwear & Sneakers</Link></li>
                  <li><Link to="/category/Accessories">Accessories & Bags</Link></li>
                </ul>
              </div>

              <div className="footer-col">
                <h4>Customer Care</h4>
                <ul className="footer-links">
                  <li><Link to="/profile">My Account & Orders</Link></li>
                  <li><Link to="/">Track My Order</Link></li>
                  <li><Link to="/">Shipping & Returns</Link></li>
                  <li><Link to="/">Help Center & Support</Link></li>
                </ul>
              </div>

              <div className="footer-col">
                <h4>Guaranteed Safe Checkout</h4>
                <p>
                  We prioritize your privacy and payment security with industry-standard 256-bit encryption.
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: '#10b981', fontWeight: 600, fontSize: '1.35rem' }}>
                  <i className="fa fa-shield" style={{ fontSize: '1.8rem' }}></i>
                  <span>100% Secure & Verified</span>
                </div>
              </div>
            </div>

            <div className="footer-bottom">
              <div>&copy; {new Date().getFullYear()} Amazona Store. All rights reserved.</div>
              <div>Engineered with React & Modern UI Architecture.</div>
            </div>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;

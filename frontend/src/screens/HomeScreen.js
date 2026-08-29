import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { listProducts } from '../actions/productActions';
import Rating from '../components/Rating';

function HomeScreen() {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [sortOrder, setSortOrder] = useState('');

  const params = useParams();
  const category = params.id ? params.id : '';

  const productList = useSelector((state) => state.productList);
  const { products, loading, error } = productList;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(listProducts(category, searchKeyword, sortOrder));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, category, sortOrder]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(listProducts(category, searchKeyword, sortOrder));
  };

  const sortHandler = (e) => {
    const selectedSort = e.target.value;
    setSortOrder(selectedSort);
    dispatch(listProducts(category, searchKeyword, selectedSort));
  };

  return (
    <div className="homescreen-container">
      {/* Hero Showcase Banner on Main Home */}
      {!category && !searchKeyword && (
        <>
          <div className="hero-banner">
            <div className="hero-content">
              <div className="hero-tag">
                <i className="fa fa-bolt"></i> Premium Collection 2026
              </div>
              <h1 className="hero-title">
                Elevate Your Style with <span>Modern Essentials</span>
              </h1>
              <p className="hero-subtitle">
                Explore premium apparel designed with unmatched comfort, durability, and contemporary design. Discover your signature look today.
              </p>
              <div className="hero-actions">
                <a href="#products-section" className="button accent hero-btn">
                  <i className="fa fa-shopping-bag"></i> Explore Products
                </a>
                <Link to="/category/Shirts" className="button secondary hero-btn" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}>
                  View Shirts
                </Link>
              </div>
            </div>
          </div>

          {/* Trust Value Propositions */}
          <div className="trust-bar">
            <div className="trust-card">
              <div className="trust-icon">
                <i className="fa fa-truck"></i>
              </div>
              <div className="trust-info">
                <h4>Free Shipping</h4>
                <p>On orders over $100</p>
              </div>
            </div>

            <div className="trust-card">
              <div className="trust-icon">
                <i className="fa fa-shield"></i>
              </div>
              <div className="trust-info">
                <h4>100% Secure</h4>
                <p>Protected transactions</p>
              </div>
            </div>

            <div className="trust-card">
              <div className="trust-icon">
                <i className="fa fa-refresh"></i>
              </div>
              <div className="trust-info">
                <h4>30-Day Returns</h4>
                <p>Hassle-free money back</p>
              </div>
            </div>

            <div className="trust-card">
              <div className="trust-icon">
                <i className="fa fa-headphones"></i>
              </div>
              <div className="trust-info">
                <h4>24/7 Support</h4>
                <p>Dedicated customer care</p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Category Banner if filtered */}
      {category && (
        <div className="category-banner">
          <h2>
            <i className="fa fa-tag" style={{ color: 'var(--primary)' }}></i>
            {category} Collection
          </h2>
          <Link to="/" className="back-link">
            <i className="fa fa-arrow-left"></i> View All
          </Link>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div id="products-section" className="filter-container">
        <form onSubmit={submitHandler} className="search-form">
          <div className="search-input-wrapper">
            <i className="fa fa-search"></i>
            <input
              type="text"
              className="search-input"
              placeholder="Search by name, brand, or style..."
              name="searchKeyword"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
          </div>
          <button type="submit" className="button primary btn-search">
            Search
          </button>
        </form>

        <div className="sort-container">
          <label htmlFor="sortOrder" className="sort-label">
            <i className="fa fa-sort-amount-desc" style={{ marginRight: '4px' }}></i> Sort By:
          </label>
          <select
            id="sortOrder"
            className="sort-select"
            value={sortOrder}
            onChange={sortHandler}
          >
            <option value="">Newest Arrivals</option>
            <option value="lowest">Price: Low to High</option>
            <option value="highest">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Product List Content */}
      {loading ? (
        <div className="loading-spinner">
          <i className="fa fa-circle-o-notch fa-spin" style={{ marginRight: '1rem', fontSize: '2rem' }}></i>
          Loading top products...
        </div>
      ) : error ? (
        <div className="alert alert-error">
          <i className="fa fa-exclamation-circle" style={{ fontSize: '1.8rem' }}></i>
          <span>{error}</span>
        </div>
      ) : (
        <div className="products-grid">
          {products && products.length > 0 ? (
            products.map((product) => (
              <div key={product._id} className="product-card">
                <Link to={`/product/${product._id}`} className="product-image-link">
                  <img
                    className="product-image"
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80';
                    }}
                  />
                  <span
                    className={`product-badge-stock ${
                      product.countInStock > 0 ? 'badge-success' : 'badge-danger'
                    }`}
                  >
                    {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                  </span>
                </Link>
                <div className="product-info">
                  <div className="product-brand-tag">{product.brand}</div>
                  <div className="product-name">
                    <Link to={`/product/${product._id}`} title={product.name}>
                      {product.name}
                    </Link>
                  </div>
                  <div className="product-rating">
                    <Rating
                      value={product.rating}
                      text={`${product.numReviews || 0} reviews`}
                    />
                  </div>
                  <div className="product-card-footer">
                    <div className="product-price">
                      <span className="currency">$</span>
                      {product.price}
                    </div>
                    <Link
                      to={`/product/${product._id}`}
                      className="btn-card-action"
                      title="View Details"
                    >
                      <i className="fa fa-arrow-right"></i>
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-products">
              <div className="no-products-icon">
                <i className="fa fa-shopping-basket"></i>
              </div>
              <h3>No products found</h3>
              <p>Try searching with different keywords or clear your filters.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default HomeScreen;
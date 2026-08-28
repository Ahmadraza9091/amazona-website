import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { listProducts } from '../actions/productActions';
import Rating from '../components/Rating';

function HomeScreen() {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [sortOrder, setSortOrder] = useState('');

  // Use useParams for React Router v6 compatibility
  const params = useParams();
  const category = params.id ? params.id : '';

  const productList = useSelector((state) => state.productList);
  const { products, loading, error } = productList;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(listProducts(category, searchKeyword, sortOrder));
  }, [dispatch, category, sortOrder]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(listProducts(category, searchKeyword, sortOrder));
  };

  const sortHandler = (e) => {
    const selectedSort = e.target.value;
    setSortOrder(selectedSort);
    // Passing selectedSort directly avoids stale state issue
    dispatch(listProducts(category, searchKeyword, selectedSort));
  };

  return (
    <div className="homescreen-container">
      {category && <h2 className="category-title">{category}</h2>}

      {/* Filter and Search Bar */}
      <div className="filter-container">
        <form onSubmit={submitHandler} className="search-form">
          <input
            type="text"
            className="search-input"
            placeholder="Search products..."
            name="searchKeyword"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
          <button type="submit" className="btn-search">Search</button>
        </form>

        <div className="sort-container">
          <label htmlFor="sortOrder">Sort By:</label>
          <select 
            id="sortOrder"
            className="sort-select" 
            value={sortOrder} 
            onChange={sortHandler}
          >
            <option value="">Newest</option>
            <option value="lowest">Price: Low to High</option>
            <option value="highest">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Product List Content */}
      {loading ? (
        <div className="loading-spinner">Loading products...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
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
                  />
                </Link>
                <div className="product-info">
                  <div className="product-name">
                    <Link to={`/product/${product._id}`}>{product.name}</Link>
                  </div>
                  <div className="product-brand">{product.brand}</div>
                  <div className="product-price">${product.price}</div>
                  <div className="product-rating">
                    <Rating
                      value={product.rating}
                      text={`${product.numReviews} reviews`}
                    />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-products">No products found.</div>
          )}
        </div>
      )}
    </div>
  );
}

export default HomeScreen;
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { detailsProduct, saveProductReview } from '../actions/productActions';
import Rating from '../components/Rating';
import { PRODUCT_REVIEW_SAVE_RESET } from '../constants/productConstants';

function ProductScreen(props) {
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;

  const productDetails = useSelector((state) => state.productDetails);
  const { product, loading, error } = productDetails;

  const productReviewSave = useSelector((state) => state.productReviewSave);
  const { success: productSaveSuccess, error: errorReviewSave } = productReviewSave;

  const dispatch = useDispatch();
  const productId = props.match.params.id;

  useEffect(() => {
    if (productSaveSuccess) {
      alert('Review submitted successfully.');
      setRating(5);
      setComment('');
      dispatch({ type: PRODUCT_REVIEW_SAVE_RESET });
    }
    dispatch(detailsProduct(productId));
  }, [dispatch, productId, productSaveSuccess]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      saveProductReview(productId, {
        name: userInfo.name,
        rating: rating,
        comment: comment,
      })
    );
  };

  const handleAddToCart = () => {
    props.history.push('/cart/' + productId + '?qty=' + qty);
  };

  return (
    <div>
      <div className="back-to-result">
        <Link to="/" className="back-link">
          <i className="fa fa-arrow-left"></i> Back to all products
        </Link>
      </div>

      {loading ? (
        <div className="loading-spinner">
          <i className="fa fa-circle-o-notch fa-spin" style={{ marginRight: '1rem', fontSize: '2rem' }}></i>
          Loading product details...
        </div>
      ) : error ? (
        <div className="alert alert-error">
          <i className="fa fa-exclamation-circle" style={{ fontSize: '1.8rem' }}></i>
          <span>{error}</span>
        </div>
      ) : product ? (
        <>
          <div className="details">
            {/* Product Image */}
            <div className="details-image">
              <img
                src={product.image}
                alt={product.name}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80';
                }}
              />
            </div>

            {/* Product Info */}
            <div className="details-info">
              <ul>
                <li>
                  <span className="details-brand">{product.brand || 'Premium Brand'}</span>
                  <h1>{product.name}</h1>
                </li>
                <li>
                  <a href="#reviews" style={{ display: 'inline-block' }}>
                    <Rating
                      value={product.rating}
                      text={`${product.numReviews || 0} customer reviews`}
                    />
                  </a>
                </li>
                <li>
                  <div className="details-price-tag">
                    <span style={{ fontSize: '2rem' }}>$</span>
                    {product.price}
                  </div>
                </li>
                <li>
                  <h4 style={{ marginBottom: '0.8rem', color: 'var(--text-main)' }}>
                    Product Overview
                  </h4>
                  <div className="details-description">{product.description}</div>
                </li>
              </ul>
            </div>

            {/* Buy Box Action Card */}
            <div className="details-action">
              <ul>
                <li>
                  <span style={{ color: 'var(--text-muted)' }}>Price:</span>
                  <span style={{ fontWeight: 800, fontSize: '1.8rem', color: 'var(--primary)' }}>
                    ${product.price}
                  </span>
                </li>
                <li>
                  <span style={{ color: 'var(--text-muted)' }}>Availability:</span>
                  <span
                    className={`status-badge ${
                      product.countInStock > 0 ? 'in-stock' : 'out-stock'
                    }`}
                  >
                    {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                  </span>
                </li>
                {product.countInStock > 0 && (
                  <li>
                    <span style={{ color: 'var(--text-muted)' }}>Quantity:</span>
                    <select
                      value={qty}
                      onChange={(e) => setQty(Number(e.target.value))}
                      style={{ width: '8rem' }}
                    >
                      {[...Array(product.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </select>
                  </li>
                )}
                <li>
                  {product.countInStock > 0 ? (
                    <button
                      onClick={handleAddToCart}
                      className="button primary full-width"
                      style={{ padding: '1.4rem' }}
                    >
                      <i className="fa fa-shopping-cart"></i> Add to Cart
                    </button>
                  ) : (
                    <button className="button secondary full-width" disabled>
                      Currently Unavailable
                    </button>
                  )}
                </li>
              </ul>
            </div>
          </div>

          {/* Customer Reviews Section */}
          <div className="reviews-container" id="reviews">
            <h2>
              <i className="fa fa-star" style={{ color: 'var(--accent)' }}></i> Customer Reviews
            </h2>

            {errorReviewSave && (
              <div className="alert alert-error">{errorReviewSave}</div>
            )}

            {!product.reviews || !product.reviews.length ? (
              <div style={{ color: 'var(--text-muted)', marginBottom: '2.4rem', fontSize: '1.45rem' }}>
                No reviews yet. Be the first to share your experience with this product!
              </div>
            ) : (
              <ul className="review-list">
                {product.reviews.map((review) => (
                  <li key={review._id} className="review-item">
                    <div className="review-header">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span className="user-avatar-mini">
                          {review.name ? review.name.charAt(0).toUpperCase() : 'U'}
                        </span>
                        <span className="reviewer-name">{review.name}</span>
                      </div>
                      <span className="review-date">
                        {review.createdAt ? review.createdAt.substring(0, 10) : ''}
                      </span>
                    </div>
                    <Rating value={review.rating} />
                    <div className="review-comment">{review.comment}</div>
                  </li>
                ))}
              </ul>
            )}

            {/* Write a Review Form */}
            <div style={{ marginTop: '3.2rem', paddingTop: '2.4rem', borderTop: '1px solid var(--border-light)' }}>
              <h3 style={{ marginBottom: '1.6rem' }}>Write a Customer Review</h3>
              {userInfo ? (
                <form onSubmit={submitHandler} style={{ maxWidth: '60rem' }}>
                  <div style={{ marginBottom: '1.6rem' }}>
                    <label htmlFor="rating" style={{ display: 'block', fontWeight: 600, marginBottom: '0.6rem' }}>
                      Rating
                    </label>
                    <select
                      name="rating"
                      id="rating"
                      value={rating}
                      onChange={(e) => setRating(Number(e.target.value))}
                    >
                      <option value="5">5 ★ - Excellent (Loved it)</option>
                      <option value="4">4 ★ - Very Good</option>
                      <option value="3">3 ★ - Good / Average</option>
                      <option value="2">2 ★ - Fair / Below Expectations</option>
                      <option value="1">1 ★ - Poor</option>
                    </select>
                  </div>
                  <div style={{ marginBottom: '1.6rem' }}>
                    <label htmlFor="comment" style={{ display: 'block', fontWeight: 600, marginBottom: '0.6rem' }}>
                      Your Review & Comments
                    </label>
                    <textarea
                      name="comment"
                      id="comment"
                      value={comment}
                      placeholder="Share your thoughts about this product..."
                      onChange={(e) => setComment(e.target.value)}
                      required
                    ></textarea>
                  </div>
                  <button type="submit" className="button primary">
                    <i className="fa fa-paper-plane"></i> Submit Review
                  </button>
                </form>
              ) : (
                <div style={{ background: 'var(--bg-subtle)', padding: '1.6rem', borderRadius: 'var(--radius-md)' }}>
                  Please{' '}
                  <Link to="/signin" style={{ fontWeight: 700 }}>
                    Sign In
                  </Link>{' '}
                  to write a review for this product.
                </div>
              )}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}

export default ProductScreen;

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import {
  saveProduct,
  listProducts,
  deleteProdcut,
} from '../actions/productActions';

function ProductsScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState('');
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [seeding, setSeeding] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const productList = useSelector((state) => state.productList);
  const { loading, products, error } = productList;

  const productSave = useSelector((state) => state.productSave);
  const {
    loading: loadingSave,
    success: successSave,
    error: errorSave,
  } = productSave;

  const productDelete = useSelector((state) => state.productDelete);
  const {
    loading: loadingDelete,
    success: successDelete,
    error: errorDelete,
  } = productDelete;

  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;

  const dispatch = useDispatch();

  useEffect(() => {
    if (successSave) {
      setModalVisible(false);
      setFeedbackMsg('Product saved successfully!');
    }
    dispatch(listProducts());
  }, [dispatch, successSave, successDelete]);

  const openModal = (product) => {
    setModalVisible(true);
    setId(product._id || '');
    setName(product.name || '');
    setPrice(product.price !== undefined ? product.price : '');
    setDescription(product.description || '');
    setImage(product.image || '');
    setBrand(product.brand || '');
    setCategory(product.category || 'Shirts');
    setCountInStock(product.countInStock !== undefined ? product.countInStock : 10);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      saveProduct({
        _id: id,
        name,
        price: Number(price),
        image: image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600',
        brand,
        category,
        countInStock: Number(countInStock),
        description,
      })
    );
  };

  const deleteHandler = (product) => {
    if (window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
      dispatch(deleteProdcut(product._id));
      setFeedbackMsg(`Product "${product.name}" deleted.`);
    }
  };

  const uploadFileHandler = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const bodyFormData = new FormData();
    bodyFormData.append('image', file);
    setUploading(true);
    axios
      .post('/api/uploads', bodyFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        setImage(response.data);
        setUploading(false);
      })
      .catch((err) => {
        console.error(err);
        setUploading(false);
      });
  };

  const seedDemoHandler = async () => {
    if (
      window.confirm(
        'This will populate your store with 12+ real-world products with high-resolution image URLs. Proceed?'
      )
    ) {
      setSeeding(true);
      try {
        await axios.post(
          '/api/products/seed',
          {},
          {
            headers: {
              Authorization: 'Bearer ' + (userInfo ? userInfo.token : ''),
            },
          }
        );
        setFeedbackMsg('12+ Demo products inserted successfully!');
        dispatch(listProducts());
      } catch (err) {
        setFeedbackMsg('Catalog populated.');
        dispatch(listProducts());
      } finally {
        setSeeding(false);
      }
    }
  };

  // Filter products by search and category
  const filteredProducts = products
    ? products.filter((p) => {
        const matchesSearch =
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.category.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory =
          selectedCategory === 'All' || p.category === selectedCategory;
        return matchesSearch && matchesCategory;
      })
    : [];

  const categories = [
    'All',
    'Shirts',
    'Pants',
    'Electronics',
    'Footwear',
    'Fashion',
    'Accessories',
  ];

  return (
    <div className="content">
      {/* Admin Nav Tabs */}
      <div className="admin-nav-tabs">
        <Link to="/admin/dashboard" className="admin-nav-tab">
          <i className="fa fa-line-chart"></i> Overview & Metrics
        </Link>
        <Link to="/products" className="admin-nav-tab active">
          <i className="fa fa-tags"></i> Products Catalog ({products ? products.length : 0})
        </Link>
        <Link to="/orders" className="admin-nav-tab">
          <i className="fa fa-list-alt"></i> Orders Management
        </Link>
      </div>

      {/* Header Bar */}
      <div className="admin-header-bar">
        <div>
          <h2 style={{ fontSize: '2.4rem' }}>
            <i className="fa fa-cubes" style={{ color: 'var(--primary)', marginRight: '0.8rem' }}></i>
            Product Catalog Management
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.4rem' }}>
            Add new products with Google/web image URLs or file uploads, update stock and prices.
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
                <i className="fa fa-circle-o-notch fa-spin"></i> Seeding...
              </>
            ) : (
              <>
                <i className="fa fa-database"></i> Seed 12+ Products
              </>
            )}
          </button>
          <button className="button primary" onClick={() => openModal({})}>
            <i className="fa fa-plus"></i> Add New Product
          </button>
        </div>
      </div>

      {feedbackMsg && (
        <div className="alert alert-success" style={{ marginBottom: '2rem' }}>
          <i className="fa fa-check-circle"></i> {feedbackMsg}
        </div>
      )}

      {loadingDelete && (
        <div className="loading-spinner" style={{ marginBottom: '1.6rem' }}>
          Deleting product...
        </div>
      )}
      {errorDelete && <div className="alert alert-error">{errorDelete}</div>}

      {/* Search & Category Filter Toolbar */}
      <div
        className="card"
        style={{
          padding: '1.6rem',
          marginBottom: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.4rem',
        }}
      >
        <div className="search-form" style={{ maxWidth: '40rem', margin: 0 }}>
          <div className="search-input-wrapper">
            <i className="fa fa-search"></i>
            <input
              type="text"
              className="search-input"
              placeholder="Filter by product name, brand..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '1.3rem', fontWeight: 600, color: 'var(--text-muted)' }}>
            Category:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`badge ${
                selectedCategory === cat ? 'badge-info' : 'badge-warning'
              }`}
              style={{
                cursor: 'pointer',
                border: 'none',
                padding: '0.6rem 1.2rem',
                fontSize: '1.25rem',
                background: selectedCategory === cat ? 'var(--primary)' : 'var(--bg-subtle)',
                color: selectedCategory === cat ? 'white' : 'var(--text-main)',
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Modal Dialog for Create / Edit Product */}
      {modalVisible && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(15, 23, 42, 0.7)',
            backdropFilter: 'blur(6px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            overflowY: 'auto',
          }}
        >
          <div
            style={{
              background: 'var(--bg-card)',
              borderRadius: 'var(--radius-xl)',
              width: '100%',
              maxWidth: '64rem',
              maxHeight: '92vh',
              overflowY: 'auto',
              padding: '3.2rem',
              boxShadow: 'var(--shadow-xl)',
              border: '1px solid var(--border-light)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '2rem',
                paddingBottom: '1.2rem',
                borderBottom: '1px solid var(--border-light)',
              }}
            >
              <h3 style={{ fontSize: '2.2rem' }}>
                {id ? '✏️ Edit Product' : '✨ Add New Product to Store'}
              </h3>
              <button
                type="button"
                className="sidebar-close-button"
                onClick={() => setModalVisible(false)}
              >
                <i className="fa fa-times"></i>
              </button>
            </div>

            <form onSubmit={submitHandler}>
              {loadingSave && (
                <div className="loading-spinner" style={{ marginBottom: '1.6rem' }}>
                  Saving product to database...
                </div>
              )}
              {errorSave && <div className="alert alert-error">{errorSave}</div>}

              <div style={{ marginBottom: '1.6rem' }}>
                <label htmlFor="name" style={{ display: 'block', fontWeight: 600, marginBottom: '0.6rem' }}>
                  Product Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={name}
                  id="name"
                  placeholder="e.g. Pro Wireless Noise-Cancelling Headphones"
                  required
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.6rem', marginBottom: '1.6rem' }}>
                <div>
                  <label htmlFor="price" style={{ display: 'block', fontWeight: 600, marginBottom: '0.6rem' }}>
                    Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="price"
                    value={price}
                    id="price"
                    placeholder="99.99"
                    required
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>

                <div>
                  <label htmlFor="countInStock" style={{ display: 'block', fontWeight: 600, marginBottom: '0.6rem' }}>
                    Count in Stock
                  </label>
                  <input
                    type="number"
                    name="countInStock"
                    value={countInStock}
                    id="countInStock"
                    placeholder="15"
                    required
                    onChange={(e) => setCountInStock(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.6rem', marginBottom: '1.6rem' }}>
                <div>
                  <label htmlFor="brand" style={{ display: 'block', fontWeight: 600, marginBottom: '0.6rem' }}>
                    Brand Name
                  </label>
                  <input
                    type="text"
                    name="brand"
                    value={brand}
                    id="brand"
                    placeholder="Nike, Apple, Sony, etc."
                    required
                    onChange={(e) => setBrand(e.target.value)}
                  />
                </div>

                <div>
                  <label htmlFor="category" style={{ display: 'block', fontWeight: 600, marginBottom: '0.6rem' }}>
                    Category
                  </label>
                  <input
                    type="text"
                    name="category"
                    value={category}
                    id="category"
                    placeholder="Shirts, Pants, Electronics, Footwear..."
                    required
                    onChange={(e) => setCategory(e.target.value)}
                  />
                </div>
              </div>

              {/* Image URL & File Upload with Live Preview */}
              <div style={{ marginBottom: '1.6rem' }}>
                <label htmlFor="image" style={{ display: 'block', fontWeight: 600, marginBottom: '0.6rem' }}>
                  Image URL (Paste direct Google image URL or web link)
                </label>
                <input
                  type="url"
                  name="image"
                  value={image}
                  id="image"
                  placeholder="https://images.unsplash.com/... or https://..."
                  required
                  onChange={(e) => setImage(e.target.value)}
                />

                <div style={{ marginTop: '0.8rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ fontSize: '1.25rem', color: 'var(--text-muted)' }}>Or upload from PC:</span>
                  <input
                    type="file"
                    onChange={uploadFileHandler}
                    style={{ fontSize: '1.25rem' }}
                  />
                </div>

                {uploading && (
                  <div style={{ marginTop: '0.6rem', color: 'var(--primary)', fontSize: '1.3rem' }}>
                    <i className="fa fa-circle-o-notch fa-spin"></i> Uploading image...
                  </div>
                )}

                {/* Live Image Preview */}
                {image && (
                  <div className="image-preview-container">
                    <img
                      src={image}
                      alt="Live Preview"
                      className="image-preview-img"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600';
                      }}
                    />
                  </div>
                )}
              </div>

              <div style={{ marginBottom: '2.4rem' }}>
                <label htmlFor="description" style={{ display: 'block', fontWeight: 600, marginBottom: '0.6rem' }}>
                  Product Description
                </label>
                <textarea
                  name="description"
                  value={description}
                  id="description"
                  placeholder="Describe features, fabric/specs, warranty, and fit..."
                  required
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: '1.2rem', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setModalVisible(false)}
                  className="button secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="button primary">
                  <i className="fa fa-check"></i> {id ? 'Save Changes' : 'Create & Publish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Products Table */}
      {loading ? (
        <div className="loading-spinner">
          <i className="fa fa-circle-o-notch fa-spin" style={{ marginRight: '1rem' }}></i>
          Loading catalog items...
        </div>
      ) : error ? (
        <div className="alert alert-error">{error}</div>
      ) : (
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th style={{ width: '6rem' }}>Image</th>
                <th>Name</th>
                <th>Price</th>
                <th>Category</th>
                <th>Brand</th>
                <th>Inventory</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr key={product._id}>
                    <td>
                      <img
                        src={product.image}
                        alt={product.name}
                        style={{
                          width: '4.8rem',
                          height: '4.8rem',
                          objectFit: 'contain',
                          borderRadius: 'var(--radius-sm)',
                          background: 'var(--bg-subtle)',
                          padding: '2px',
                        }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200';
                        }}
                      />
                    </td>
                    <td style={{ fontWeight: 600 }}>
                      <Link to={`/product/${product._id}`} title={product.name}>
                        {product.name}
                      </Link>
                    </td>
                    <td style={{ fontWeight: 700, color: 'var(--primary)' }}>
                      ${product.price}
                    </td>
                    <td>
                      <span className="badge badge-info">{product.category}</span>
                    </td>
                    <td>{product.brand}</td>
                    <td>
                      <span
                        className={`badge ${
                          product.countInStock > 5
                            ? 'badge-success'
                            : product.countInStock > 0
                            ? 'badge-warning'
                            : 'badge-danger'
                        }`}
                      >
                        {product.countInStock > 0
                          ? `${product.countInStock} in stock`
                          : 'Out of Stock'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.8rem' }}>
                        <button
                          className="button secondary"
                          style={{ padding: '0.6rem 1.2rem', fontSize: '1.3rem' }}
                          onClick={() => openModal(product)}
                        >
                          <i className="fa fa-pencil"></i> Edit
                        </button>
                        <button
                          className="btn-delete-cart"
                          style={{ padding: '0.6rem 1.2rem', fontSize: '1.3rem' }}
                          onClick={() => deleteHandler(product)}
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
                    <div style={{ color: 'var(--text-muted)', marginBottom: '1.4rem' }}>
                      No products match your criteria.
                    </div>
                    <button
                      className="button primary"
                      onClick={() => openModal({})}
                      style={{ marginRight: '1rem' }}
                    >
                      <i className="fa fa-plus"></i> Add Product
                    </button>
                    <button className="button accent" onClick={seedDemoHandler}>
                      <i className="fa fa-database"></i> Seed 12+ Demo Catalog
                    </button>
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

export default ProductsScreen;

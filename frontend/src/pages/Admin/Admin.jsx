import React, { useContext, useState } from "react";
import "./Admin.css";
import { FoodContext } from "../../context/FoodContext";
import {
  BiShield, BiPackage, BiCheckCircle, BiTimeFive, BiCar, BiDollarCircle,
  BiUser, BiPhone, BiMapPin, BiPlus, BiTrash, BiFilter, BiLogOut,
  BiEdit, BiSearch, BiBarChartAlt2, BiStore, BiCategory,
  BiCheck, BiX, BiRefresh
} from "react-icons/bi";
import { MdDeliveryDining, MdSend } from "react-icons/md";
import { FaBullhorn } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const statusFilters = ["All", "Pending Verification", "Out for Delivery", "Delivered", "Cancelled"];
const CATEGORIES = ["Salad", "Rolls", "Deserts", "Sandwich", "Cake", "Pure Veg", "Pasta", "Noodles"];

const Admin = () => {
  const {
    orders, assignDeliveryPartner, updateOrderStatus,
    DELIVERY_PARTNERS, products, addProduct, editProduct,
    toggleProductStock, deleteProduct, currency,
    bannerText, updateBannerText
  } = useContext(FoodContext);

  const navigate = useNavigate();

  // Navigation state: "orders" | "menu" | "banner" | "analytics"
  const [activeTab, setActiveTab]             = useState("orders");

  // Orders filters & search
  const [orderFilter, setOrderFilter]         = useState("All");
  const [orderSearch, setOrderSearch]         = useState("");
  const [selectedOrder, setSelectedOrder]     = useState(null);
  const [assignModal, setAssignModal]         = useState(null);

  // Menu filters & search
  const [menuSearch, setMenuSearch]           = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Modals state
  const [showAddModal, setShowAddModal]       = useState(false);
  const [editingProduct, setEditingProduct]   = useState(null); // Product object when editing

  // Add Product form state
  const [newProduct, setNewProduct]           = useState({
    name: "", category: "Salad", price: "", description: "", image: "", rating: 4.5
  });

  // Edit Product form state
  const [editForm, setEditForm]               = useState({
    name: "", category: "Salad", price: "", description: "", image: "", rating: 4.5
  });

  // Announcement Banner form state
  const [announcementInput, setAnnouncementInput] = useState(bannerText || "");

  /* ── Admin Logout ───────────────────────────────────── */
  const handleAdminLogout = () => {
    localStorage.removeItem("adminToken");
    toast.info("Admin logged out");
    navigate("/admin-login");
  };

  /* ── Add Product Handler ────────────────────────────── */
  const handleCreateProduct = (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) {
      toast.error("Please provide dish name and price");
      return;
    }
    addProduct({
      ...newProduct,
      price: Number(newProduct.price),
      rating: Number(newProduct.rating) || 4.5,
      image: newProduct.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop"
    });
    setNewProduct({ name: "", category: "Salad", price: "", description: "", image: "", rating: 4.5 });
    setShowAddModal(false);
  };

  /* ── Open Edit Product Modal ───────────────────────── */
  const handleOpenEdit = (product) => {
    setEditingProduct(product);
    setEditForm({
      name: product.name || "",
      category: product.category || "Salad",
      price: product.price || "",
      description: product.description || "",
      image: product.image || "",
      rating: product.rating || 4.5
    });
  };

  /* ── Submit Edit Product ───────────────────────────── */
  const handleUpdateProduct = (e) => {
    e.preventDefault();
    if (!editingProduct) return;
    if (!editForm.name || !editForm.price) {
      toast.error("Please provide dish name and price");
      return;
    }
    editProduct(editingProduct._id, {
      ...editForm,
      price: Number(editForm.price),
      rating: Number(editForm.rating) || 4.5
    });
    setEditingProduct(null);
  };

  /* ── Banner Update Handler ──────────────────────────── */
  const handleSaveBanner = (e) => {
    e.preventDefault();
    updateBannerText(announcementInput);
  };

  /* ── Order Filtering Logic ──────────────────────────── */
  const filteredOrders = orders.filter(o => {
    const matchesFilter = orderFilter === "All" || o.status === orderFilter;
    const matchesSearch =
      !orderSearch ||
      o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customerPhone.includes(orderSearch);
    return matchesFilter && matchesSearch;
  });

  /* ── Menu Filtering Logic ───────────────────────────── */
  const filteredProducts = products.filter(p => {
    const matchesCat = selectedCategory === "All" || p.category === selectedCategory;
    const matchesSearch =
      !menuSearch ||
      p.name.toLowerCase().includes(menuSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(menuSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  /* ── Metrics & Stats Calculations ───────────────────── */
  const pendingCount   = orders.filter(o => o.status === "Pending Verification").length;
  const activeCount    = orders.filter(o => o.status === "Out for Delivery").length;
  const deliveredCount = orders.filter(o => o.status === "Delivered").length;
  const totalRevenue   = orders.filter(o => o.status === "Delivered").reduce((sum, o) => sum + o.total, 0);

  const statusColorMap = {
    "Pending Verification": "orange",
    "Verified by Admin":    "blue",
    "Out for Delivery":     "purple",
    "Delivered":            "green",
    "Cancelled":            "red"
  };

  /* ── Handle partner assignment ──────────────────────── */
  const handleAssignPartner = (partner) => {
    assignDeliveryPartner(assignModal.id, partner);
    setAssignModal(null);
    setSelectedOrder(null);
  };

  return (
    <div className="admin-container">

      {/* ── Admin Header ──────────────────────────────── */}
      <div className="admin-header">
        <div className="admin-title-area">
          <div className="admin-logo-badge">
            <BiShield className="admin-logo-icon" />
          </div>
          <div>
            <h1>Admin Control Panel <span className="admin-role-tag">Super Admin</span></h1>
            <p>Manage orders, menu items, website announcements &amp; analytics live.</p>
          </div>
        </div>
        <div className="admin-header-right">
          <div className="admin-tab-switcher">
            <button
              className={`tab-btn ${activeTab === "orders" ? "active" : ""}`}
              onClick={() => setActiveTab("orders")}
            >
              <BiPackage /> Orders
              {pendingCount > 0 && <span className="tab-badge">{pendingCount}</span>}
            </button>

            <button
              className={`tab-btn ${activeTab === "menu" ? "active" : ""}`}
              onClick={() => setActiveTab("menu")}
            >
              <BiStore /> Menu Catalog ({products.length})
            </button>

            <button
              className={`tab-btn ${activeTab === "banner" ? "active" : ""}`}
              onClick={() => setActiveTab("banner")}
            >
              <FaBullhorn /> Site Banner
            </button>

            <button
              className={`tab-btn ${activeTab === "analytics" ? "active" : ""}`}
              onClick={() => setActiveTab("analytics")}
            >
              <BiBarChartAlt2 /> Analytics
            </button>
          </div>
          <button className="admin-logout-btn" onClick={handleAdminLogout}>
            <BiLogOut /> Logout
          </button>
        </div>
      </div>

      {/* ── Top Stats Cards ───────────────────────────── */}
      <div className="admin-stats-row">
        <div className="admin-stat-card orange">
          <BiTimeFive className="stat-ico" />
          <div>
            <h3>{pendingCount}</h3>
            <p>Pending Verification</p>
          </div>
        </div>
        <div className="admin-stat-card purple">
          <BiCar className="stat-ico" />
          <div>
            <h3>{activeCount}</h3>
            <p>Out for Delivery</p>
          </div>
        </div>
        <div className="admin-stat-card green">
          <BiCheckCircle className="stat-ico" />
          <div>
            <h3>{deliveredCount}</h3>
            <p>Delivered Orders</p>
          </div>
        </div>
        <div className="admin-stat-card blue">
          <BiDollarCircle className="stat-ico" />
          <div>
            <h3>{currency}{totalRevenue}</h3>
            <p>Total Revenue</p>
          </div>
        </div>
      </div>

      {/* ── TAB 1: ORDERS MANAGEMENT ───────────────────── */}
      {activeTab === "orders" && (
        <div className="orders-management-section">
          {/* Search & Filter Bar */}
          <div className="admin-toolbar">
            <div className="admin-search-box">
              <BiSearch className="search-ico" />
              <input
                type="text"
                placeholder="Search by Order ID, Customer Name, Phone..."
                value={orderSearch}
                onChange={e => setOrderSearch(e.target.value)}
              />
              {orderSearch && (
                <button className="clear-search-btn" onClick={() => setOrderSearch("")}>
                  <BiX />
                </button>
              )}
            </div>

            <div className="filter-bar">
              <BiFilter className="filter-ico" />
              <span>Status:</span>
              <div className="filter-pills">
                {statusFilters.map(f => (
                  <button
                    key={f}
                    className={`filter-pill ${orderFilter === f ? "active" : ""}`}
                    onClick={() => setOrderFilter(f)}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Orders Table */}
          <div className="orders-table-card">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total Amount</th>
                  <th>Status</th>
                  <th>Delivery Partner</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length > 0 ? filteredOrders.map(order => (
                  <tr key={order.id} className="order-row">
                    <td className="order-id-cell">
                      <strong>{order.id}</strong>
                      <span className="order-date-small">{order.date}</span>
                    </td>
                    <td>
                      <div className="customer-cell">
                        <BiUser className="cell-icon" />
                        <div>
                          <strong>{order.customerName}</strong>
                          <span>{order.customerPhone}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="items-count">
                        {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                      </span>
                    </td>
                    <td className="total-cell"><strong>{currency}{order.total}</strong></td>
                    <td>
                      <span className={`status-badge ${statusColorMap[order.status] || "orange"}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>
                      {order.assignedDeliveryBoy ? (
                        <div className="assigned-db">
                          <MdDeliveryDining className="db-icon" />
                          <span>{order.assignedDeliveryBoy.name}</span>
                        </div>
                      ) : (
                        <span className="unassigned-tag">Unassigned</span>
                      )}
                    </td>
                    <td>
                      <div className="action-btns">
                        <button
                          className="view-detail-btn"
                          onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                        >
                          {selectedOrder?.id === order.id ? "Hide" : "View"}
                        </button>

                        {order.status === "Pending Verification" && (
                          <button className="send-delivery-btn" onClick={() => setAssignModal(order)}>
                            <MdSend /> Assign Delivery
                          </button>
                        )}

                        {order.status === "Out for Delivery" && (
                          <>
                            <button className="assign-btn secondary" onClick={() => setAssignModal(order)}>
                              Reassign
                            </button>
                            <button
                              className="mark-delivered-btn"
                              onClick={() => updateOrderStatus(order.id, "Delivered")}
                            >
                              <BiCheck /> Delivered
                            </button>
                          </>
                        )}

                        {order.status === "Pending Verification" && (
                          <button
                            className="cancel-order-btn"
                            onClick={() => updateOrderStatus(order.id, "Cancelled")}
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="7" className="no-orders-row">No matching orders found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Order Detail Drawer Panel */}
          {selectedOrder && (
            <div className="order-detail-panel">
              <div className="detail-panel-header">
                <h3>Order Details — {selectedOrder.id}</h3>
                <button className="close-detail-btn" onClick={() => setSelectedOrder(null)}><BiX /></button>
              </div>
              <div className="detail-grid">
                <div className="detail-col">
                  <p><BiUser className="d-icon" /> <strong>Customer Name:</strong> {selectedOrder.customerName}</p>
                  <p><BiPhone className="d-icon" /> <strong>Phone:</strong> {selectedOrder.customerPhone}</p>
                  <p><BiMapPin className="d-icon" /> <strong>Delivery Address:</strong> {selectedOrder.address}</p>
                  <p><strong>Payment Method:</strong> {selectedOrder.paymentMethod === "cod" ? "Cash on Delivery 💵" : "Stripe Online 💳"}</p>
                  {selectedOrder.assignedDeliveryBoy && (
                    <p>
                      <MdDeliveryDining className="d-icon" />
                      <strong> Assigned Delivery Boy:</strong> {selectedOrder.assignedDeliveryBoy.name} ({selectedOrder.assignedDeliveryBoy.phone})
                    </p>
                  )}
                </div>
                <div className="detail-col">
                  <p><strong>Itemized Order Summary:</strong></p>
                  {selectedOrder.items.map((item, i) => (
                    <div key={i} className="detail-item-row">
                      {item.product && <img src={item.product.image} alt={item.product.name} />}
                      <span>
                        <strong>{item.product?.name}</strong> × {item.quantity} = {currency}{item.product?.price * item.quantity}
                      </span>
                    </div>
                  ))}
                  <div className="detail-total-box">
                    <span>Total Amount Paid:</span>
                    <strong>{currency}{selectedOrder.total}</strong>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── TAB 2: MENU & PRODUCT CATALOG (FULL CRUD) ──── */}
      {activeTab === "menu" && (
        <div className="menu-editor-section">
          {/* Header & Controls */}
          <div className="menu-editor-header">
            <div>
              <h2 className="section-heading">Menu &amp; Product Catalog Management</h2>
              <p className="section-sub">Add new dishes, edit prices/descriptions, toggle availability, or remove items live.</p>
            </div>
            <button className="add-product-btn" onClick={() => setShowAddModal(true)}>
              <BiPlus /> Add New Dish
            </button>
          </div>

          {/* Search & Category Filter Pills */}
          <div className="admin-toolbar">
            <div className="admin-search-box">
              <BiSearch className="search-ico" />
              <input
                type="text"
                placeholder="Search dishes by name or category..."
                value={menuSearch}
                onChange={e => setMenuSearch(e.target.value)}
              />
              {menuSearch && (
                <button className="clear-search-btn" onClick={() => setMenuSearch("")}>
                  <BiX />
                </button>
              )}
            </div>

            <div className="filter-bar">
              <BiCategory className="filter-ico" />
              <span>Category:</span>
              <div className="filter-pills">
                <button
                  className={`filter-pill ${selectedCategory === "All" ? "active" : ""}`}
                  onClick={() => setSelectedCategory("All")}
                >
                  All ({products.length})
                </button>
                {CATEGORIES.map(cat => {
                  const count = products.filter(p => p.category === cat).length;
                  return (
                    <button
                      key={cat}
                      className={`filter-pill ${selectedCategory === cat ? "active" : ""}`}
                      onClick={() => setSelectedCategory(cat)}
                    >
                      {cat} ({count})
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="menu-editor-grid">
            {filteredProducts.length > 0 ? (
              filteredProducts.map(p => (
                <div key={p._id} className={`menu-editor-card ${p.outOfStock ? "out-of-stock-card" : ""}`}>
                  <div className="card-image-wrap">
                    <img src={p.image} alt={p.name} className="menu-thumb" />
                    {p.outOfStock && (
                      <span className="stock-badge out-badge">Out of Stock</span>
                    )}
                    {!p.outOfStock && (
                      <span className="stock-badge in-badge">Available</span>
                    )}
                  </div>

                  <div className="menu-card-info">
                    <div className="menu-card-title-row">
                      <strong>{p.name}</strong>
                      <span className="menu-price">{currency}{p.price}</span>
                    </div>
                    <p className="menu-desc-short">{p.description || "Freshly prepared delicious food."}</p>
                    <div className="menu-card-meta">
                      <span className="menu-cat-tag">{p.category}</span>
                      <span className="menu-rating-tag">⭐ {p.rating || 4.5}</span>
                    </div>
                  </div>

                  <div className="menu-card-actions">
                    <button
                      className="edit-product-btn"
                      onClick={() => handleOpenEdit(p)}
                      title="Edit dish details"
                    >
                      <BiEdit /> Edit
                    </button>

                    <button
                      className={`stock-toggle-btn ${p.outOfStock ? "enable-btn" : "disable-btn"}`}
                      onClick={() => toggleProductStock(p._id)}
                      title={p.outOfStock ? "Mark as In Stock" : "Mark as Out of Stock"}
                    >
                      {p.outOfStock ? "In Stock" : "Out of Stock"}
                    </button>

                    <button
                      className="delete-product-btn"
                      onClick={() => deleteProduct(p._id)}
                      title="Remove product permanently"
                    >
                      <BiTrash />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-products-box">
                <p>No dishes found matching your search/category criteria.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── TAB 3: ANNOUNCEMENT BANNER & CATEGORY CONTROL ── */}
      {activeTab === "banner" && (
        <div className="banner-management-section">
          <div className="banner-editor-card">
            <div className="banner-card-header">
              <FaBullhorn className="banner-icon" />
              <div>
                <h2>Website Announcement Banner</h2>
                <p>Set a custom message displayed across the header of the website for all users.</p>
              </div>
            </div>

            <form onSubmit={handleSaveBanner} className="banner-form">
              <div className="form-group">
                <label>Banner Text Content</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ⚡ FAST DELIVERY | 20% OFF ON FIRST ORDER WITH CODE: FOOD20"
                  value={announcementInput}
                  onChange={e => setAnnouncementInput(e.target.value)}
                />
              </div>

              <div className="banner-preview">
                <span>Live Preview:</span>
                <div className="live-banner-bar">
                  {announcementInput || "Announcement banner text will appear here..."}
                </div>
              </div>

              <div className="banner-actions">
                <button type="submit" className="save-banner-btn">
                  <BiCheck /> Save Announcement Banner
                </button>
                <button
                  type="button"
                  className="reset-banner-btn"
                  onClick={() => {
                    const defaultText = "⚡ FAST DELIVERY | 20% OFF ON FIRST ORDER WITH CODE: FOOD20";
                    setAnnouncementInput(defaultText);
                    updateBannerText(defaultText);
                  }}
                >
                  <BiRefresh /> Reset to Default
                </button>
              </div>
            </form>
          </div>

          <div className="category-overview-card">
            <h3>Menu Categories Overview</h3>
            <div className="cat-overview-grid">
              {CATEGORIES.map(cat => {
                const count = products.filter(p => p.category === cat).length;
                return (
                  <div key={cat} className="cat-stat-box">
                    <BiCategory className="cat-box-ico" />
                    <div>
                      <strong>{cat}</strong>
                      <span>{count} dishes available</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 4: ANALYTICS & REPORTS ─────────────────── */}
      {activeTab === "analytics" && (
        <div className="analytics-section">
          <div className="analytics-grid">
            {/* Revenue Metric Card */}
            <div className="analytics-card">
              <h3>Revenue Performance</h3>
              <div className="analytics-big-val">{currency}{totalRevenue}</div>
              <p className="analytics-sub text-green">▲ 18.5% compared to last week</p>
              <div className="analytics-mini-stats">
                <div>
                  <span>Total Delivered Orders</span>
                  <strong>{deliveredCount}</strong>
                </div>
                <div>
                  <span>Avg. Order Value</span>
                  <strong>
                    {currency}{deliveredCount > 0 ? Math.round(totalRevenue / deliveredCount) : 0}
                  </strong>
                </div>
              </div>
            </div>

            {/* Order Status Distribution */}
            <div className="analytics-card">
              <h3>Order Status Breakdown</h3>
              <div className="status-progress-list">
                <div className="progress-item">
                  <div className="progress-label">
                    <span>Pending Verification</span>
                    <strong>{pendingCount}</strong>
                  </div>
                  <div className="progress-track">
                    <div
                      className="progress-fill orange"
                      style={{ width: `${orders.length ? (pendingCount / orders.length) * 100 : 0}%` }}
                    />
                  </div>
                </div>

                <div className="progress-item">
                  <div className="progress-label">
                    <span>Out for Delivery</span>
                    <strong>{activeCount}</strong>
                  </div>
                  <div className="progress-track">
                    <div
                      className="progress-fill purple"
                      style={{ width: `${orders.length ? (activeCount / orders.length) * 100 : 0}%` }}
                    />
                  </div>
                </div>

                <div className="progress-item">
                  <div className="progress-label">
                    <span>Delivered</span>
                    <strong>{deliveredCount}</strong>
                  </div>
                  <div className="progress-track">
                    <div
                      className="progress-fill green"
                      style={{ width: `${orders.length ? (deliveredCount / orders.length) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick System Summary */}
          <div className="system-summary-card">
            <h3>System Status &amp; Active Resources</h3>
            <div className="system-res-grid">
              <div className="res-item">
                <MdDeliveryDining className="res-icon" />
                <div>
                  <strong>Active Delivery Boys</strong>
                  <span>{DELIVERY_PARTNERS.length} partners online</span>
                </div>
              </div>
              <div className="res-item">
                <BiStore className="res-icon" />
                <div>
                  <strong>Active Menu Items</strong>
                  <span>{products.filter(p => !p.outOfStock).length} in stock / {products.length} total</span>
                </div>
              </div>
              <div className="res-item">
                <BiUser className="res-icon" />
                <div>
                  <strong>Registered Customers</strong>
                  <span>1,420+ active buyers</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL 1: ADD DISH MODAL ──────────────────────── */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="add-edit-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header-row">
              <h3>Add New Dish to Menu</h3>
              <button className="modal-close-icon" onClick={() => setShowAddModal(false)}><BiX /></button>
            </div>
            <form onSubmit={handleCreateProduct} className="modal-form">
              <div className="form-group">
                <label>Dish Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Truffle Mushroom Pasta"
                  value={newProduct.name}
                  onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                />
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>Category *</label>
                  <select
                    value={newProduct.category}
                    onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
                  >
                    {CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Price ({currency}) *</label>
                  <input
                    type="number"
                    required
                    placeholder="299"
                    value={newProduct.price}
                    onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>Rating (1.0 to 5.0)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    placeholder="4.5"
                    value={newProduct.rating}
                    onChange={e => setNewProduct({ ...newProduct, rating: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Image URL</label>
                  <input
                    type="text"
                    placeholder="https://..."
                    value={newProduct.image}
                    onChange={e => setNewProduct({ ...newProduct, image: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  rows="3"
                  placeholder="Brief tasty description of the dish..."
                  value={newProduct.description}
                  onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
                />
              </div>

              <div className="modal-actions-row">
                <button type="submit" className="save-product-btn">Add Dish to Menu</button>
                <button type="button" className="cancel-modal-btn" onClick={() => setShowAddModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL 2: EDIT DISH MODAL ─────────────────────── */}
      {editingProduct && (
        <div className="modal-overlay" onClick={() => setEditingProduct(null)}>
          <div className="add-edit-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header-row">
              <h3>Edit Dish — {editingProduct.name}</h3>
              <button className="modal-close-icon" onClick={() => setEditingProduct(null)}><BiX /></button>
            </div>
            <form onSubmit={handleUpdateProduct} className="modal-form">
              <div className="form-group">
                <label>Dish Name *</label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                />
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>Category *</label>
                  <select
                    value={editForm.category}
                    onChange={e => setEditForm({ ...editForm, category: e.target.value })}
                  >
                    {CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Price ({currency}) *</label>
                  <input
                    type="number"
                    required
                    value={editForm.price}
                    onChange={e => setEditForm({ ...editForm, price: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>Rating (1.0 to 5.0)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={editForm.rating}
                    onChange={e => setEditForm({ ...editForm, rating: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Image URL</label>
                  <input
                    type="text"
                    value={editForm.image}
                    onChange={e => setEditForm({ ...editForm, image: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  rows="3"
                  value={editForm.description}
                  onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                />
              </div>

              <div className="modal-actions-row">
                <button type="submit" className="save-product-btn">Save Changes</button>
                <button type="button" className="cancel-modal-btn" onClick={() => setEditingProduct(null)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL 3: ASSIGN DELIVERY PARTNER ───────────── */}
      {assignModal && (
        <div className="modal-overlay" onClick={() => setAssignModal(null)}>
          <div className="assign-modal" onClick={e => e.stopPropagation()}>
            <div className="assign-modal-header">
              <MdSend className="assign-modal-icon" />
              <div>
                <h3>Assign Delivery Partner</h3>
                <p>
                  Order <strong>#{assignModal.id}</strong> · {currency}{assignModal.total} ·{" "}
                  <em>{assignModal.customerName}</em>
                </p>
              </div>
            </div>
            <div className="partner-list">
              {DELIVERY_PARTNERS.map(partner => (
                <div
                  key={partner.id}
                  className="partner-card"
                  onClick={() => handleAssignPartner(partner)}
                >
                  <div className="partner-avatar-circle">
                    {partner.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <strong>{partner.name}</strong>
                    <span>{partner.phone}</span>
                    <span>{partner.vehicle}</span>
                  </div>
                  <button className="select-partner-btn">
                    <MdSend /> Assign →
                  </button>
                </div>
              ))}
            </div>
            <button className="cancel-modal-btn" onClick={() => setAssignModal(null)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;

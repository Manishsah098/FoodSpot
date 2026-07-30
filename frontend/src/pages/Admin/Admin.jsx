import React, { useContext, useState } from "react";
import "./Admin.css";
import { FoodContext } from "../../context/FoodContext";
import {
  BiShield, BiPackage, BiCheckCircle, BiTimeFive, BiCar, BiDollarCircle,
  BiUser, BiPhone, BiMapPin, BiPlus, BiTrash, BiFilter
} from "react-icons/bi";

import { MdDeliveryDining } from "react-icons/md";

const statusFilters = ["All", "Pending Verification", "Verified by Admin", "Out for Delivery", "Delivered"];

const Admin = () => {
  const { orders, assignDeliveryPartner, updateOrderStatus, DELIVERY_PARTNERS, products, addProduct, deleteProduct, currency } = useContext(FoodContext);

  const [activeTab, setActiveTab] = useState("orders");
  const [filter, setFilter] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [assignModal, setAssignModal] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: "", category: "Salad", price: "", description: "", image: "" });

  const handleCreateProduct = (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) return;
    addProduct({
      ...newProduct,
      price: Number(newProduct.price),
      image: newProduct.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop"
    });
    setNewProduct({ name: "", category: "Salad", price: "", description: "", image: "" });
    setShowAddModal(false);
  };


  const filteredOrders = orders.filter(o => filter === "All" || o.status === filter);

  const pendingCount = orders.filter(o => o.status === "Pending Verification").length;
  const verifiedCount = orders.filter(o => o.status === "Verified by Admin").length;
  const deliveredCount = orders.filter(o => o.status === "Delivered").length;
  const totalRevenue = orders.filter(o => o.status === "Delivered").reduce((sum, o) => sum + o.total, 0);

  const statusColorMap = {
    "Pending Verification": "orange",
    "Verified by Admin": "blue",
    "Out for Delivery": "purple",
    "Delivered": "green",
    "Cancelled": "red"
  };

  return (
    <div className="admin-container">
      {/* Admin Header */}
      <div className="admin-header">
        <div className="admin-title-area">
          <BiShield className="admin-logo-icon" />
          <div>
            <h1>Admin Control Panel</h1>
            <p>Manage orders, verify deliveries, and control the menu catalog.</p>
          </div>
        </div>
        <div className="admin-tab-switcher">
          <button className={`tab-btn ${activeTab === "orders" ? "active" : ""}`} onClick={() => setActiveTab("orders")}>
            <BiPackage /> Orders
            {pendingCount > 0 && <span className="tab-badge">{pendingCount}</span>}
          </button>
          <button className={`tab-btn ${activeTab === "menu" ? "active" : ""}`} onClick={() => setActiveTab("menu")}>
            <BiPlus /> Menu Editor
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="admin-stats-row">
        <div className="admin-stat-card orange">
          <BiTimeFive className="stat-ico" />
          <div>
            <h3>{pendingCount}</h3>
            <p>Pending Orders</p>
          </div>
        </div>
        <div className="admin-stat-card blue">
          <BiCheckCircle className="stat-ico" />
          <div>
            <h3>{verifiedCount}</h3>
            <p>Verified / Active</p>
          </div>
        </div>
        <div className="admin-stat-card green">
          <BiCar className="stat-ico" />
          <div>
            <h3>{deliveredCount}</h3>
            <p>Delivered Today</p>
          </div>
        </div>
        <div className="admin-stat-card purple">
          <BiDollarCircle className="stat-ico" />
          <div>
            <h3>{currency}{totalRevenue}</h3>
            <p>Revenue Collected</p>
          </div>
        </div>
      </div>

      {/* Orders Tab */}
      {activeTab === "orders" && (
        <div className="orders-management-section">
          {/* Filter Bar */}
          <div className="filter-bar">
            <BiFilter className="filter-ico" />
            <span>Filter:</span>
            <div className="filter-pills">
              {statusFilters.map(f => (
                <button
                  key={f}
                  className={`filter-pill ${filter === f ? "active" : ""}`}
                  onClick={() => setFilter(f)}
                >
                  {f}
                </button>
              ))}
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
                  <th>Total</th>
                  <th>Status</th>
                  <th>Delivery Boy</th>
                  <th>Action</th>
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
                      <span className="items-count">{order.items.length} item{order.items.length !== 1 ? "s" : ""}</span>
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
                        <button className="view-detail-btn" onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}>
                          {selectedOrder?.id === order.id ? "Hide" : "View"}
                        </button>
                        {order.status === "Pending Verification" && (
                          <button className="assign-btn" onClick={() => setAssignModal(order)}>
                            <BiCheckCircle /> Verify & Assign
                          </button>
                        )}
                        {order.status === "Verified by Admin" && (
                          <button className="assign-btn secondary" onClick={() => setAssignModal(order)}>
                            Reassign
                          </button>
                        )}
                        {order.status === "Out for Delivery" && (
                          <button className="mark-delivered-btn" onClick={() => updateOrderStatus(order.id, "Delivered")}>
                            Mark Delivered
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="7" className="no-orders-row">No orders in this category.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Order Detail Expansion */}
          {selectedOrder && (
            <div className="order-detail-panel">
              <h3>Order Detail — {selectedOrder.id}</h3>
              <div className="detail-grid">
                <div className="detail-col">
                  <p><BiUser className="d-icon" /> <strong>Customer:</strong> {selectedOrder.customerName}</p>
                  <p><BiPhone className="d-icon" /> <strong>Phone:</strong> {selectedOrder.customerPhone}</p>
                  <p><BiMapPin className="d-icon" /> <strong>Address:</strong> {selectedOrder.address}</p>
                  <p><strong>Payment:</strong> {selectedOrder.paymentMethod === "cod" ? "Cash on Delivery" : "Stripe (Online)"}</p>
                </div>
                <div className="detail-col">
                  <p><strong>Ordered Items:</strong></p>
                  {selectedOrder.items.map((item, i) => (
                    <div key={i} className="detail-item-row">
                      {item.product && <img src={item.product.image} alt={item.product.name} />}
                      <span>{item.product?.name} × {item.quantity} = {currency}{item.product?.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Menu Editor Tab */}
      {activeTab === "menu" && (
        <div className="menu-editor-section">
          <div className="menu-editor-header">
            <div>
              <h2 className="section-heading">Menu Catalog Management</h2>
              <p className="section-sub">Add, edit or remove food items live from your menu.</p>
            </div>
            <button className="add-product-btn" onClick={() => setShowAddModal(true)}>
              + Add New Dish
            </button>
          </div>
          <div className="menu-editor-grid">
            {products.map(p => (
              <div key={p._id} className="menu-editor-card">
                <img src={p.image} alt={p.name} className="menu-thumb" />
                <div className="menu-card-info">
                  <strong>{p.name}</strong>
                  <span className="menu-cat-tag">{p.category}</span>
                  <span className="menu-price">{currency}{p.price}</span>
                </div>
                <button className="delete-product-btn" onClick={() => deleteProduct(p._id)}>
                  <BiTrash /> Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="add-edit-modal" onClick={e => e.stopPropagation()}>
            <h3>Add New Dish to Menu</h3>
            <form onSubmit={handleCreateProduct} className="modal-form">
              <div className="form-group">
                <label>Dish Name</label>
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
                  <label>Category</label>
                  <select
                    value={newProduct.category}
                    onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
                  >
                    <option value="Salad">Salad</option>
                    <option value="Rolls">Rolls</option>
                    <option value="Deserts">Deserts</option>
                    <option value="Sandwich">Sandwich</option>
                    <option value="Cake">Cake</option>
                    <option value="Pure Veg">Pure Veg</option>
                    <option value="Pasta">Pasta</option>
                    <option value="Noodles">Noodles</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Price ({currency})</label>
                  <input
                    type="number"
                    required
                    placeholder="299"
                    value={newProduct.price}
                    onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
                  />
                </div>
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
                <button type="submit" className="save-product-btn">Add Dish</button>
                <button type="button" className="cancel-modal-btn" onClick={() => setShowAddModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* Assign Delivery Modal */}
      {assignModal && (
        <div className="modal-overlay" onClick={() => setAssignModal(null)}>
          <div className="assign-modal" onClick={e => e.stopPropagation()}>
            <h3>Assign Delivery Partner</h3>
            <p>Select a delivery partner for Order <strong>#{assignModal.id}</strong></p>
            <div className="partner-list">
              {DELIVERY_PARTNERS.map(partner => (
                <div
                  key={partner.id}
                  className="partner-card"
                  onClick={() => {
                    assignDeliveryPartner(assignModal.id, partner);
                    setAssignModal(null);
                  }}
                >
                  <MdDeliveryDining className="partner-icon" />
                  <div>
                    <strong>{partner.name}</strong>
                    <span>{partner.phone}</span>
                    <span>{partner.vehicle}</span>
                  </div>
                  <button className="select-partner-btn">Select →</button>
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

import React, { useContext, useState, useEffect } from "react";
import "./Delivery.css";
import { FoodContext } from "../../context/FoodContext";
import {
  BiCycling, BiCheckCircle, BiTimeFive, BiPhone, BiMapPin,
  BiUser, BiPackage, BiMoney, BiCreditCard, BiLogOut, BiShieldAlt
} from "react-icons/bi";
import { MdDeliveryDining } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Delivery = () => {
  const { orders, updateOrderStatus, currency } = useContext(FoodContext);
  const navigate = useNavigate();

  // Read the logged-in delivery partner from localStorage (set during DeliveryLogin)
  const [loggedInPartner, setLoggedInPartner] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    const storedPartner = localStorage.getItem("deliveryPartner");
    if (storedPartner) {
      try {
        setLoggedInPartner(JSON.parse(storedPartner));
      } catch {
        navigate("/delivery-login");
      }
    } else {
      navigate("/delivery-login");
    }
  }, [navigate]);

  /* ── Logout ─────────────────────────────────────────── */
  const handleLogout = () => {
    localStorage.removeItem("deliveryToken");
    localStorage.removeItem("deliveryPartner");
    toast.info("Logged out successfully");
    navigate("/delivery-login");
  };

  if (!loggedInPartner) {
    return (
      <div className="delivery-container">
        <div className="delivery-loading">
          <MdDeliveryDining className="loading-icon" />
          <p>Loading your portal...</p>
        </div>
      </div>
    );
  }

  /* ── Orders for this partner only ───────────────────── */
  const myActiveOrders = orders.filter(
    (o) =>
      o.assignedDeliveryBoy?.id === loggedInPartner.id &&
      (o.status === "Verified by Admin" || o.status === "Out for Delivery")
  );

  const myCompletedOrders = orders.filter(
    (o) =>
      o.assignedDeliveryBoy?.id === loggedInPartner.id &&
      o.status === "Delivered"
  );

  const initials = loggedInPartner.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="delivery-container">

      {/* ── Header ──────────────────────────────────────── */}
      <div className="delivery-header">
        <div className="delivery-header-left">
          <MdDeliveryDining className="delivery-logo-icon" />
          <div>
            <h1>Delivery Partner Portal</h1>
            <p>View your assigned orders and mark completions.</p>
          </div>
        </div>
        <div className="delivery-header-right">
          <div className="partner-online-badge">
            <span className="online-dot" />
            <span>Online &amp; Active</span>
          </div>
          <button className="delivery-logout-btn" onClick={handleLogout}>
            <BiLogOut /> Logout
          </button>
        </div>
      </div>

      {/* ── Logged-In Partner Info Bar ───────────────────── */}
      <div className="active-partner-bar">
        <div className="partner-avatar">{initials}</div>
        <div className="partner-info-block">
          <div className="partner-identity">
            <BiShieldAlt className="partner-badge-icon" />
            <h3>{loggedInPartner.name}</h3>
            <span className="partner-id-tag">{loggedInPartner.id}</span>
          </div>
          <p>{loggedInPartner.phone} · {loggedInPartner.vehicle}</p>
        </div>
        <div className="partner-stats">
          <div className="p-stat">
            <h4>{myActiveOrders.length}</h4>
            <span>Active Orders</span>
          </div>
          <div className="p-stat">
            <h4>{myCompletedOrders.length}</h4>
            <span>Delivered Today</span>
          </div>
        </div>
      </div>

      {/* ── Active Deliveries ────────────────────────────── */}
      <div className="delivery-section">
        <div className="section-title-row">
          <BiTimeFive className="section-ico" />
          <h2>Active Assigned Deliveries ({myActiveOrders.length})</h2>
        </div>

        {myActiveOrders.length > 0 ? (
          <div className="delivery-orders-list">
            {myActiveOrders.map((order) => (
              <div key={order.id} className="delivery-order-card">
                <div className="delivery-order-header">
                  <div className="d-order-id-group">
                    <BiPackage className="pkg-icon" />
                    <div>
                      <h3>{order.id}</h3>
                      <span className="order-time">{order.date}</span>
                    </div>
                  </div>
                  <span
                    className={`delivery-status-tag ${
                      order.status === "Out for Delivery"
                        ? "active-delivery"
                        : "pending-pickup"
                    }`}
                  >
                    {order.status === "Out for Delivery"
                      ? "🚴 Out for Delivery"
                      : "⏳ Ready for Pickup"}
                  </span>
                </div>

                {/* Customer Info */}
                <div className="customer-info-bar">
                  <div className="cust-detail">
                    <BiUser className="cust-icon" />
                    <div>
                      <strong>{order.customerName}</strong>
                      <span>Customer</span>
                    </div>
                  </div>
                  <a href={`tel:${order.customerPhone}`} className="call-btn">
                    <BiPhone /> {order.customerPhone}
                  </a>
                  <div className="payment-chip">
                    {order.paymentMethod === "cod" ? (
                      <>
                        <BiMoney className="pay-icon" />
                        <span>Collect {currency}{order.total}</span>
                      </>
                    ) : (
                      <>
                        <BiCreditCard className="pay-icon" />
                        <span>Paid Online</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Address */}
                <div className="address-bar">
                  <BiMapPin className="addr-icon" />
                  <p>{order.address}</p>
                  <button className="nav-btn">Navigate →</button>
                </div>

                {/* Expand Items */}
                <button
                  className="expand-items-btn"
                  onClick={() =>
                    setExpandedOrder(expandedOrder === order.id ? null : order.id)
                  }
                >
                  {expandedOrder === order.id
                    ? "▲ Hide Items"
                    : `▼ View ${order.items.length} Item(s)`}
                </button>

                {expandedOrder === order.id && (
                  <div className="items-preview-list">
                    {order.items.map(
                      (item, i) =>
                        item.product && (
                          <div key={i} className="item-preview-row">
                            <img src={item.product.image} alt={item.product.name} />
                            <span>
                              {item.product.name} × {item.quantity}
                            </span>
                            <span className="item-sub-price">
                              {currency}{item.product.price * item.quantity}
                            </span>
                          </div>
                        )
                    )}
                    <div className="total-summary-bar">
                      <strong>Total Order Value</strong>
                      <strong className="total-val">{currency}{order.total}</strong>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="delivery-action-btns">
                  {order.status === "Verified by Admin" && (
                    <button
                      className="pickup-btn"
                      onClick={() => updateOrderStatus(order.id, "Out for Delivery")}
                    >
                      <BiCycling /> Accept &amp; Start Delivery
                    </button>
                  )}
                  {order.status === "Out for Delivery" && (
                    <button
                      className="complete-btn"
                      onClick={() => updateOrderStatus(order.id, "Delivered")}
                    >
                      <BiCheckCircle /> Mark as Delivered ✓
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-active-deliveries">
            <MdDeliveryDining className="empty-delivery-icon" />
            <h3>No Active Deliveries</h3>
            <p>
              No orders have been assigned to you yet. Check back soon — the admin
              will send orders your way!
            </p>
          </div>
        )}
      </div>

      {/* ── Completed Deliveries Today ───────────────────── */}
      {myCompletedOrders.length > 0 && (
        <div className="delivery-section">
          <div className="section-title-row">
            <BiCheckCircle className="section-ico green" />
            <h2>Completed Today ({myCompletedOrders.length})</h2>
          </div>
          <div className="completed-list">
            {myCompletedOrders.map((order) => (
              <div key={order.id} className="completed-card">
                <BiCheckCircle className="done-check-icon" />
                <div>
                  <strong>{order.id}</strong>
                  <span>
                    {order.customerName} · {order.address.split(",")[0]}
                  </span>
                </div>
                <div className="comp-total">{currency}{order.total}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Delivery;

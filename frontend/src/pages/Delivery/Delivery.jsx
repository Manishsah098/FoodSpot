import React, { useContext, useState } from "react";
import "./Delivery.css";
import { FoodContext } from "../../context/FoodContext";
import {
  BiCycling, BiCheckCircle, BiTimeFive, BiPhone, BiMapPin,
  BiUser, BiPackage, BiMoney, BiCreditCard, BiWifi
} from "react-icons/bi";
import { MdDeliveryDining } from "react-icons/md";

const Delivery = () => {
  const { orders, updateOrderStatus, currency, DELIVERY_PARTNERS } = useContext(FoodContext);
  const [selectedPartner, setSelectedPartner] = useState(DELIVERY_PARTNERS[0]);
  const [expandedOrder, setExpandedOrder] = useState(null);

  // Filter orders assigned to this delivery partner
  const myOrders = orders.filter(
    (o) =>
      o.assignedDeliveryBoy?.id === selectedPartner.id &&
      (o.status === "Verified by Admin" || o.status === "Out for Delivery")
  );

  const completedOrders = orders.filter(
    (o) =>
      o.assignedDeliveryBoy?.id === selectedPartner.id &&
      o.status === "Delivered"
  );

  return (
    <div className="delivery-container">
      {/* Header */}
      <div className="delivery-header">
        <div className="delivery-header-left">
          <MdDeliveryDining className="delivery-logo-icon" />
          <div>
            <h1>Delivery Partner Portal</h1>
            <p>View your assigned orders, track deliveries, and mark completions.</p>
          </div>
        </div>
        <div className="partner-online-badge">
          <BiWifi className="wifi-icon" />
          <span>Online & Active</span>
        </div>
      </div>

      {/* Partner Selector */}
      <div className="partner-selector-card">
        <h3>Select Your Profile</h3>
        <div className="partner-pills">
          {DELIVERY_PARTNERS.map((partner) => (
            <button
              key={partner.id}
              className={`partner-pill ${selectedPartner.id === partner.id ? "active" : ""}`}
              onClick={() => setSelectedPartner(partner)}
            >
              <MdDeliveryDining className="pill-icon" />
              <div>
                <strong>{partner.name}</strong>
                <span>{partner.vehicle}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Active Partner Info Bar */}
      <div className="active-partner-bar">
        <div className="partner-avatar">
          {selectedPartner.name.split(" ").map(n => n[0]).join("")}
        </div>
        <div>
          <h3>{selectedPartner.name}</h3>
          <p>{selectedPartner.phone} · {selectedPartner.vehicle}</p>
        </div>
        <div className="partner-stats">
          <div className="p-stat">
            <h4>{myOrders.length}</h4>
            <span>Active Orders</span>
          </div>
          <div className="p-stat">
            <h4>{completedOrders.length}</h4>
            <span>Delivered Today</span>
          </div>
        </div>
      </div>

      {/* Active Deliveries */}
      <div className="delivery-section">
        <div className="section-title-row">
          <BiTimeFive className="section-ico" />
          <h2>Active Assigned Deliveries ({myOrders.length})</h2>
        </div>

        {myOrders.length > 0 ? (
          <div className="delivery-orders-list">
            {myOrders.map((order) => (
              <div key={order.id} className="delivery-order-card">
                <div className="delivery-order-header">
                  <div className="d-order-id-group">
                    <BiPackage className="pkg-icon" />
                    <div>
                      <h3>{order.id}</h3>
                      <span className="order-time">{order.date}</span>
                    </div>
                  </div>
                  <span className={`delivery-status-tag ${order.status === "Out for Delivery" ? "active-delivery" : "pending-pickup"}`}>
                    {order.status === "Out for Delivery" ? "🚴 Out for Delivery" : "⏳ Ready for Pickup"}
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
                      <><BiMoney className="pay-icon" /> <span>Collect {currency}{order.total}</span></>
                    ) : (
                      <><BiCreditCard className="pay-icon" /> <span>Paid Online</span></>
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
                  onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                >
                  {expandedOrder === order.id ? "▲ Hide Items" : `▼ View ${order.items.length} Item(s)`}
                </button>

                {expandedOrder === order.id && (
                  <div className="items-preview-list">
                    {order.items.map((item, i) => (
                      item.product && (
                        <div key={i} className="item-preview-row">
                          <img src={item.product.image} alt={item.product.name} />
                          <span>{item.product.name} × {item.quantity}</span>
                          <span className="item-sub-price">{currency}{item.product.price * item.quantity}</span>
                        </div>
                      )
                    ))}
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
                      <BiCycling /> Accept & Start Delivery
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
            <p>No orders have been assigned to you yet. Check back soon!</p>
          </div>
        )}
      </div>

      {/* Completed Deliveries Today */}
      {completedOrders.length > 0 && (
        <div className="delivery-section">
          <div className="section-title-row">
            <BiCheckCircle className="section-ico green" />
            <h2>Completed Today ({completedOrders.length})</h2>
          </div>
          <div className="completed-list">
            {completedOrders.map((order) => (
              <div key={order.id} className="completed-card">
                <BiCheckCircle className="done-check-icon" />
                <div>
                  <strong>{order.id}</strong>
                  <span>{order.customerName} · {order.address.split(",")[0]}</span>
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

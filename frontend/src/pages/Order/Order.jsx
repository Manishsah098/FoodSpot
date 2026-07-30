import React, { useContext } from "react";
import "./Order.css";
import { BiPackage, BiCheckCircle, BiTimeFive, BiRefresh, BiShield, BiWalk } from "react-icons/bi";
import { MdDeliveryDining } from "react-icons/md";
import { FoodContext } from "../../context/FoodContext";
import { useNavigate } from "react-router-dom";

const ORDER_STAGES = [
  { key: "Pending Verification", label: "Order Placed", icon: <BiPackage />, desc: "Your order has been placed & awaiting admin review." },
  { key: "Verified by Admin", label: "Verified", icon: <BiShield />, desc: "Admin verified your order & assigned a delivery partner." },
  { key: "Out for Delivery", label: "Out for Delivery", icon: <MdDeliveryDining />, desc: "Your food is on its way to your address!" },
  { key: "Delivered", label: "Delivered", icon: <BiCheckCircle />, desc: "Your order was delivered successfully. Enjoy your meal!" },
];

const getStageIndex = (status) => {
  const index = ORDER_STAGES.findIndex(s => s.key === status);
  return index === -1 ? 0 : index;
};

const Order = () => {
  const navigate = useNavigate();
  const { orders, currency } = useContext(FoodContext);

  return (
    <div className="orders-page-container">
      <div className="orders-header">
        <h1 className="page-title">My Orders & Tracking</h1>
        <p className="page-subtitle">Live tracking timeline for your food delivery orders</p>
      </div>

      {orders && orders.length > 0 ? (
        <div className="orders-list">
          {orders.map((order) => {
            const currentStage = getStageIndex(order.status);
            return (
              <div key={order.id} className="order-card">

                {/* Order Header */}
                <div className="order-card-header">
                  <div className="order-info-group">
                    <BiPackage className="package-icon" />
                    <div>
                      <h3 className="order-id">{order.id}</h3>
                      <span className="order-date">{order.date}</span>
                    </div>
                  </div>
                  <div className={`status-pill ${order.statusColor || "orange"}`}>
                    {order.status === "Delivered" ? <BiCheckCircle /> : <BiTimeFive />}
                    <span>{order.status}</span>
                  </div>
                </div>

                {/* 4-Step Timeline Tracker */}
                <div className="order-timeline-tracker">
                  {ORDER_STAGES.map((stage, idx) => {
                    const isCompleted = idx < currentStage;
                    const isCurrent = idx === currentStage;
                    return (
                      <div key={stage.key} className={`timeline-step ${isCompleted ? "completed" : ""} ${isCurrent ? "current" : ""}`}>
                        <div className={`step-dot ${isCompleted ? "completed" : ""} ${isCurrent ? "current" : ""}`}>
                          {isCompleted ? <BiCheckCircle /> : stage.icon}
                        </div>
                        {idx < ORDER_STAGES.length - 1 && (
                          <div className={`step-connector ${isCompleted ? "filled" : ""}`} />
                        )}
                        <div className="step-label">
                          <strong>{stage.label}</strong>
                          {isCurrent && <p>{stage.desc}</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Delivery Partner Info (if assigned) */}
                {order.assignedDeliveryBoy && (
                  <div className="delivery-partner-info-bar">
                    <MdDeliveryDining className="dp-icon" />
                    <div>
                      <strong>Delivery Partner: {order.assignedDeliveryBoy.name}</strong>
                      <span>{order.assignedDeliveryBoy.phone} · {order.assignedDeliveryBoy.vehicle}</span>
                    </div>
                  </div>
                )}

                {/* Items Grid */}
                <div className="order-items-grid">
                  {order.items && order.items.map((item, idx) => (
                    <div key={idx} className="order-item">
                      {item.product && (
                        <>
                          <img src={item.product.image} alt={item.product.name} className="order-item-img" />
                          <div className="order-item-detail">
                            <span className="order-item-name">{item.product.name}</span>
                            <span className="order-item-meta">
                              Qty: {item.quantity} × {currency}{item.product.price}
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="order-card-footer">
                  <div className="delivery-loc">
                    <p><strong>Deliver to:</strong> {order.address}</p>
                    {order.paymentMethod && (
                      <span className="payment-method-badge">
                        Payment: {order.paymentMethod === "stripe" ? "Online Card (Stripe)" : "Cash on Delivery"}
                      </span>
                    )}
                  </div>

                  <div className="order-total-action">
                    <div className="total-box">
                      <span>Total Amount</span>
                      <h4>{currency}{order.total}</h4>
                    </div>
                    <button className="reorder-btn" onClick={() => navigate("/")}>
                      <BiRefresh className="btn-icon" />
                      <span>Order Again</span>
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        <div className="empty-orders-view">
          <BiPackage className="empty-orders-icon" />
          <h2>No Orders Yet</h2>
          <p>You haven't placed any orders. Start exploring our menu!</p>
          <button className="reorder-btn" onClick={() => navigate("/menu")}>
            Browse Full Menu
          </button>
        </div>
      )}
    </div>
  );
};

export default Order;
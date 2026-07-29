import React, { useContext } from "react";
import "./Order.css";
import { BiPackage, BiCheckCircle, BiTimeFive, BiRefresh } from "react-icons/bi";
import { FoodContext } from "../../context/FoodContext";
import { useNavigate } from "react-router-dom";

const Order = () => {
  const navigate = useNavigate();
  const { orders, currency } = useContext(FoodContext);

  return (
    <div className="orders-page-container">
      <div className="orders-header">
        <h1 className="page-title">My Orders</h1>
        <p className="page-subtitle">Track your live food orders and view past history</p>
      </div>

      {orders && orders.length > 0 ? (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.id} className="order-card">
              
              <div className="order-card-header">
                <div className="order-info-group">
                  <BiPackage className="package-icon" />
                  <div>
                    <h3 className="order-id">{order.id}</h3>
                    <span className="order-date">{order.date}</span>
                  </div>
                </div>

                <div className={`status-pill ${order.statusColor || 'orange'}`}>
                  {order.status === "Delivered" ? <BiCheckCircle /> : <BiTimeFive />}
                  <span>{order.status}</span>
                </div>
              </div>

              <div className="order-items-grid">
                {order.items && order.items.map((item, idx) => (
                  <div key={idx} className="order-item">
                    {item.product && (
                      <>
                        <img src={item.product.image} alt={item.product.name} className="order-item-img" />
                        <div className="order-item-detail">
                          <span className="order-item-name">{item.product.name}</span>
                          <span className="order-item-meta">
                            Qty: {item.quantity} x {currency}{item.product.price}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>

              <div className="order-card-footer">
                <div className="delivery-loc">
                  <p><strong>Deliver to:</strong> {order.address}</p>
                  {order.paymentMethod && (
                    <span className="payment-method-badge">
                      Payment: {order.paymentMethod === 'stripe' ? 'Online Card (Stripe)' : 'Cash on Delivery'}
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
          ))}
        </div>
      ) : (
        <div className="empty-orders-view">
          <BiPackage className="empty-orders-icon" />
          <h2>No Active Orders</h2>
          <p>You haven't placed any orders yet.</p>
          <button className="reorder-btn" onClick={() => navigate("/")}>
            Explore Menu
          </button>
        </div>
      )}
    </div>
  );
};

export default Order;
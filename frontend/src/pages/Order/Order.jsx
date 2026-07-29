import React from "react";
import "./Order.css";
import { BiPackage, BiCheckCircle, BiTimeFive, BiRefresh } from "react-icons/bi";
import { FaUtensils } from "react-icons/fa";
import { product } from "../../assets/assests";
import { useNavigate } from "react-router-dom";

const Order = () => {
  const navigate = useNavigate();

  const mockOrders = [
    {
      id: "ORD-94821",
      date: "July 29, 2026",
      status: "In Transit",
      statusColor: "orange",
      total: 510,
      items: [
        { product: product[1], quantity: 1 },
        { product: product[3], quantity: 1 },
        { product: product[4], quantity: 1 },
      ],
      address: "B-402 Sunshine Heights, Green Park, New Delhi",
    },
    {
      id: "ORD-83719",
      date: "July 25, 2026",
      status: "Delivered",
      statusColor: "green",
      total: 340,
      items: [
        { product: product[0], quantity: 1 },
        { product: product[2], quantity: 1 },
      ],
      address: "B-402 Sunshine Heights, Green Park, New Delhi",
    },
  ];

  return (
    <div className="orders-page-container">
      <div className="orders-header">
        <h1 className="page-title">My Orders</h1>
        <p className="page-subtitle">Track your live food orders and view past history</p>
      </div>

      <div className="orders-list">
        {mockOrders.map((order) => (
          <div key={order.id} className="order-card">
            
            <div className="order-card-header">
              <div className="order-info-group">
                <BiPackage className="package-icon" />
                <div>
                  <h3 className="order-id">{order.id}</h3>
                  <span className="order-date">{order.date}</span>
                </div>
              </div>

              <div className={`status-pill ${order.statusColor}`}>
                {order.status === "Delivered" ? <BiCheckCircle /> : <BiTimeFive />}
                <span>{order.status}</span>
              </div>
            </div>

            <div className="order-items-grid">
              {order.items.map((item, idx) => (
                <div key={idx} className="order-item">
                  <img src={item.product.image} alt={item.product.name} className="order-item-img" />
                  <div className="order-item-detail">
                    <span className="order-item-name">{item.product.name}</span>
                    <span className="order-item-meta">Qty: {item.quantity} x ₹{item.product.price}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="order-card-footer">
              <div className="delivery-loc">
                <p><strong>Deliver to:</strong> {order.address}</p>
              </div>

              <div className="order-total-action">
                <div className="total-box">
                  <span>Total Amount</span>
                  <h4>₹{order.total}</h4>
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
    </div>
  );
};

export default Order;
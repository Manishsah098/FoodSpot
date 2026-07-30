import React, { useState } from "react";
import "./Contact.css";
import { BiEnvelope, BiPhoneCall, BiMap, BiHelpCircle, BiSend, BiCheckCircle } from "react-icons/bi";
import { toast } from "react-toastify";

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    toast.success("Thank you! Your message has been sent to our customer care team.");
  };

  return (
    <div className="contact-page-container">
      <div className="contact-header">
        <h1 className="page-title">Contact & Customer Support</h1>
        <p className="page-subtitle">Have a question, feedback, or need help with your food order? We're here for you 24/7.</p>
      </div>

      <div className="contact-grid">
        {/* Left Column: Contact Cards */}
        <div className="contact-info-col">
          <div className="contact-info-card">
            <BiPhoneCall className="c-icon" />
            <div>
              <h3>Call Us Directly</h3>
              <p>+91 1800-FOOD-SPOT (1800-366-3776)</p>
              <span>Available 24 Hours / 7 Days</span>
            </div>
          </div>

          <div className="contact-info-card">
            <BiEnvelope className="c-icon" />
            <div>
              <h3>Email Support</h3>
              <p>support@foodspot.com</p>
              <span>Response within 15 minutes</span>
            </div>
          </div>

          <div className="contact-info-card">
            <BiMap className="c-icon" />
            <div>
              <h3>Headquarters</h3>
              <p>FoodSpot Towers, Green Park, New Delhi - 110016</p>
              <span>Operating in 25+ Metro Cities</span>
            </div>
          </div>

          <div className="faq-teaser-card">
            <h3><BiHelpCircle className="faq-icon" /> Frequently Asked Questions</h3>
            <div className="faq-item">
              <strong>How can I track my order live?</strong>
              <p>You can view your order progress timeline under <strong>My Orders</strong> in the top menu bar.</p>
            </div>
            <div className="faq-item">
              <strong>What payment methods are supported?</strong>
              <p>We support Credit/Debit Cards via Stripe and Cash on Delivery (COD).</p>
            </div>
          </div>
        </div>

        {/* Right Column: Support Form */}
        <div className="contact-form-card">
          <h2>Send Us a Message</h2>
          {submitted ? (
            <div className="form-success-box">
              <BiCheckCircle className="success-icon" />
              <h3>Message Received!</h3>
              <p>Thank you for reaching out. Our support agent will reply to <strong>{formData.email}</strong> shortly.</p>
              <button className="reset-msg-btn" onClick={() => setSubmitted(false)}>Send Another Message</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label>Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Subject</label>
                <input
                  type="text"
                  required
                  placeholder="Order Inquiry, Feedback, Partner Request..."
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Message</label>
                <textarea
                  rows="4"
                  required
                  placeholder="Write your message or order details here..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                ></textarea>
              </div>

              <button type="submit" className="send-msg-btn">
                <BiSend className="btn-icon" /> Send Message Now
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;

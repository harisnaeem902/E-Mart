import "./ContactUs.css";

function ContactUs() {
  return (
    <div className="contact-page">
      <div className="contact-card">
        <h1 className="contact-title">Get in Touch</h1>
        <p className="contact-intro">
          Have a question about a product or an order? Reach out to us directly—we are happy to help.
        </p>

        <div className="contact-details-grid">
          {/* Phone Numbers Section */}
          <div className="contact-info-card">
            <div className="contact-icon-wrapper">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
            </div>
            <div className="contact-text-content">
              <h3>Phone Numbers</h3>
              <div className="phone-links-group">
                <a href="tel:03026742902" className="phone-link-btn">
                  0302-6742902
                </a>
                <a href="tel:03116742902" className="phone-link-btn">
                  0311-6742902
                </a>
              </div>
            </div>
          </div>

          {/* Location Section */}
          <div className="contact-info-card">
            <div className="contact-icon-wrapper">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </div>
            <div className="contact-text-content">
              <h3>Store Location</h3>
              <a
                href="https://maps.app.goo.gl/fP7uN2X2xKxqj4wC9"
                target="_blank"
                rel="noopener noreferrer"
                className="map-link-btn"
              >
                View on Google Maps
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="7" y1="17" x2="17" y2="7"></line>
                  <polyline points="7 7 17 7 17 17"></polyline>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactUs;
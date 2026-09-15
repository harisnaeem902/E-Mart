import "./ContactUs.css";

function ContactUs() {
  return (
    <div className="contact-page">
      <div className="contact-card">
        <h1>Contact Us</h1>
        <p className="contact-intro">
          Have a question about a product or an order? Reach out to us
          directly, we're happy to help.
        </p>

        <div className="contact-info-row">
          <span className="contact-label">Phone</span>
          <div className="contact-value">
            <a href="tel:03026742902">0302-6742902</a>
            <a href="tel:03116742902">0311-6742902</a>
          </div>
        </div>

                <div className="contact-info-row">
          <span className="contact-label">Store Location</span>
          <div className="contact-value">
            <a href="https://maps.app.goo.gl/fP7uN2X2xKxqj4wC9" target="_blank" rel="noopener noreferrer">View on Google Maps</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactUs;
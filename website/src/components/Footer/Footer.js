import "./Footer.css";

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-cols">
        <div>
          <h4>E-Mart</h4>
          <p>Your one-stop shop for the latest electronics appliances.</p>
        </div>
        <div>
          <h4>Shop</h4>
          <a href="/shop">All Products</a>
          <a href="/sale">On Sale</a>
        </div>
        <div>
          <h4>Company</h4>
          <a href="/about">About Us</a>
          <a href="/contact">Contact Us</a>
        </div>
        <div>
          <h4>Account</h4>
          <a href="/login">Login</a>
          <a href="/signup">Sign Up</a>
        </div>
      </div>
      <p className="copyright">&copy; {new Date().getFullYear()} E-mart. All rights reserved.</p>
    </footer>
  );
}

export default Footer;

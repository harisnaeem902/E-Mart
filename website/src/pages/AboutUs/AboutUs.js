import "./AboutUs.css";

function AboutUs() {
  return (
    <div className="about-page">
      <div className="about-card">
        <h1>Our Mission</h1>
        <p>
          At E-Mart, our mission is to enrich the lives of our customers by providing top-quality home appliances and exceptional service. Over
          the past 8 years of proven excellence, we have proudly served our community, building a strong reputation founded on trust,transparency, 
          and an unwavering commitment to customer satisfaction.Every day, we strive to exceed expectations, uphold high standardsof quality, and 
          foster lasting relationships with the people we serve. Our team is dedicated to guiding you toward the perfect choices for your home by 
          offering honest advice, competitive pricing, and dependable support at every step.
        </p>
        <p>
          For us, business is not just about transactions, it's about trust.
          It's not simply about delivering products; it's about enhancing the
          way people live, making everyday life more comfortable, convenient,
          and connected. As we continue to grow, our core commitment remains
          unchanged: to be your most trusted destination for quality
          appliances, one satisfied customer at a time.
        </p>
        <p className="about-thanks">
          Thank you for choosing E-Mart as your trusted partner on this
          journey.
        </p>
        <div className="about-signature">
          <strong>Mr. Muhammad Haris Naeem</strong>
          <span>Founder, E-Mart</span>
        </div>
      </div>
    </div>
  );
}

export default AboutUs;
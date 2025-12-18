import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h4>About This Dashboard</h4>
          <p>
            Interactive analytics platform visualizing 8M+ Yelp reviews using React, D3.js, Node.js, 
            and modern data visualization techniques. Built to demonstrate data storytelling and 
            full-stack development capabilities.
          </p>
        </div>

        <div className="footer-section">
          <h4>Technologies Used</h4>
          <div className="tech-tags">
            <span className="tech-tag">React</span>
            <span className="tech-tag">D3.js</span>
            <span className="tech-tag">Node.js</span>
            <span className="tech-tag">Express</span>
            <span className="tech-tag">Chart.js</span>
            <span className="tech-tag">PostgreSQL</span>
          </div>
        </div>

        <div className="footer-section">
          <h4>Features</h4>
          <ul>
            <li>✅ Real-time data visualization</li>
            <li>✅ Interactive filtering & drill-down</li>
            <li>✅ &lt;200ms response time</li>
            <li>✅ Responsive design</li>
            <li>✅ CSV export functionality</li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Contact</h4>
          <p>
            <strong>Vishnu Sai Padyala</strong><br/>
            University of Florida<br/>
            MS Computer Science<br/>
            <a href="mailto:padyalavishnusai@ufl.edu">padyalavishnusai@ufl.edu</a>
          </p>
          <div className="social-links">
            <a href="https://github.com/VISHNU07202003" target="_blank" rel="noopener noreferrer">GitHub</a>
            <a href="https://www.linkedin.com/in/vishnu-sai-padyala-95317b24b/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2025 Vishnu Sai Padyala | Built for Netflix Visualization Engineer Application</p>
        <p className="disclaimer">
          ⚠️ Educational project using simulated data for demonstration purposes. 
          Not affiliated with Yelp Inc.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
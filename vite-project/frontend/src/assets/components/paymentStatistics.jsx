import React from 'react';
import '../../App.css';

const PaymentStatistics = () => {
  return (
    <div className="payment-statistics-container">
      <article className="payment-statistics-article">
        <h2 className="payment-statistics-title">Payment Statistics</h2>
        <iframe
          className="payment-statistics-iframe"
          src="https://charts.mongodb.com/charts-project-0-xcysy/embed/dashboards?id=661aca8b-330e-4a9d-8474-77c888b88f8b&theme=light&autoRefresh=true&maxDataAge=3600&showTitleAndDesc=false&scalingWidth=fixed&scalingHeight=fixed"
          title="Payment Statistics Dashboard"
        ></iframe>
      </article>
    </div>
  );
};

export default PaymentStatistics;

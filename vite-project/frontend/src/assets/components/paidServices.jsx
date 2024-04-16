import React from 'react'
import '../../App.css'

const PaidServices = () => {
  return (
    <div className='payment-statistics-container'>
      <article className='payment-statistics-article'>
      <h2 className="payment-statistics-title">Paid Services</h2>
      <iframe
      className="payment-statistics-iframe"   
      src="https://charts.mongodb.com/charts-project-0-xcysy/embed/dashboards?id=326b91b9-9a4e-4778-a345-83ba8434b013&theme=light&autoRefresh=true&maxDataAge=3600&showTitleAndDesc=false&scalingWidth=fixed&scalingHeight=fixed"></iframe>
      </article>
    </div>
  )
}

export default PaidServices

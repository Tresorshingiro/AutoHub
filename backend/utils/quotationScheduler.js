const cron = require('node-cron')
const Quotation = require('../models/Quotation')

// Run every day at midnight to check for expired quotations
const scheduleQuotationExpiry = () => {
  cron.schedule('0 0 * * *', async () => {
    try {
      console.log('🔍 Checking for expired quotations...')
      const result = await Quotation.expireOverdueQuotations()
      
      if (result.modifiedCount > 0) {
        console.log(`⏰ Expired ${result.modifiedCount} overdue quotations`)
      } else {
        console.log('✅ No quotations to expire')
      }
    } catch (error) {
      console.error('❌ Error expiring quotations:', error)
    }
  })
  
  console.log('📅 Quotation expiry scheduler started')
}

// Manual function to expire quotations (can be called via API)
const expireQuotationsNow = async () => {
  try {
    const result = await Quotation.expireOverdueQuotations()
    return {
      success: true,
      expiredCount: result.modifiedCount,
      message: `${result.modifiedCount} quotations expired`
    }
  } catch (error) {
    return {
      success: false,
      message: error.message
    }
  }
}

module.exports = {
  scheduleQuotationExpiry,
  expireQuotationsNow
}

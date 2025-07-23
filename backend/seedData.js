// Sample script to seed initial suppliers and parts data
// Run this once to populate your database with sample data

const mongoose = require('mongoose')
require('dotenv').config()

const Supplier = require('./models/Supplier')
const Part = require('./models/Parts')

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    
    // Clear existing data (optional - uncomment if you want to reset)
    // await Supplier.deleteMany({})
    // await Part.deleteMany({})
    
    // Check if data already exists
    const existingSuppliers = await Supplier.countDocuments()
    const existingParts = await Part.countDocuments()
    
    if (existingSuppliers > 0 && existingParts > 0) {
      console.log('Sample data already exists. Skipping seeding.')
      process.exit(0)
    }
    
    // Sample Suppliers
    const suppliers = [
      {
        name: 'AutoParts Rwanda Ltd',
        contactPerson: 'John Mukamana',
        email: 'sales@autoparts.rw',
        phone: '+250788123456',
        address: {
          street: 'KG 15 Ave',
          city: 'Kigali',
          country: 'Rwanda',
          postalCode: '00100'
        },
        paymentTerms: 'Net 30',
        status: 'active'
      },
      {
        name: 'Toyota Parts Center',
        contactPerson: 'Sarah Uwimana',
        email: 'parts@toyota.rw',
        phone: '+250788654321',
        address: {
          street: 'KN 12 St',
          city: 'Kigali',
          country: 'Rwanda'
        },
        paymentTerms: 'Net 15',
        status: 'active'
      }
    ]
    
    const createdSuppliers = await Supplier.insertMany(suppliers)
    console.log('Suppliers created:', createdSuppliers.length)
    
    // Sample Parts
    const parts = [
      {
        partNumber: 'BP001',
        name: 'Brake Pads - Front',
        description: 'High-quality ceramic brake pads for front wheels',
        category: 'Brake System',
        supplier: createdSuppliers[0]._id,
        vehicleCompatibility: {
          brands: ['Toyota', 'Honda'],
          models: ['Camry', 'Civic', 'Corolla'],
          years: { from: 2015, to: 2023 }
        },
        pricing: {
          costPrice: 25000,
          sellingPrice: 35000
        },
        inventory: {
          currentStock: 50,
          minimumStock: 10,
          location: { warehouse: 'Main', shelf: 'A1', bin: '001' }
        },
        specifications: {
          warranty: { period: 12, terms: 'Manufacturer warranty' }
        }
      },
      {
        partNumber: 'OF001',
        name: 'Engine Oil Filter',
        description: 'OEM quality oil filter',
        category: 'Filters',
        supplier: createdSuppliers[1]._id,
        vehicleCompatibility: {
          brands: ['Toyota'],
          models: ['Camry', 'Corolla', 'RAV4'],
          years: { from: 2010, to: 2023 }
        },
        pricing: {
          costPrice: 5000,
          sellingPrice: 8000
        },
        inventory: {
          currentStock: 100,
          minimumStock: 20,
          location: { warehouse: 'Main', shelf: 'B2', bin: '015' }
        }
      },
      {
        partNumber: 'SP001',
        name: 'Spark Plugs Set',
        description: 'Iridium spark plugs set of 4',
        category: 'Engine Parts',
        supplier: createdSuppliers[0]._id,
        vehicleCompatibility: {
          brands: ['Toyota', 'Honda', 'Nissan'],
          years: { from: 2012, to: 2023 }
        },
        pricing: {
          costPrice: 40000,
          sellingPrice: 60000
        },
        inventory: {
          currentStock: 25,
          minimumStock: 5,
          location: { warehouse: 'Main', shelf: 'C1', bin: '008' }
        }
      },
      {
        partNumber: 'TYR001',
        name: 'All-Season Tire 215/60R16',
        description: 'Premium all-season tire',
        category: 'Tires',
        supplier: createdSuppliers[0]._id,
        vehicleCompatibility: {
          brands: ['Toyota', 'Honda', 'Mazda']
        },
        pricing: {
          costPrice: 80000,
          sellingPrice: 120000
        },
        inventory: {
          currentStock: 16,
          minimumStock: 8,
          location: { warehouse: 'Tire Storage', shelf: 'T1' }
        },
        specifications: {
          dimensions: { length: 65, width: 21.5, height: 65 },
          warranty: { period: 24, terms: 'Road hazard warranty' }
        }
      }
    ]
    
    const createdParts = await Part.insertMany(parts)
    console.log('Parts created:', createdParts.length)
    
    console.log('✅ Sample data seeded successfully!')
    process.exit(0)
    
  } catch (error) {
    console.error('❌ Error seeding data:', error)
    process.exit(1)
  }
}

// Run the seeding function
seedData()

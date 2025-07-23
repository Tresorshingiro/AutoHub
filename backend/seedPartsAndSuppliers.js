const mongoose = require('mongoose');
const Part = require('./models/Parts');
const Supplier = require('./models/Supplier');
require('dotenv').config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    process.exit(1);
  }
};

// Sample suppliers data
const suppliersData = [
  {
    name: "AutoParts Rwanda Ltd",
    email: "info@autopartsrw.com",
    phone: "+250788123456",
    address: "KG 15 Ave, Kigali",
    contactPerson: "Jean Baptiste",
    website: "www.autopartsrw.com",
    status: "active"
  },
  {
    name: "Motor Spares International",
    email: "sales@motorspares.com",
    phone: "+250788234567",
    address: "KN 3 Rd, Nyarutarama",
    contactPerson: "Alice Uwimana",
    website: "www.motorspares.com",
    status: "active"
  },
  {
    name: "Toyota Parts Center",
    email: "parts@toyotarwanda.com",
    phone: "+250788345678",
    address: "Kimisagara, Kigali",
    contactPerson: "David Nkurunziza",
    website: "www.toyotarwanda.com",
    status: "active"
  },
  {
    name: "Universal Auto Supply",
    email: "contact@universalauto.rw",
    phone: "+250788456789",
    address: "Gikondo Industrial Zone",
    contactPerson: "Marie Mukamana",
    website: "www.universalauto.rw",
    status: "active"
  }
];

// Sample parts data
const partsData = [
  // Engine Components
  {
    name: "Engine Oil Filter",
    partNumber: "EOF-001",
    category: "Engine Parts",
    description: "High-quality engine oil filter for most vehicles",
    pricing: {
      costPrice: 8000,
      sellingPrice: 12000,
      currency: "RWF"
    },
    inventory: {
      currentStock: 25,
      minimumStock: 5,
      maximumStock: 50
    },
    vehicleCompatibility: {
      brands: ["Toyota", "Nissan", "Honda", "Hyundai"],
      models: ["Corolla", "Sentra", "Civic", "Elantra"],
      years: { from: 2010, to: 2024 }
    },
    specifications: {
      weight: 0.3,
      dimensions: {
        length: 10,
        width: 8,
        height: 8
      },
      material: "Paper and Metal"
    },
    supplier: null, // Will be set after creating suppliers
    status: "active"
  },
  {
    name: "Air Filter",
    partNumber: "AF-002",
    category: "Filters", 
    description: "Premium air filter for improved engine performance",
    pricing: {
      costPrice: 15000,
      sellingPrice: 22000,
      currency: "RWF"
    },
    inventory: {
      currentStock: 18,
      minimumStock: 3,
      maximumStock: 30
    },
    vehicleCompatibility: {
      brands: ["Toyota", "Honda", "Nissan"],
      models: ["Corolla", "Civic", "Sentra"],
      years: { from: 2015, to: 2024 }
    },
    specifications: {
      weight: 0.5,
      dimensions: {
        length: 25,
        width: 20,
        height: 5
      },
      material: "High-grade paper"
    },
    supplier: null,
    status: "active"
  },
  {
    name: "Spark Plugs Set",
    partNumber: "SP-003",
    category: "Engine Parts",
    description: "High-performance spark plugs set of 4",
    pricing: {
      costPrice: 25000,
      sellingPrice: 35000,
      currency: "RWF"
    },
    inventory: {
      currentStock: 12,
      minimumStock: 2,
      maximumStock: 20
    },
    vehicleCompatibility: {
      brands: ["Toyota", "Honda", "Mazda"],
      models: ["Camry", "Accord", "CX-5"],
      years: { from: 2012, to: 2024 }
    },
    specifications: {
      weight: 0.8,
      dimensions: {
        length: 15,
        width: 10,
        height: 8
      },
      material: "Iridium"
    },
    supplier: null,
    status: "active"
  },

  // Brake System
  {
    name: "Brake Pads Front",
    partNumber: "BP-004",
    category: "Brake System",
    description: "High-quality ceramic brake pads for front wheels",
    pricing: {
      costPrice: 45000,
      sellingPrice: 65000,
      currency: "RWF"
    },
    inventory: {
      currentStock: 8,
      minimumStock: 2,
      maximumStock: 15
    },
    vehicleCompatibility: {
      brands: ["Toyota", "Honda", "Nissan"],
      models: ["Camry", "Accord", "Altima"],
      years: { from: 2010, to: 2024 }
    },
    specifications: {
      weight: 2.5,
      dimensions: {
        length: 30,
        width: 15,
        height: 2
      },
      material: "Ceramic composite"
    },
    supplier: null,
    status: "active"
  },
  {
    name: "Brake Pads Rear",
    partNumber: "BP-005",
    category: "Brake System",
    description: "High-quality ceramic brake pads for rear wheels",
    pricing: {
      costPrice: 35000,
      sellingPrice: 50000,
      currency: "RWF"
    },
    inventory: {
      currentStock: 10,
      minimumStock: 2,
      maximumStock: 15
    },
    vehicleCompatibility: {
      brands: ["Toyota", "Honda", "Nissan"],
      models: ["Camry", "Accord", "Altima"],
      years: { from: 2010, to: 2024 }
    },
    specifications: {
      weight: 2.0,
      dimensions: {
        length: 25,
        width: 12,
        height: 2
      },
      material: "Ceramic composite"
    },
    supplier: null,
    status: "active"
  },

  // Suspension
  {
    name: "Shock Absorber Front",
    partNumber: "SA-006",
    category: "Suspension",
    description: "Premium gas-filled shock absorber for front suspension",
    pricing: {
      costPrice: 55000,
      sellingPrice: 75000,
      currency: "RWF"
    },
    inventory: {
      currentStock: 6,
      minimumStock: 1,
      maximumStock: 10
    },
    vehicleCompatibility: {
      brands: ["Toyota", "Honda", "Nissan"],
      models: ["RAV4", "CR-V", "X-Trail"],
      years: { from: 2012, to: 2024 }
    },
    specifications: {
      weight: 3.5,
      dimensions: {
        length: 50,
        width: 10,
        height: 10
      },
      material: "Steel with gas filling"
    },
    supplier: null,
    status: "active"
  },

  // Electrical
  {
    name: "Car Battery 12V",
    partNumber: "BAT-007",
    category: "Electrical",
    description: "High-capacity 12V car battery with 2-year warranty",
    pricing: {
      costPrice: 85000,
      sellingPrice: 120000,
      currency: "RWF"
    },
    inventory: {
      currentStock: 4,
      minimumStock: 1,
      maximumStock: 8
    },
    vehicleCompatibility: {
      brands: ["Toyota", "Honda", "Nissan", "Hyundai", "Mazda"],
      models: ["Most vehicles"],
      years: { from: 2000, to: 2024 }
    },
    specifications: {
      weight: 18,
      dimensions: {
        length: 35,
        width: 20,
        height: 20
      },
      material: "Lead-acid"
    },
    supplier: null,
    status: "active"
  },
  {
    name: "Headlight Bulb H4",
    partNumber: "HB-008",
    category: "Electrical",
    description: "LED headlight bulb H4 type with long lifespan",
    pricing: {
      costPrice: 18000,
      sellingPrice: 28000,
      currency: "RWF"
    },
    inventory: {
      currentStock: 15,
      minimumStock: 3,
      maximumStock: 25
    },
    vehicleCompatibility: {
      brands: ["Toyota", "Honda", "Nissan", "Hyundai"],
      models: ["Most vehicles with H4 socket"],
      years: { from: 2005, to: 2024 }
    },
    specifications: {
      weight: 0.2,
      dimensions: {
        length: 8,
        width: 5,
        height: 5
      },
      material: "LED with aluminum housing"
    },
    supplier: null,
    status: "active"
  },

  // Transmission
  {
    name: "Transmission Oil",
    partNumber: "TO-009",
    category: "Fluids",
    description: "Synthetic transmission fluid for automatic transmissions",
    pricing: {
      costPrice: 12000,
      sellingPrice: 18000,
      currency: "RWF"
    },
    inventory: {
      currentStock: 20,
      minimumStock: 4,
      maximumStock: 35
    },
    vehicleCompatibility: {
      brands: ["Toyota", "Honda", "Nissan", "Hyundai"],
      models: ["Automatic transmission vehicles"],
      years: { from: 2008, to: 2024 }
    },
    specifications: {
      weight: 1,
      dimensions: {
        length: 20,
        width: 10,
        height: 25
      },
      material: "Synthetic fluid"
    },
    supplier: null,
    status: "active"
  },

  // Tires
  {
    name: "All-Season Tire 195/65R15",
    partNumber: "AT-010",
    category: "Tires",
    description: "High-quality all-season tire with excellent grip",
    pricing: {
      costPrice: 75000,
      sellingPrice: 110000,
      currency: "RWF"
    },
    inventory: {
      currentStock: 8,
      minimumStock: 2,
      maximumStock: 20
    },
    vehicleCompatibility: {
      brands: ["Toyota", "Honda", "Nissan"],
      models: ["Mid-size sedans and hatchbacks"],
      years: { from: 2010, to: 2024 }
    },
    specifications: {
      weight: 9,
      dimensions: {
        length: 65,
        width: 65,
        height: 20
      },
      material: "Rubber compound"
    },
    supplier: null,
    status: "active"
  }
];

const seedData = async () => {
  try {
    // Clear existing data
    await Supplier.deleteMany({});
    await Part.deleteMany({});
    console.log('Cleared existing data');

    // Create suppliers
    const createdSuppliers = await Supplier.insertMany(suppliersData);
    console.log(`Created ${createdSuppliers.length} suppliers`);

    // Assign suppliers to parts randomly
    const updatedPartsData = partsData.map((part, index) => {
      const randomSupplier = createdSuppliers[index % createdSuppliers.length];
      return {
        ...part,
        supplier: randomSupplier._id
      };
    });

    // Create parts
    const createdParts = await Part.insertMany(updatedPartsData);
    console.log(`Created ${createdParts.length} parts`);

    console.log('Database seeded successfully!');
    console.log('\\nSample data created:');
    console.log('- Suppliers:', createdSuppliers.length);
    console.log('- Parts:', createdParts.length);
    
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Run the seeding
connectDB().then(() => {
  seedData();
});

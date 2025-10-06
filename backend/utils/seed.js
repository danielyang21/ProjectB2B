require('dotenv').config();
const mongoose = require('mongoose');
const Service = require('../models/Service');
const connectDB = require('../config/db');

// Mock data
const mockServices = [
  {
    companyName: "TechConsult Pro",
    services: ["IT Consulting", "Cloud Infrastructure", "Digital Transformation"],
    industry: "Technology",
    location: "San Francisco, CA",
    companySize: "Medium",
    description: "Expert IT consulting services for enterprise digital transformation",
    rating: 4.8,
    verified: true,
    website: "https://techconsultpro.com",
    quoteUrl: "https://techconsultpro.com/request-quote",
    email: "contact@techconsultpro.com",
    phone: "(415) 555-0123",
    founded: "2015",
    employees: "50-100",
    certifications: ["ISO 27001", "SOC 2"],
    linkedin: "https://linkedin.com/company/techconsultpro",
  },
  {
    companyName: "Legal Shield Partners",
    services: ["Legal Services", "Corporate Law", "Compliance Consulting"],
    industry: "Legal",
    location: "New York, NY",
    companySize: "Large",
    description: "Corporate law and compliance services for businesses of all sizes",
    rating: 4.9,
    verified: true,
  },
  {
    companyName: "Marketing Maven",
    services: ["Digital Marketing", "B2B Marketing", "Content Strategy"],
    industry: "Marketing",
    location: "Austin, TX",
    companySize: "Small",
    description: "Full-service digital marketing agency specializing in B2B growth",
    rating: 4.7,
    verified: true,
  },
  {
    companyName: "CloudSecure Systems",
    services: ["Cybersecurity", "Penetration Testing", "Security Audits"],
    industry: "Technology",
    location: "Seattle, WA",
    companySize: "Medium",
    description: "Enterprise cybersecurity solutions and penetration testing",
    rating: 4.9,
    verified: true,
  },
  {
    companyName: "Finance First Advisors",
    services: ["Financial Consulting", "Investment Advisory", "CFO Services"],
    industry: "Finance",
    location: "Chicago, IL",
    companySize: "Large",
    description: "Strategic financial planning and investment advisory services",
    rating: 4.6,
    verified: true,
  },
  {
    companyName: "HR Solutions Group",
    services: ["HR Consulting", "Talent Acquisition", "Performance Management"],
    industry: "Human Resources",
    location: "Boston, MA",
    companySize: "Medium",
    description: "Comprehensive HR management and talent acquisition services",
    rating: 4.5,
    verified: true,
  },
  {
    companyName: "Supply Chain Experts",
    services: ["Logistics", "Supply Chain Optimization", "Warehouse Management"],
    industry: "Manufacturing",
    location: "Dallas, TX",
    companySize: "Large",
    description: "End-to-end supply chain optimization and logistics management",
    rating: 4.8,
    verified: true,
  },
  {
    companyName: "HealthTech Advisors",
    services: ["Healthcare Consulting", "HIPAA Compliance", "Healthcare IT"],
    industry: "Healthcare",
    location: "Los Angeles, CA",
    companySize: "Medium",
    description: "Healthcare technology integration and compliance consulting",
    rating: 4.7,
    verified: true,
  },
  {
    companyName: "Design Studio Co",
    services: ["UX/UI Design", "Brand Identity", "Design Strategy"],
    industry: "Creative",
    location: "Portland, OR",
    companySize: "Small",
    description: "Brand identity, UX/UI design, and creative strategy services",
    rating: 4.8,
    verified: true,
  },
  {
    companyName: "DataAnalytics Pro",
    services: ["Data Analytics", "Business Intelligence", "Data Visualization"],
    industry: "Technology",
    location: "San Francisco, CA",
    companySize: "Medium",
    description: "Business intelligence and data analytics consulting services",
    rating: 4.9,
    verified: true,
  },
  {
    companyName: "Manufacturing Solutions",
    services: ["Operations Consulting", "Lean Manufacturing", "Process Optimization"],
    industry: "Manufacturing",
    location: "Detroit, MI",
    companySize: "Large",
    description: "Lean manufacturing and operational excellence consulting",
    rating: 4.6,
    verified: true,
  },
  {
    companyName: "Real Estate Pros",
    services: ["Real Estate Consulting", "Property Management", "Commercial Leasing"],
    industry: "Real Estate",
    location: "Miami, FL",
    companySize: "Medium",
    description: "Commercial real estate strategy and property management",
    rating: 4.7,
    verified: true,
  },
  {
    companyName: "8x8",
    services: ["Communications", "UCaaS", "CCaaS"],
    industry: "Technology",
    location: "Campbell, CA",
    companySize: "Medium",
    description: "8x8® connects your employees and customers through one intelligent platform designed to deliver the outcomes that matter most.",
    rating: 3.6,
    verified: false,
    website: "https://www.8x8.com/en-ca",
    quoteUrl: "https://www.8x8.com/en-ca/request-a-quote",
    email: "",
    phone: "1-866-879-8647",
    founded: "1987",
    employees: "",
    certifications: [],
    linkedin: "https://www.linkedin.com/company/8x8/",
  },
  {
    companyName: "RingCentral",
    services: ["Communications", "UCaaS"],
    industry: "Technology",
    location: "Belmont, CA",
    companySize: "Medium",
    description: "Join more than 500,000 companies that use RingCentral as the voice of their business to enable easy and reliable customer communications powered by AI.",
    rating: 3.2,
    verified: false,
    website: "https://www.ringcentral.com/ca/en/",
    quoteUrl: "https://www.ringcentral.com/ca/en/office/plansandpricing.html",
    email: "",
    phone: "1-888-451-5071",
    founded: "1999",
    employees: "",
    certifications: [],
    linkedin: "https://www.linkedin.com/company/ringcentral/",
  },
  {
    companyName: "Zoom",
    services: ["Communications", "UCaaS"],
    industry: "Technology",
    location: "San Jose, CA",
    companySize: "Large",
    description: "Whether you're chatting with teammates or supporting customers, Zoom makes it easier to connect, collaborate, and reach goals — all with built-in AI doing the heavy lifting.",
    rating: 4.5,
    verified: false,
    website: "https://www.zoom.com/",
    quoteUrl: "https://www.zoom.com/en/contact/contact-sales-c/",
    email: "",
    phone: "1-888-799-9666",
    founded: "2011",
    employees: "",
    certifications: [],
    linkedin: "https://www.linkedin.com/company/zoom/",
  },
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Clear existing data
    await Service.deleteMany({});
    console.log('Cleared existing services');

    // Insert mock data
    await Service.insertMany(mockServices);
    console.log('Mock data inserted successfully');

    console.log(`Seeded ${mockServices.length} services`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();

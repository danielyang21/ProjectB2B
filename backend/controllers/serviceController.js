const Service = require('../models/Service');

// @desc    Get all services
// @route   GET /api/services
// @access  Public
exports.getAllServices = async (req, res) => {
  try {
    const {
      search,
      services,
      industry,
      companySize,
      verified
    } = req.query;

    // Build query
    let query = {};

    // Search across multiple fields
    if (search) {
      query.$or = [
        { companyName: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { services: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Filter by services (comma-separated)
    if (services) {
      const serviceArray = services.split(',');
      query.services = { $in: serviceArray };
    }

    // Filter by industry (comma-separated)
    if (industry) {
      const industryArray = industry.split(',');
      query.industry = { $in: industryArray };
    }

    // Filter by company size (comma-separated)
    if (companySize) {
      const sizeArray = companySize.split(',');
      query.companySize = { $in: sizeArray };
    }

    // Filter by verified status
    if (verified !== undefined) {
      query.verified = verified === 'true';
    }

    const allServices = await Service.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: allServices.length,
      data: allServices
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Get single service
// @route   GET /api/services/:id
// @access  Public
exports.getService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    res.status(200).json({
      success: true,
      data: service
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Create new service
// @route   POST /api/services
// @access  Public (should be protected in production)
exports.createService = async (req, res) => {
  try {
    const service = await Service.create(req.body);

    res.status(201).json({
      success: true,
      data: service
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Invalid data provided',
      error: error.message
    });
  }
};

// @desc    Update service
// @route   PUT /api/services/:id
// @access  Public (should be protected in production)
exports.updateService = async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    res.status(200).json({
      success: true,
      data: service
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Invalid data provided',
      error: error.message
    });
  }
};

// @desc    Delete service
// @route   DELETE /api/services/:id
// @access  Public (should be protected in production)
exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Service deleted successfully',
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

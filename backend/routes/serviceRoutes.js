const express = require('express');
const router = express.Router();
const {
  getAllServices,
  getService,
  createService,
  updateService,
  deleteService,
  submitService,
  getAllServicesAdmin,
  getPendingServices,
  approveService,
  deleteServiceAdmin,
  updateServiceAdmin
} = require('../controllers/serviceController');

// Public routes
router.route('/')
  .get(getAllServices)
  .post(createService);

router.post('/submit', submitService);

router.route('/:id')
  .get(getService)
  .put(updateService)
  .delete(deleteService);

// Admin routes (no auth for now - simple password check on frontend)
router.get('/admin/all', getAllServicesAdmin);
router.get('/admin/pending', getPendingServices);
router.put('/admin/:id/approve', approveService);
router.delete('/admin/:id', deleteServiceAdmin);
router.put('/admin/:id', updateServiceAdmin);

module.exports = router;

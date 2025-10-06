const express = require('express');
const router = express.Router();
const {
  getAllServices,
  getService,
  createService,
  updateService,
  deleteService
} = require('../controllers/serviceController');

router.route('/')
  .get(getAllServices)
  .post(createService);

router.route('/:id')
  .get(getService)
  .put(updateService)
  .delete(deleteService);

module.exports = router;

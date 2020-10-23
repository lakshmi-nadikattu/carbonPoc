const express = require('express')
const {
   getDoctorController,savePatientController
} = require('../controller')

const router = express.Router()
router.get('/getDoctorList', getDoctorController)
router.post('/savepatientdetais',savePatientController)
module.exports = router;

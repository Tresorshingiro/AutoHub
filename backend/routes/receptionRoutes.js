const express = require('express')
const { addVehicle, loginReceptionist, getAllVehicles, getOneVehicle, updateVehicle, deleteVehicle, receptionDashboard, getEmployeeProfile } = require('../controllers/receptionController')
const upload = require('../middlewares/multer')
const authReceptionist  = require('../middlewares/authReceptionist')

const router = express.Router()

router.post('/login', loginReceptionist)
router.post('/add-vehicle', authReceptionist, upload.single('image'), addVehicle)
router.get('/vehicles', authReceptionist, getAllVehicles)
router.get('/vehicle/:id', authReceptionist, getOneVehicle)
router.patch('/update-vehicle/:id', authReceptionist, upload.single('image'), updateVehicle)
router.delete('/delete-vehicle/:id', authReceptionist, deleteVehicle)
router.get('/dashboard', authReceptionist, receptionDashboard)
router.get('/profile', authReceptionist, getEmployeeProfile)

module.exports = router

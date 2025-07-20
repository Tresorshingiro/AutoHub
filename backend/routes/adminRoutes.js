const express = require('express')
const { addEmployee, loginAdmin, getAllEmployees, getOneEmployee, getEmployeeProfile } = require('../controllers/adminController')
const upload = require('../middlewares/multer')
const authAdmin  = require('../middlewares/authAdmin')

const router = express.Router()

router.post('/login', loginAdmin)
router.post('/add-employee', authAdmin, upload.single('image'), addEmployee)
router.get('/get-all-employees', authAdmin, getAllEmployees)
router.get('/get-employee/:id', authAdmin, getOneEmployee)
router.get('/profile', authAdmin, getEmployeeProfile)

module.exports = router
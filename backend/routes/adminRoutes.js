const express = require('express')
const { addEmployee, loginAdmin, getAllEmployees, getOneEmployee, getEmployeeProfile, updateEmployee, deleteEmployee, changeEmployeePassword } = require('../controllers/adminController')
const upload = require('../middlewares/multer')
const authAdmin  = require('../middlewares/authAdmin')

const router = express.Router()

router.post('/login', loginAdmin)
router.post('/add-employee', authAdmin, upload.single('image'), addEmployee)
router.get('/get-all-employees', authAdmin, getAllEmployees)
router.get('/get-employee/:id', authAdmin, getOneEmployee)
router.get('/profile', authAdmin, getEmployeeProfile)
router.patch('/update-employee/:id', authAdmin, upload.single('image'), updateEmployee)
router.delete('/delete-employee/:id', authAdmin, deleteEmployee)
router.patch('/change-password/:id', authAdmin, changeEmployeePassword)

module.exports = router
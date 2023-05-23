const express = require('express')
const controler = require('../controller/controller')
const middleware = require('../middleware/middleware')
const route = express.Router()
route.use('/images',express.static('images'))
route.post('/signup' , controler.UserRegister)
route.post('/login' ,controler.userLogin)
route.post('/getupload', middleware.authMiddleware ,controler.upload, controler.CreateUser)
route.get('/users',middleware.authMiddleware, controler.getUser)
route.post('/forgotpassword',controler.forgotPassword)
  
route.post('/createStudent',middleware.authMiddleware , controler.createStudent)

route.get('/getStudent',middleware.authMiddleware,controler.getStudent)

route.put('/updateStudent',middleware.authMiddleware,controler.updateStudent)
route.delete('/deleteStudent',controler.deleteStudent)
module.exports = route;

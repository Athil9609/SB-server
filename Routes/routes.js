const express=require('express')
const AdminController=require('../Contollers/AdminController/AdminController')
const userController=require('../Contollers/UserController/UserController')
const jwtMiddleware = require('../MiddleWare/jwtMiddleWare')
const multerMiddleware=require('../MiddleWare/multerMiddleWare')
const multerMiddleWareVideo=require('../MiddleWare/multerForVideos')

const routes=new express.Router()


routes.post('/login',userController.login)

//adminroutes


routes.post('/addskillcategory',jwtMiddleware,AdminController.addCategory)
routes.get('/viewskillcategory',jwtMiddleware,userController.viewCategories)
routes.post('/deleteskillcategory/:_id',AdminController.deleteCategory)
routes.post('/editskillcategory/:_id',AdminController.editCategory)
routes.put('/updateuserstatus/:id',userController.updateUserStatus);
routes.get('/userlist',userController.viewUsers)
routes.get('/skillListing',userController.getAllSkills)
routes.get('/transactionHistory',userController.transactionHistory)
routes.post('/getComplaintsAndFeedback',jwtMiddleware,userController.getComplaintsAndFeedback)
routes.post('/addAdminResponse/:id',jwtMiddleware,userController.addAdminResponse)

//user rourtes

routes.post('/userreg',multerMiddleware.array('certifications', 10),userController.userRegistration)
routes.get('/userdetails',jwtMiddleware,userController.viewUserDetails)
routes.post('/updateuserdetails',multerMiddleware.single('profile'),jwtMiddleware,userController.updateUserDetails)

routes.post('/postSkill',multerMiddleWareVideo.single('demoVideoURL'),jwtMiddleware,userController.postSkill)
routes.get('/viewMySkill',jwtMiddleware,userController.viewMySkill)
routes.post('/editMySkill',multerMiddleWareVideo.single('demoVideoURL'),jwtMiddleware,userController.editMySkill)
routes.post('/deleteMySkill/:_id',userController.deleteMySkill)
routes.get('/viewSkills/:id',userController.viewSkills)
routes.get('/getUsersBySkill/:skillname',userController.getUsersBySkill)

routes.get('/getSpecificUserDetails/:userId',userController.getSpecificUserDetails)

routes.post('/addRatingAndFeedback',jwtMiddleware,userController.addRatingAndFeedback)
routes.put('/updateRatingAndFeedback/:id',jwtMiddleware,userController.updateRatingAndFeedback)
routes.delete('/deleteRatingAndFeedback/:id',jwtMiddleware,userController.deleteRatingAndFeedback)
routes.get('/getMyRatings',jwtMiddleware,userController.getMyRatings)

routes.post('/addBooking',jwtMiddleware,userController.addBooking)
routes.get('/getMyBookings',jwtMiddleware,userController.getMyBookings)
routes.get('/getOthersBookings',jwtMiddleware,userController.getOthersBookings)
routes.put('/updateBookingStatus',jwtMiddleware,userController.updateBookingStatus)
routes.get('/getSpecificBookingDetails/:id',jwtMiddleware,userController.getSpecificBookingDetails)

routes.post('/addTransactionDetails',jwtMiddleware,userController.addTransactionDetails)
routes.get('/allTransactions',jwtMiddleware,userController.viewAllTransactions)

routes.post('/addComplaintOrFeedback',jwtMiddleware,userController.addComplaintOrFeedback)
routes.post('/purchaseTime',jwtMiddleware,userController.purchaseTime)
routes.post('/updateCurrency',userController.updateCurrency)

module.exports=routes

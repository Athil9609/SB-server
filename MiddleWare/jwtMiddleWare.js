const jwt=require('jsonwebtoken')

const jwtMiddleware=async(req,res,next)=>{
    const token=req.headers.authorization.split(" ")[1]

   try{if(token){ const val=jwt.verify(token,process.env.SECRET_KEY)
    req.payload=val.UserId
    next()}
    else{
        res.status(400).json("Invalid token")
    }}
    catch(err){
        res.status(400).json(err)
    }
}

module.exports=jwtMiddleware
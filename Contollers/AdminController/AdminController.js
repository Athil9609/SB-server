const Skillcategories=require('../../Models/categoryModel')



exports.addCategory=async(req,res)=>{

    try {
 const{categoryName}=req.body


 if(!categoryName){
     res.status(400).json("Category name required")
 }

     const existing=await Skillcategories.findOne({categoryName})
     if(existing){
         res.status(400).json("Category already exists")

     }
     else{
        const newCategory=new Skillcategories({categoryName})
        await newCategory.save()
        res.status(200).json(newCategory)
     }
        
    } catch (error) {

        res.status(404).json(error)
        
    }

}



exports.deleteCategory=async(req,res)=>{
    try {
        const{_id}=req.params
        console.log(req.params)
        const response=await Skillcategories.findOneAndDelete({_id})
        res.status(200).json(response)
    } catch (error) {
        res.status(404).json(error)
    }
}

exports.editCategory=async(req,res)=>{
  try {

    var{categoryName}=req.body
    var{_id}=req.params
    if(!categoryName){
      res.status(404).json("Invalid data")
    }else{
      const existing=await Skillcategories.findOne({_id})
      existing.categoryName=categoryName
      await existing.save()
      res.status(200).json(existing)
    }
    
  } catch (error) {
    res.status(404).json(error)
}
}



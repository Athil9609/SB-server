const moongoose=require('mongoose')


const categoryModel=new moongoose.Schema(
    {
        categoryName: {
          type: String,
          required: true,
          unique: true, 
          trim: true,
        },
      },
      { timestamps: true } 
   )

const Skillcategories=moongoose.model('Skillcategories',categoryModel)

module.exports=Skillcategories
const moongoose=require('mongoose')


const categoryModel=new moongoose.Schema(
    {
        categoryName: {
          type: String,
          required: true,
          unique: true, // Ensures no duplicate category names
          trim: true,
        },
      },
      { timestamps: true } // Automatically adds `createdAt` and `updatedAt`
   )

const Skillcategories=moongoose.model('Skillcategories',categoryModel)

module.exports=Skillcategories
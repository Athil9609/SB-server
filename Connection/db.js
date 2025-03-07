const moongoose = require("mongoose");

moongoose
  .connect(process.env.DB_CONNECTION)
  .then((res) => {
    console.log("Server Connected to MongoDb");
  })
  .catch((err) => {
    console.log(err);
  });

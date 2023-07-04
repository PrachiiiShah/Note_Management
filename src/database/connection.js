const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/Project1", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    //useCreateIndex: true
}).then(() => {
    console.log("Connection Sucessfully");
}).catch((e) => {
    console.log(e);
})
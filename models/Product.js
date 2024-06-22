const mongoose = require("mongoose")
const ProductShema = mongoose.Schema({
    featured: {
        type: Boolean,
        default:false
    },
    rating: {
        type: Number,
        default:0

    },
    createdAt: {
        type:Date
    },
    name: {
        type: String,
        required: true,
        required: [true, "you must provide a name"],
        trim: true,
    },
    price: {
        type: Number,
        required: true,
        required: [true, "you must provide a price"],
    
    },
    company: {
        type:String
    }

})
module.exports=mongoose.model("Product",ProductShema)
const express = require("express")
const router = express.Router()

const {getAllProducts,getProduct,createProduct,updateProduct,deleteProduct}=require("../controllers/Product")
router.route("/").get(getAllProducts).post(createProduct)
router.route("/:productId").get(getProduct).put(updateProduct).delete(deleteProduct)
module.exports=router
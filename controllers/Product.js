const asyncWrapper = require("../middleware/asyncWrapper");
const Product = require("../models/Product");
const getAllProducts =asyncWrapper( async (req, res) => {
  const { featured, company, name, sort, fields, numericFilters } = req.query;
  const queryObject = {};

  if (featured) {
    queryObject.featured = featured === 'true' ? true : false;
  }
  if (company) {
    queryObject.company = company;
  }
  if (name) {
    queryObject.name = { $regex: name, $options: 'i' };
  }
  if (numericFilters) {
    const operatorMap = {
      '>': '$gt',
      '>=': '$gte',
      '=': '$eq',
      '<': '$lt',
      '<=': '$lte',
    };
    const regEx = /\b(<|>|>=|=|<|<=)\b/g;
    let filters = numericFilters.replace(
      regEx,
      (match) => `-${operatorMap[match]}-`
    );
    const options = ['price', 'rating'];
    filters = filters.split(',').forEach((item) => {
      const [field, operator, value] = item.split('-');
      if (options.includes(field)) {
        queryObject[field] = { [operator]: Number(value) };
      }
    });
  }

  let result = Product.find(queryObject);
  // sort
  if (sort) {
    const sortList = sort.split(',').join(' ');
    result = result.sort(sortList);
  } else {
    result = result.sort('createdAt');
  }

  if (fields) {
    const fieldsList = fields.split(',').join(' ');
    result = result.select(fieldsList);
  }
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  result = result.skip(skip).limit(limit);
  // 23
  // 4 7 7 7 2

  const products = await result;
  res.status(200).json({ products, nbHits: products.length });
})
const getProduct = asyncWrapper(async (req, res, next) => {
    const product = await Product.findOne({ _id: req.params.productId });

    if (!product) {
      return next(
        createCustomError(`No product with id : ${req.params.productId}`, 404)
      );
    }
    res.status(200).json(product);
});
const updateProduct = asyncWrapper(async (req, res, next) => {
    const product = await Product.findByIdAndUpdate(req.params.productId, req.body, {
        new: true,
        runValidators: true,
        //   overwrite:true  this replaces all the object
      });
    
      if (!product) {
        return next(
          createCustomError(`No product with id : ${req.params.productId}`, 404)
        );
      }
    
      res.status(200).json(product);
});
const createProduct = asyncWrapper(async (req, res, next) => {
    const exists = Product.findOne({ name: req.body.name });
    
  if (!exists) {
    res.status(302).json({ error: "Product already exists" });
  } else {
 const product = await Product.create({ ...req.body, createdAt: new Date() });
    res.status(201).json(product);
  }
});


const deleteProduct = asyncWrapper(async (req, res, next) => {
    const product = await Product.findByIdAndDelete({ _id: req.params.productId });

    if (!product) {
      return next(
        createCustomError(`No product with id : ${req.params.productId}`, 404)
      );
      
    }
  
    res.status(200).json({ msg: "product deleted" });
});
module.exports = {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};

const Product = require('../models/product')

const getAllProductsStatic = async(req,res) =>{
    // throw new Error('testing async errors')
    const products = await Product.find({
        featured:true,
    })
    res.status(200).json({products, nbHits: products.length})
}

const getAllProducts = async (req,res) =>{
    // console.log("jellp")
    // const products = await Product.find(req.query); // This will not handle when we pass some properties as queries which we have not defined
    const { featured , company } = req.query
    const queryObject = {}
    if(featured) {
        queryObject.featured = featured === 'true' ? true : false
    }
    if(company) {
        queryObject.company = company
    }
    console.log(queryObject)
    const products = await Product.find(queryObject)
    res.status(200).json({products, nbHits: products.length})
}

module.exports = {
    getAllProducts,
    getAllProductsStatic,
}
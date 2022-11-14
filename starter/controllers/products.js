const Product = require('../models/product')

const getAllProductsStatic = async(req,res) =>{
    // throw new Error('testing async errors')
    const search = 'oo'
    /*
    const products = await Product.find({
        // featured:true,
        // $regex is a mongodb query operator. It selects documents where values match a specified regular expression
        // If we won't use this, then if user enters complete name, then only he will get the result but by using this if user enter any letter and it is present in that property, then we will get the result
        name: {$regex: search, $options: 'i'},
    })
    */
    const products = await Product.find({}).sort('-name price')  // manual approach of sorting
    res.status(200).json({products, nbHits: products.length})
}
const getAllProducts = async (req,res) =>{
    // const products = await Product.find(req.query); // This will not handle when we pass some properties as queries which we have not defined

    const { featured,company,name,sort,fields,numericFilters } = req.query
    const queryObject = {}
    if(featured) {
        queryObject.featured = featured === 'true' ? true : false
    }
    if(company) {
        queryObject.company = company
    }
    if(name) {
        queryObject.name = {$regex: name, $options: 'i'} 
    }
    if(numericFilters){
        const operatorMap = {
            '>':'$gt',
            '>=':'$gte',
            '=':'$eq',
            '<':'$lt',
            '<=':'lte',
        }
        const regEx = /\b(<|>|>=|=|<|<=)\b/g
        let filters = numericFilters.replace(
            regEx,
            (match)=>`-${operatorMap[match]}-`
        )
        console.log(filters)

        const options = ['price','rating']
        filters = filters.split(',').forEach((item)=>{
            const [field,operator,value] = item.split('-')
            if(options.includes(field)){
                queryObject[field] = {[operator]: Number(value)}
            }
        })
    }

    console.log(queryObject)
    // const products = await Product.find(queryObject)
    let result = Product.find(queryObject)
    if(sort){
        const sortList = sort.split(',').join(' ')
        result = result.sort(sortList)
    }
    else{
        result = result.sort('createdAt')
    }
    
    if(fields){
        const fieldList = fields.split(',').join(' ')
        result = result.select(fieldList)
    }

    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const skip = (page-1)* limit;
    result = result.skip(skip).limit(limit)

    const products = await result
    res.status(200).json({products, nbHits: products.length})
}

module.exports = {
    getAllProducts,
    getAllProductsStatic,
}
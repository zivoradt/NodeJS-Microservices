const ProductService = require('../services/product-service');
const {PublishingCustomerEvent, PublishingShoppingEvent} = require('../utils');
const UserAuth = require('./middlewares/auth');

module.exports = (app) => {
    
    const service = new ProductService();
    


    app.post('/create', async(req,res,next) => {

        const { name, desc, type, unit,price, available, suplier, banner } = req.body; 
        // validation
        const { data } =  await service.CreateProduct({ name, desc, type, unit,price, available, suplier, banner });
        return res.json(data);
        
    });

    app.get('/category/:type', async(req,res,next) => {
        
        const type = req.params.type;
        
        try {
            const { data } = await service.GetProductsByCategory(type)
            return res.status(200).json(data);

        } catch (error) {
            return res.status(404).json({error});
        }

    });

    app.get('/:id', async(req,res,next) => {
        
        const productId = req.params.id;
        console.log(req.params.id);

        try {
            const { data } = await service.GetProductDescription(productId);
            return res.status(200).json(data);

        } catch (err) {
            next(err);

        }

    });

    app.post('/ids', async(req,res,next) => {

        const { ids } = req.body;
        const products = await service.GetSelectedProducts(ids);
        return res.status(200).json(products);
       
    });
     
    app.put('/wishlist',UserAuth, async (req,res,next) => {

        const { _id } = req.user;
        
        // Get payload //  sent to Customer Services
        const {data} = await service.GetProductPayload(_id, {productId: req.body._id}, 'ADD_TO_WISHLIST');

        
        // Sent to Customer Services
        PublishingCustomerEvent(data);
         
        return res.status(200).json(data.data.product);
    });
    
    app.delete('/wishlist/:id',UserAuth, async (req,res,next) => {

        const { _id } = req.user;
        const productId = req.params.id;
    
        // Get payload //  sent to Customer Services
        const {data} = await service.GetProductPayload(_id, {productId}, 'REMOVE_FROM_WISHLIST');

        PublishingCustomerEvent(data);

        return res.status(200).json(data.data.product);
    });


    app.put('/cart',UserAuth, async (req,res,next) => {

        const { _id } = req.user;

        try{
             // Get payload //  sent to Customer Services
        const {data} = await service.GetProductPayload(_id, {productId: req.body._id, qty: req.body.qty}, 'ADD_TO_CART');
        // Sent to Customer SErvice
        PublishingCustomerEvent(data);

        // Sent to Shopping Service
        PublishingShoppingEvent(data);

        const response = {
            product: data.data.product,
            qty: data.data.qty
        }

        res.status(200).json(response);
    }catch(err){
        next(err);
    }
    });
    
    app.delete('/cart/:id',UserAuth, async (req,res,next) => {

        const { _id } = req.user;
        const productId = req.params.id;

        try{
            // Get payload //  sent to Customer Services
        const {data} = await service.GetProductPayload(_id, {productId}, 'REMOVE_FROM_CART');
        // Sent to Customer SErvice
        PublishingCustomerEvent(data);
      
        // Sent to Shopping Service
        PublishingShoppingEvent(data);

        const response = {
            product: data.data.product,
            qty: data.data.qty
        }
         
        res.status(200).json(response);
    }catch(err){
        next(err);
    }
    });

    //get Top products and category
    app.get('/', async (req,res,next) => {
        //check validation
        try {
            const { data} = await service.GetProducts();        
            return res.status(200).json(data);

        } catch (error) {
            return res.status(404).json({error});

        }
        
    });
    
}
const ShoppingService = require("../services/shopping-service");
const { PublishingCustomerEvent } = require("../utils");
const UserAuth = require('./middlewares/auth');

module.exports = (app) => {
    
    const service = new ShoppingService();


    app.post('/order',UserAuth, async (req,res,next) => {

        const { _id } = req.user;
        const { txnNumber } = req.body;

        const { data } = await service.PlaceOrder({_id, txnNumber});

        const payload = await service.GetOrderPayload(_id, data, 'CREATE_ORDER');
        
        PublishingCustomerEvent(payload);
    
        res.status(200).json(data);

    });

    app.get('/orders',UserAuth, async (req,res,next) => {

        const { _id } = req.user;

        const { data } = await service.GetOrders(_id);
        
        res.status(200).json(data);

    });
       
    
    app.get('/cart', UserAuth, async (req,res,next) => {

        const { _id } = req.user;
        try {
            const { data } = await service.getCart({_id});

            return res.status(200).json(data);
        } catch (error) {
            throw error;
        }
       
    });
}
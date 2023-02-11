const mongoose = require("mongoose");
const {OrderModel, CartModel,} = require("../models");
const { v4: uuidv4 } = require("uuid");

//Dealing with data base operations
class ShoppingRepository {
  // payment

  async Orders(customerId) {
    try {
      const orders = await OrderModel.find({ customerId });
      return orders;
    } catch {
      throw APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to find orders"
      );
    }
  }

  async Cart(customerId) {
    try {
      const cartItems = await CartModel.find({ customerId: customerId });

      if (cartItems) {
        return cartItems;
      }
      throw new Error("Data not found");
    } catch (err) {
      throw err;
    }
  }

  async AddCartItem(customerId, item, qty, isRemove) {
    try {
      const cart = await CartModel.findOne({ customerId: customerId });

      const { _id } = item;

      if (cart) {
        let isExist = false;

        let cartItems = cart.items;

        if (cartItems.length > 0) {
          cartItems.map((item) => {
            if (item.product._id.toString() === _id.toString()) {
              if (isRemove) {
                cartItems.splice(cartItems.indexOf(item), 1);
              } else {
                item.unit = qty;
              }
              isExist = true;
            }
          });
        }

        if (!isExist && !isRemove) {
          cartItems.push({ product: { ...item }, unit: qty });
        }

        cart.items = cartItems;

        return await cart.save;

      } 
      else 
      {
        return await CartModel.create({
          customerId,
          items: [{ product: { ...items }, unit: qty }],
        });
      }
    } catch (err) {
      throw APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to add to Cart"
      );
    }
  }

  async CreateNewOrder(customerId, txnId) {
    //check transaction for payment Status
    try{
    const cart = await CartModel.findById(customerId);

    if (cart) {
      let amount = 0;

      let cartItems = cart.items;

      if (cartItems.length > 0) {
        //process Order
        cartItems.map((item) => {
          amount += parseInt(item.product.price) * parseInt(item.unit);
        });

        // Here we create a order ID
        const orderId = uuidv4();

        const order = new OrderModel({
          orderId,
          customerId,
          amount,
          txnId,
          status: "received",
          items: cartItems,
        });

        cart.items = [];

        const orderResult = await order.save();

        await cart.save();

        return orderResult;
      }
    }

    return {};

    }catch(err){
        throw APIError(
            "API Error",
            STATUS_CODES.INTERNAL_ERROR,
            "Unable to add Order"
          );
    }
  }
}

module.exports = ShoppingRepository;

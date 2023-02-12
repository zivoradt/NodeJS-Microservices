const express = require('express');
const cors  = require('cors');
const { products, appEvent } = require('./api');

module.exports = async (app, channel) => {

    app.use(express.json());
    app.use(cors());
    app.use(express.static(__dirname + '/public'))

    
    //api
    products(app, channel);
   
    // error handling
    
    
}
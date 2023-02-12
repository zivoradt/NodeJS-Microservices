const express = require('express');
const { PORT } = require('./src/config/index');
const { databaseConnection } = require('./src/database');
const expressApp = require('./src/express-app');
const {CreateChannel} = require('./src/utils')

const StartServer = async() => {

    const app = express();
    
    await databaseConnection();
    
    const channel = await CreateChannel();
    
    await expressApp(app, channel);

    app.listen(PORT, () => {
        console.log(`listening to port ${PORT}`);
    })
    .on('error', (err) => {
        console.log(err);
        process.exit();
    })

}

StartServer();
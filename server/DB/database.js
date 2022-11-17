const maria = require("mysql");
require('dotenv').config();

const db_config = {
    host: process.env.LOCAL_IP_ADDRESS,
    port: process.env.LOCAL_DB_PORT,
    user: process.env.LOCAL_USER_NAME,
    password: process.env.LOCAL_PASSWORD,
    database: process.env.LOCAL_DB_NAME
};

let connection;

let handleDisconnect = () => {
    connection = maria.createConnection(db_config);

    connection.connect((err) => {
        if (err) {
            setTimeout(handleDisconnect, 2000);
        }
    });

    connection.on('error', (err) => {
        console.log(err.message);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            handleDisconnect();
        } else {
            throw err;
        }
    });
}

handleDisconnect();
module.exports = connection;
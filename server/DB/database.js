const maria = require("mysql");
var config = require('./config');

const connection = maria.createConnection({
    host: config.host,
    port: config.port,
    user: config.user,
    password: config.password,
    database: config.database
});

let handleDisconnect = () => {
    connection.connect((err) => {
        if(err) {
            setTimeout(handleDisconnect(), 2000);
        }
    });

    connection.on('error', (err) => {
        console.log(err.message);
        if(err.code === 'PROTOCOL_CONNECTION_LOST') {
            handleDisconnect();
        }else{
            throw err;
        }
    });
}

handleDisconnect();
module.exports = connection;
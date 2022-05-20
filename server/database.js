const maria = require("mysql");

const conn = maria.createConnection({
    host: '172.30.1.18',
    port: 3305,
    user: 'choi',
    password: '1234red!',
    database: 'testingdb'
});

function handleDisconnect() {
    conn.connect(function (err) {
        if (err) {
            console.log('error when connecting to db:', err);
            setTimeout(handleDisconnect, 2000);
        }
    });

    conn.on('error', function (err) {
        console.log('db error', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            return handleDisconnect();
        } else {
            throw err;
        }
    });
}

handleDisconnect();

module.exports = conn;
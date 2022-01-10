require("dotenv").config();

/*const {establishDatabaseConnection} = require("./app/databases/sql-connection");

establishDatabaseConnection()
    .then(() => {
        startServer();
    })
    .catch(error => {
        console.error("Could not start Application due to", error);
        process.exit(-1);
    })*/


const startServer = () => {
    const PORT = process.env.APP_PORT || 3000;
    const http = require("http");
    const app = require("./app/app");

    http.createServer(app).listen(PORT, () => {
        console.log(`Server is listening on port ${PORT}`);
    });
};
startServer();
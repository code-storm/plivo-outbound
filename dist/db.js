"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mysql_1 = require("mysql");
const con = mysql_1.createConnection({
    host: process.env.DB_HOSTNAME,
    database: process.env.DB_DATABASE_NAME,
    user: process.env.DB_USER_NAME,
    password: process.env.DB_PASSWORD,
    port: +process.env.DB_PORT
});
con.connect(err => {
    if (err)
        throw err;
    console.log("Connected!");
});
//# sourceMappingURL=db.js.map
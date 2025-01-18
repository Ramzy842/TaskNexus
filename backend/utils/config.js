require("dotenv").config();

const MONGODB_URI =
    process.env.NODE_ENV === "test"
        ? process.env.TEST_MONGODB_URI
        : process.env.MONGODB_URI;
const PORT = process.env.PORT;
const google = {
    Client_ID: process.env.Client_ID,
    Client_SECRET: process.env.Client_SECRET,
};

module.exports = { MONGODB_URI, PORT, google };

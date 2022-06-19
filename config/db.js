const mongoose = require("mongoose")
module.exports = {
    mongoURI: "mongodb://localhost:27017/Bazadanych1",
    secretOrKey: "secret"
};

require("../models/muzyka.model")

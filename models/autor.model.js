const mongoose = require("mongoose")
let autorSchema = new mongoose.Schema({
   Imie: {type: String, required: true},
   Nazwisko: {type: String, required: true},
   Muzyka: [{type: mongoose.Schema.Types.ObjectId, ref: "Muzyka"}]
})


const Autor = mongoose.model("Autor", autorSchema)
module.exports = Autor;

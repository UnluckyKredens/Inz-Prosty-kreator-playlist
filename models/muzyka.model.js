const mongoose = require("mongoose")
let muzykaSchema = new mongoose.Schema({
    Autor: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Autor"
    },
    IDplaylisty: {
        type: String,
        required: 'This field is required'
    },
    Tytul: {
        type: String,
        required: 'This field is required'
    },
    linkYT: {
        type: String,
        required: 'This field is required'
    }
})
module.export = mongoose.model("Muzyka", muzykaSchema)
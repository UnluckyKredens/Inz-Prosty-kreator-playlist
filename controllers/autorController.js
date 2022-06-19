const express = require("express")
const autorRouter = express.Router()
const mongoose = require("mongoose")
const Muzyka = mongoose.model("Muzyka")
const Autor = require("../models/autor.model");

autorRouter.post('/', async (req, res) => {
    try {
        console.log(req.body)
        const newAuthor = new Autor(req.body);
        newAuthor.save();
        res.redirect('autor/list');
    } catch (error) {
        console.error(error);
        res.send(400)
    }

})

autorRouter.get('/dodaj', (req, res) => {
    res.render('autor/form', {viewTitle: "Dodaj autora"})
});

autorRouter.get('/list', async (req, res) => {
    try {
        const authors = await Autor.find().populate("Muzyka");
        res.render("autor/list", {
            list: authors
        })
    } catch (error) {
        res.json([])
    }
});

autorRouter.get("/usun/:id", (req, res) => {
    Autor.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.redirect("/autor/list")
        } else {
            console.log("Error in deletion: " + err)
        }
    })
})

module.exports = autorRouter


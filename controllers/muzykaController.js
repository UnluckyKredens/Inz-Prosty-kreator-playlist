const express = require("express")
var router = express.Router()
const mongoose = require("mongoose");
const Autor = require("../models/autor.model");
const Muzyka = mongoose.model("Muzyka")
const User = require("../models/user");

var LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./scratch');

router.get("/", async (req, res) => {
    const allAuthors = await Autor.find();
    res.render("muzyka/addOrEdit", {
        viewTitle: "Dodaj piosenkę do playlisty",
        authors: allAuthors
    })
})
router.post("/", async (req, res) => {
    if (req.body._id == "") {
        insertRecord(req, res)
    } else {
        updateRecord(req, res)
    }
})
async function insertRecord(req, res) {
    var muzyka = new Muzyka()
    muzyka.IDplaylisty = localStorage.getItem("ID");
    muzyka.Autor = req.body.Autor
    muzyka.Tytul = req.body.Tytul
    muzyka.linkYT = req.body.linkYT
    try {
        const music = await muzyka.save();
        const author = await Autor.findById(muzyka.Autor);
        author.Muzyka.push(music);
        await author.save();
        res.redirect("muzyka/list")
    } catch (error) {
        console.log("Error during insert: " + error)
    }
}
function updateRecord(req, res) {
    Muzyka.findOneAndUpdate(
        { _id: req.body._id },
        req.body,
        { new: true },
        (err, doc) => {
            if (!err) {
                res.redirect("muzyka/list")
            } else {
                console.log("Error during update: " + err)
            }
        }
    )
}

router.get("/list", async (req, res) => {
    try {
        const allMusic = await Muzyka.find().populate("Autor");
        res.render("muzyka/list", {
            list: allMusic
        })
    } catch (error) {
        console.log("Error in retrieval: " + error)
    }
})
router.get("/:id", async (req, res) => {
    try {
        const data = await Muzyka.findById(req.params.id).populate("Autor");
        const allAuthors = await Autor.find();
        console.log("DATA:", data);
        res.render("muzyka/addOrEdit", {
            viewTitle: "Aktualizuj playlistę",
            muzyka: data,
            authors: allAuthors
        });
    } catch (error) {
        console.log(error);
    }
})

router.get("/delete/:id", (req, res) => {
    Muzyka.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.redirect("/muzyka/list")
        } else {
            console.log("Error in deletion: " + err)
        }
    })
})

module.exports = router
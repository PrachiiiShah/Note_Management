const { links } = require("express/lib/response");
const mongoose = require("mongoose");
const validator = require("validator");

const BookmarkSchema = new mongoose.Schema({
        link: {
            required: true,
            type: String,
            // 
        },
        title: {
            type: String,
            required: true,
        },
        tag: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,

        },
        users: {
            type: String,
            required: true,
        }

    })
    //Create a new collection
const note = new mongoose.model('bookmark', BookmarkSchema);
module.exports = note;
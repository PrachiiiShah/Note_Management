const mongoose = require("mongoose");
const validator = require("validator");

const NoteSchema = new mongoose.Schema({
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
            required: true
        }

    })
    //Create a new collection
const note = new mongoose.model('note', NoteSchema);
module.exports = note;
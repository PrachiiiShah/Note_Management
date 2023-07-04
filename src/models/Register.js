const mongoose = require("mongoose");
const validator = require("validator");

const RegisterSchema = new mongoose.Schema({
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            unique: [true, "Email Id is alerady registered."],
            validate(value) {
                if (!validator.isEmail(value)) {
                    throw new console.error("Invalid error");
                }
            }
        },
        password: {
            type: String,
            required: true,

        },
        token: {
            type: String,
        }

    })
    //Create a new collection
const register = new mongoose.model('register', RegisterSchema);
module.exports = register;
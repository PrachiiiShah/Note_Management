const express = require("express");
const denv = require('dotenv');
const register = require("./models/Register");
const note = require("./models/Note");
const bookmark = require("./models/bookmark");
const app = express();
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const async = require("hbs/lib/async");
require("./database/connection");
const port = process.env.PORT || 3200;
denv.config({ path: 'token.env' })
app.use(express.json());
const validUrl = require('valid-url');
const auth = require("./models/auth");
const passport = require("./models/passport");
const passports = require("passport");

jwtKey = "jwt";

app.get("/", (req, res) => {
    res.send("Welcome");
})

//Post Register
app.post("/register", async(req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!(name && email && password)) {
            res.status(400).send("All inputs are required");
        }

        const oldUser = await register.findOne({ email });

        if (oldUser) {
            return res.status(409).send("User Already Exist.");
        }

        encryptedUserPassword = await bcrypt.hash(password, 10);
        const newUser = await register.create({
            name: name,
            email: email,
            password: encryptedUserPassword,

        });

        // Create token
        const token = jwt.sign({ register_id: register._id, email, name },
            process.env.TOKEN_KEY, {
                expiresIn: "5h",
            }
        );
        await newUser.save()
            // return res.send(newUser)
        return res.send(token)

    } catch (e) {
        res.status(400).send(e)
        console.log(e)
    }

})

//Get All Register
app.get("/register", async(req, res) => {
    try {
        const registerdata = await register.find();
        res.send(registerdata)
    } catch (e) {
        return res.send(e);
        console.log(e);
    }
})

//Get Data by ID
app.get("/register/:id", async(req, res) => {
    try {
        const _id = req.params.id //uper /id: ni jagya name lakhu hot to params.name avat
        const registerData = await register.findById(_id);
        console.log(registerData)
        if (!registerData) {
            return res.status(404).send(e);
        } else {
            res.send(registerData);
        }

    } catch (e) {
        res.status(500).send(e);
    }

})

//delete data by ID
app.delete("/register/:id", async(req, res) => {
    try {
        const _id = req.params.id;
        const deletedata = await register.findByIdAndDelete(_id);
        console.log(deletedata)
        if (!deletedata) {
            return res.status(404).send("Errie")
        } else {
            res.send(deletedata);
        }
    } catch (e) {
        res.status(500).send(e);
        console.log(e)
    }
})


//Patch - Update Data
app.patch("/register/:id", async(req, res) => {
    try {
        const _id = req.params.id;
        const updatedata = await register.findByIdAndUpdate(_id, req.body, { new: true });
        console.log(updatedata)
        if (!updatedata) {
            return res.status(404).send(e)
        } else {
            res.send(updatedata);
        }
    } catch (e) {
        res.status(500).send(e);
        console.log(e)
    }
})


// Post Login
app.post("/login", async(req, res) => {
    try {
        const { email, password } = req.body;

        if (!(email && password)) {
            return res.status(400).send("All inputs are required");
        }

        const user = await register.findOne({ email });
        if (email && (await bcrypt.compare(password, user.password))) {
            console.log("Match");

            // Create token
            const token = jwt.sign({ user_id: user._id, email },
                process.env.TOKEN_KEY, {
                    expiresIn: "5h",
                }
            );
            //console.log(user)
            return res.header("auth-token", token).send("Bearer " + token)

        } else {
            res.send("Invalid");
            console.log("Not Valid");
        }

    } catch (e) {
        return res.status(400).send(e);
        console.log(e);

    }

})

//Post Note
app.post("/note", passports.authenticate("jwt", { session: false }), async(req, res) => {
    try {
        const { title, tag, description } = req.body;

        if (!(title && tag && description)) {
            res.status(400).send("All inputs are required");
        } else {
            const createnote = new note({
                    title,
                    tag,
                    description
                })
                //console.log(req.user);
            createnote.users = await req.user.user_id
            createnote.save();
            res.status(200).send(createnote);
        }


    } catch (e) {
        return res.status(400).send(e);
        console.log(e);
    }

})

app.get('/getUser', passports.authenticate("jwt", { session: false }), (req, res) => {
        console.log(req.user)
    })
    //Get All Notes
app.get("/allnote", passports.authenticate("jwt", { session: false }), async(req, res) => {
    try {
        const notedata = await note.find({ users: req.user.user_id })
        res.send(notedata)
    } catch (e) {
        console.log("not available");
        res.send(e);
    }
})

//Get Note by ID
app.get("/note/:id", async(req, res) => {
    try {
        const _id = req.params.id //uper /id: ni jagya name lakhu hot to params.name avat
        const noteData = await note.findById(_id);
        console.log(noteData)
        if (!noteData) {
            return res.status(404).send(e);
        } else {
            res.send(noteData);
        }

    } catch (e) {
        res.status(500).send(e)
    }

})

//delete note by ID
app.delete("/note/:id", async(req, res) => {
    try {
        const _id = req.params.id;
        const deletedata = await note.findByIdAndDelete(_id);
        console.log(deletedata)
        if (!deletedata) {
            return res.status(404).send("Error")
        } else {
            res.send(deletedata);
        }
    } catch (e) {
        res.status(500).send(e);
        console.log(e)
    }
})


//Patch - Update note
app.patch("/note/:id", async(req, res) => {
    try {
        const _id = req.params.id;
        const updatedata = await note.findByIdAndUpdate(_id, req.body, { new: true });
        console.log(updatedata)
        if (!updatedata) {
            return res.status(404).send(e)
        } else {
            res.send(updatedata);
        }
    } catch (e) {
        res.status(500).send(e);
        console.log(e)
    }
})

//create Bookmark 
app.post("/bookmark", passports.authenticate("jwt", { session: false }), async(req, res) => {
    try {
        const { link, title, tag, description } = req.body;

        if (!(link && title && tag && description)) {
            res.status(400).send("All inputs are required");
        } else {
            if (validUrl.isUri(link)) {
                console.log('Looks like an URL');


                const createbookmark = new bookmark({
                    link,
                    title,
                    tag,
                    description
                })
                createbookmark.users = await req.user.user_id
                createbookmark.save();
                res.status(200).send(createbookmark);
            } else {
                //
                console.log('Not a URL');
                return res.status(400).send(e);
                //console.log(e);

            }
        }

    } catch (e) {
        return res.status(400).send(e);
        console.log(e);
    }

})


//Get All Bookmarks
app.get("/allbookmark", passports.authenticate("jwt", { session: false }), async(req, res) => {
    try {
        const bookmarkdata = await bookmark.find({ users: req.user.user_id });
        res.send(bookmarkdata)
    } catch (e) {
        console.log("not available");
        res.send(e);
    }
})

//Get Bookmark by ID
app.get("/bookmark/:id", async(req, res) => {
    try {
        const _id = req.params.id //uper /id: ni jagya name lakhu hot to params.name avat
        const bookmarkData = await bookmark.findById(_id);
        console.log(bookmarkData)
        if (!bookmarkData) {
            return res.status(404).send(e);
        } else {
            res.send(bookmarkData);
        }

    } catch (e) {
        res.status(500).send(e);
    }

})

//delete bookmark by ID
app.delete("/bookmark/:id", async(req, res) => {
    try {
        const _id = req.params.id;
        const deletebookmark = await bookmark.findByIdAndDelete(_id);
        console.log(deletebookmark)
        if (!deletebookmark) {
            return res.status(404).send(e)
        } else {
            res.send(deletebookmark);
        }
    } catch (e) {
        res.status(500).send(e);
        console.log(e)
    }
})


//Patch - Update bookmark
app.patch("/bookmark/:id", async(req, res) => {
    try {
        const _id = req.params.id;
        const updatebookmark = await bookmark.findByIdAndUpdate(_id, req.body, { new: true });
        console.log(updatebookmark)
        if (!updatebookmark) {
            return res.status(404).send(e)
        } else {
            res.send(updatebookmark);
        }
    } catch (e) {
        res.status(500).send(e);
        console.log(e)
    }
})



// app.get("/current", async(req, res) => {
//     try {
//         const bearerHeader = req.headers['authorization'];
//         console.warn(bearerHeader)
//         if (typeof bearerHeader !== 'undefined') {
//             const bearer = bearerHeader.split(' ')
//             //return res.send(bearer[1])
//             //console.log(bearer[1])
//                 //req.token = bearer[1]

//         } else {
//             res.send({ "result": "Token is not provided" })
//         }
//     } catch (e) {
//         res.status(500).send(e);
//         console.log(e)
//     }
// })



//function verifyToken(req,res)
//     if (typeof bearerHeader !== 'undefined') {
//         const bearer = bearerHeader.split(' ')
//             //console.log(bearer[1])
//             //req.token = bearer[1]
//         jwt.verify(req.token, jwtKey, (err, authData) => {
//             if (err) {
//                 res.json({ result: err })
//                 console.log(err);
//             } else {
//                 res.send(token)
//             }
//         })
//     } else {
//         res.send({ "result": "Token is not provided" })
//     }
//}


// app.get('/current', async(req, res) => {
//     const _id = req.params.id;
//     // _id = req;
//     return register.findById(_id).then((register) => {
//             if (!register) {
//                 return res.send(400);
//             }
//             return res.json(token);
//         })
//         //const bookmarkData = await bookmark.findById(_id);
// })



app.post("/welcome", auth, (req, res) => {
    try {
        res.status(200).send("Welcome ");
    } catch (e) {
        res.status(500).send(e);
        console.log(e)
    }
});


app.listen(port, () => {
    console.log(`server is running at ${port}`);
})
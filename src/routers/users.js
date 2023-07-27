const express = require("express");
const bcrypt = require("bcrypt");
const AmazonUser = require("../modals/newUser");
const router = new express.Router();
const auth = require("../middleware/auth");

//client secret(google)
// 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
//client id
// 527799371434-t7cqovh6neqta4cct3tgf11emc2p75od.apps.googleusercontent.com

router.get("/", (req, res) => {
    res.send("i got my page here").status(200);
})

router.get("/isuser", auth, (req, res) => {
    if (req.user) {
        res.send({ user: req.user }).status(201);
    } else {
        res.send({ message: "User loged out please login again" }).status(201);
    }
})

router.post("/auth/signin", (req, res) => {
    const { email, password } = req.body;
    try {
        AmazonUser.findOne({ email: email }, async (err, user) => {
            if (user) {
                const isMatch = await bcrypt.compare(password, user.password);
                const token = await user.generateAuthToken();
                // creating cookie
                res.cookie('jwt', token, { httpOnly: true, SameSite: true });
                console.log(token);

                if (isMatch) {
                    res.send({ message: "Signin successful", user: user, cookie: req.cookies.jwt });
                }
                else {
                    res.send({ message: "Invalid credentials" });
                }
            }
            else {
                res.send("User not found");
            }
        })
    } catch (error) {
        res.send(error).status(400);
    }
});

router.get("/auth/logout", auth, async (req, res) => {
    try {
        res.clearCookie("jwt");

        //logout only from single device
        req.user.tokens = req.user.tokens.filter((currElm) => {
            return currElm.token !== req.token;
        })

        await req.user.save();
        res.send({ message: "logedout" }).status(200)
    } catch (error) {
        res.status(500).send(error);
    }
})

router.get("/auth/logoutall", auth, async (req, res) => {
    try {
        res.clearCookie("jwt");

        //logout from all devices
        // req.user.tokens = [];
        req.user.tokens = req.user.tokens.slice(0, 1)

        await req.user.save();
    } catch (error) {
        res.status(500).send(error);
    }
})

router.post("/auth/signup", (req, res) => {
    const { name, email, password, phone, locality, city, state } = req.body;
    // console.log(req.body);
    try {
        AmazonUser.findOne({ email: email }, async (err, user) => {
            if (user) {
                res.send({ message: "User already regestered" });
            }
            else {
                try {
                    const user = new AmazonUser({ name, email, password, phone, address: [{ locality, city, state }] });
                    // creating token for user  
                    const token = await user.generateAuthToken();
                    // creating cookie
                    res.cookie("jwt", token, { httpOnly: true, SameSite: false });

                    // console.log("Token", token);
                    const createUser = await user.save();
                    res.send({ message: "Successfully regestered", user: createUser }).status(201);
                } catch (error) {
                    console.log(error);
                }
            }
        })
    } catch (error) {
        res.send(error).status(400);
    }
})

router.patch("/auth/updateprofile", auth, async (req, res) => {
    const user = req.user;
    const { name, phone, locality, city, state } = req.body;
    try {
        const updatedUser = await AmazonUser.findByIdAndUpdate(user._id,
            {
                name: name,
                phone: phone,
                address: [{
                    locality: locality,
                    city: city,
                    state: state
                }]
            },
            {
                new: true
            }
        );
        res.send({ user: updatedUser }).status(201);
    } catch (error) {
        res.send(error).status(404);
    }
});

// router.delete("/auth/user/:id", async (req, res) => {
//     try {
//         const _id = req.params.id;
//         const deleteUser = await AmazonUser.findByIdAndDelete({ _id });
//         if (!req.params.id) {
//             return res.status(400).send();
//         }
//         res.send(deleteUser);
//     } catch (error) {
//         res.send(error).status(500);
//     }
// });

module.exports = router;
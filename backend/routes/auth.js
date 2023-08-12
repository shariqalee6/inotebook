const express = require('express')
const User = require('../models/User')
const router = express.Router()
const { body, validationResult } = require('express-validator')


// Create a User using: POST  "/api/createUser/". Doesn't require Auth
router.post("/createUser", [
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be atleast 8 characters').isLength({ min: 8 })

], async (req, res) => {
    try {
        //If there are errors. Return bad request and the errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(401).json({ "error": errors.array() })
        //check whether this user email already exist
        let user = await User.findOne({ email: req.body.email })
        if (user) {
            return res.status(401).json({ "error": 'Sorry a user with this email already exist' })
        }
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        })
        res.json({ "user": user })

    } catch (error) {
        console.log(error)
        res.status(500).send("some error occurred")
    }

})

module.exports = router

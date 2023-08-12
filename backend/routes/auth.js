const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const User = require('../models/User')
const router = express.Router()
const { body, validationResult } = require('express-validator')


// Create a User using: POST  "/api/createUser/". No Login required
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
        const salt = await bcrypt.genSalt(10)
        const secPass = await bcrypt.hash(req.body.password, salt)
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass
        })
        const data = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(data, process.env.SECRET_KEY)
        // res.json({ "user": user })
        res.json({ authToken })


    } catch (error) {
        console.log(error)
        res.status(500).send("Internal server Error")
    }

})

// Create a User using: POST  "/api/login/". No Login required
router.post("/login", [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cannot be empty').exists()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(401).json({ "error": errors.array() })

    const { email, password } = req.body
    try {
        let user = await User.findOne({ email })
        if (!user) return res.status(400).json({ "error": 'Please try to login with correct credentials' })
        const passpwordCompare = await bcrypt.compare(password, user.password)
        if (!(passpwordCompare)) return res.status(400).json({ "error": 'Please try to login with correct credentials' })

        const data = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(data, process.env.SECRET_KEY)
        // res.json({ "user": user })
        res.json({ authToken })

    } catch (error) {
        console.log(error)
        res.status(500).send("Internal server Error")
    }
})

module.exports = router

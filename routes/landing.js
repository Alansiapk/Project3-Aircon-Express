//this router file will contain the routes for
//this landing page, the about us and contact us
const express = require('express');

//create a router object
const router = express.Router();

// a router object can contain routes
router.get("/", (req,res)=>{
    res.send("Welcome");
})

router.get('/about-us', (req,res)=>{
    res.send("About Us");
})

router.get('/contact-us', (req,res)=>{
    res.send("Contact Us");
})

//we export the router so that other files, such as index.js can use it
module.exports = router
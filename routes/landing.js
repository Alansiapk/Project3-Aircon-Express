//this router file will contain the routes for
//this landing page, the about us and contact us
const express = require('express');

//create a router object
const router = express.Router();

// a router object can contain routes
router.get("/", (req,res)=>{
    res.render("landing/welcome");

})

router.get('/about-us', (req,res)=>{
    res.render("landing/about-us");
})

router.get('/contact-us', (req,res)=>{
    res.render("landing/contact-us");
})

//we export the router so that other files, such as index.js can use it
module.exports = router
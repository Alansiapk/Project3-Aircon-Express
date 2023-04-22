const express = require("express");
const router = express.Router();

// import in the CheckIfAuthenticated middleware
const { checkIfAuthenticated } = require('../middlewares');
// import in the User model
const { User } = require('../models');

const { createUserForm, bootstrapField, createLoginForm } = require('../forms');

router.get('/signup', (req,res)=>{
    // display the registration form
    const registerForm = createUserForm();
    res.render('users/signup', {
        'form': registerForm.toHTML(bootstrapField)
    })
})

router.post('/signup', (req, res) => {
    const form = createUserForm();
    form.handle(req, {
        success: async (form) => {
            const user = new User({
                'username': form.data.username,
                'password': form.data.password,
                'email': form.data.email
            });
            await user.save();
            req.flash("success_messages", "User signed up successfully!");
            res.redirect('/users/login')
        },
        'empty': (form) => {
            res.render('users/signup', {
                'form': form.toHTML(bootstrapField)
            })
        },
        'error': (form) => {
            res.render('users/signup', {
                'form': form.toHTML(bootstrapField)
            })
        }
    })
})

router.get('/login', function(req,res){
    const form = createLoginForm();
    res.render('users/login', {
        'form': form.toHTML(bootstrapField)
    })
})

router.post('/login', function(req,res){
    const form = createLoginForm();

    form.handle(req, {
        "success": async function(form) {
            // 1. get the user by email
            const user = await User.where({
                'email': form.data.email
            }).fetch({
                require: false  // if the user is not found, Bookshelf won't throw error
            });

            if (!user) {
                res.status(403); //forbidden
                req.flash('error', "Unable to authenticate your details");
                res.redirect('/users/login');
            } else {
                // 2. check if the password matches
                if (user.get('password') === (form.data.password)) {
                              
                // 3. if the user exists and the password matches, save the user id into the session
                //    (additionally, can save extra info) 
                    req.session.user = {
                        'id': user.get('id'),
                        'email': user.get('email'),
                        'username': user.get('username')
                    }
                    req.flash('success', `Welcome back ${user.get('username')}`);
                    res.redirect('/users/profile');

                } else {
                    req.flash('error', 'Unable to authenticate your details');
                    res.redirect('/users/login');
                }
            }

 
        },
        "empty": async function(form) {
            res.render('users/login',{
                form: form.toHTML(bootstrapField)
            })
        },
        "error": async function(form) {
            res.render('users/login',{
                form: form.toHTML(bootstrapField)
            })
        }
    })
   
});

router.get('/profile', [checkIfAuthenticated], (req, res) => {
    const user = req.session.user;
    if (!user) {
        req.flash('error_messages', 'You do not have permission to view this page');
        res.redirect('/users/login');
    } else {
        res.render('users/profile',{
            'user': user
        })
    }

})

router.get('/logout', (req, res) => {
    req.session.user = null;
    req.flash('success_messages', "Goodbye");
    res.redirect('/users/login');
})

module.exports = router;


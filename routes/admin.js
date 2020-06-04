const express = require('express');
const router = express.Router();
const Datastore = require('nedb');
const createError = require('http-errors');
const path = require('path');
const bcrypt = require('bcrypt');
const saltRounds = 10;
let users = new Datastore({filename: path.join(__dirname, '../data/users.db'), autoload: true });
const postsRouter = require('../routes/posts');
let posts = postsRouter.db;


bcrypt.hash("admin", saltRounds, function(err, hash) {
    users.persistence.compactDatafile();
    users.update(
        {  _id: '__admin__' },
        { $set: {
                login: "admin",
                password: hash
            }},
        { upsert: true, returnUpdatedDocs: true },
        ()=>{});
});

router.get('/', function(req, res, next) {
    if (false && !req.session.user)
    {
        res.redirect('/admin/login');
    }
    else
    {
       posts.find({ $not: { _id: '__autoid__' } }, (err, docs)=>{
           if (err) {
               console.log(err);
               createError(500);
           }
            else {
               res.render('admin', { title: 'Admin', posts: docs});
           }

        });

    }

});

router.get('/login', function(req, res, next) {
    console.log('login get');
    if (req.session.user)
    {
        res.redirect('/admin');
    }
    else
    {
        let obj = { title: 'Admin', error: false, layout: false};

        if (req.session.valid === false) {
            obj.error = true;
            req.session.valid = null;
        }

        res.render('login', obj);
    }

});
router.get('/exit', function(req, res, next) {
    req.session.user = null;
    res.redirect('/admin/login');
});

router.post('/login', function(req, res, next) {
    console.log('login post');
    if (req.session.user)
    {
        console.log('5');
        res.redirect('/admin');
    }
    users.findOne({login: req.body.login}, (e, user)=> {
        console.log(user);
        console.log(req.body.login);
        console.log(req.body.password);
        if (e) {
            console.log(e);
            createError(500);
        } else if (!user) {

            req.session.valid = false;
            console.log('1');
            res.redirect('/admin/login');
        }
        else{

            bcrypt.compare(req.body.password, user.password, function(err, result) {

                if (result)
                {
                    req.session.user = user._id;
                   // req.session.valid = null;
                    console.log('2');
                    res.redirect('/admin');
                }
                else
                {
                    req.session.valid = false;
                    console.log('3');
                    res.redirect('/admin/login');
                }
            });

        }
    });

});


module.exports = router;

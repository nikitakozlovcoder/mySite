const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const multer  = require('multer');
const crypto = require("crypto")
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, crypto.randomBytes(5).toString('hex')+"_"+Date.now() + '.'+file.mimetype.split('/')[1]);
    }
});
const upload = multer({ storage: storage });

function read_posts_file(callback)
{
    fs.readFile(path.join(__dirname, '../data/posts.json'), (err, data)=>{
        if(err) {
            console.log(err);
            res.status(500).send();
        }
        else {
            callback(JSON.parse(data));
        }
    });
}
router.get('/all', function(req, res, next) {

       res.sendFile(path.join(__dirname, '../data/posts.json'));
});

router.get('/:id', function(req, res, next) {

    read_posts_file((data)=>{
        let f=false;

        data.forEach((el)=>{
            console.log(el);
            if(el.id === Number(req.params.id)) {
                f=true;
                res.json(el);

            }
        });
        if (!f) {
            res.status(404).send();
        }
    });

});
router.post('/new', upload.single('thumbnail'), function(req, res, next) {

    let post = {};
    let id=1;
    read_posts_file((data)=>{
        if (data.length > 0)
        {
           id = data[data.length-1].id+1;
        }
        post.id = id;
        post.title = req.body.title;
        post.description = req.body.description;
        post.text = req.body.text;
        data.push(post);
        console.log(req.file);
        fs.writeFile(path.join(__dirname, '../data/posts.json'), JSON.stringify(data), (err, data)=>{
            if (err) {
                console.log(err);
                res.status(500).send();
            }
            else {
                res.status(201).send();
            }
        });
    });
    post.thumbnail = req.file.filename;



});
module.exports = router;

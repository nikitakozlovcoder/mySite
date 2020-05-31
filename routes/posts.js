const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const multer  = require('multer');
const crypto = require("crypto");
const sharp = require('sharp');
const Datastore = require('nedb')
let posts = new Datastore(path.join(__dirname, '../data/posts.db'));
posts.loadDatabase();

posts.getAutoincrementId = function () {
    let ctx = this;
    return new Promise((resolve, reject)=>{
        ctx.update(
            { _id: '__autoid__' },
            { $inc: { seq: 1 } },
            { upsert: true, returnUpdatedDocs: true },
            function (err, affected, autoid) {
               if (err) {
                   reject(err);
               }
                resolve(autoid.seq);
            }
        );
    });


};


getAutoId = function() {

};
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/uploads'));
    },
    filename: function (req, file, cb) {
        cb(null, crypto.randomBytes(5).toString('hex')+"_"+Date.now() + '.'+file.mimetype.split('/')[1]);
    }
});
const upload = multer({ storage: storage });


router.get('/all', function(req, res, next) {

       posts.find({ $not: { _id: '__autoid__' } }, (err, docs)=>{

            res.json(docs);
       });
});

router.get('/:id', function(req, res, next) {

    posts.findOne({id: Number(req.params.id)}, (err, post)=>{
        res.json(post);
    });

});
router.post('/new', upload.single('thumbnail'), async function(req, res, next) {
    let insert = function(post) {
        return new Promise((resolve, reject)=>{
            posts.insert(post, (err, doc)=>{
                if (err) reject(err);
                resolve(doc);
            });
        })};
    let post = {};
    post.title = req.body.title;
    post.description = req.body.description;
    post.text = req.body.text;
    post.thumbnail = req.file.filename;
    post.id = await posts.getAutoincrementId();


    let path_from = path.join(__dirname, '../public/uploads/', req.file.filename);
    let path_to = path.join(__dirname, '../public/uploads/small/', req.file.filename);
    try {
        let sh = sharp(path_from)
        .resize(400, 200, {fit: sharp.fit.inside })
        .toFile(path_to);

        let ins = insert(post);
        await sh;
        await ins;
        res.status(201).send();
    }
    catch (e) {
        console.log(e);
        res.status(500).send();
    }

});

router.delete('/:id', (req, res)=>{

    posts.findOne({id: Number(req.params.id)}, (e, post)=>{
        if (e) {
            console.log(err);
            res.status(500).send();
        }
        else {
            posts.remove({id: Number(req.params.id)}, {}, function (err, numRemoved) {
                if (err){
                    console.log(err);
                    res.status(500).send();
                }
                else{
                    let path_full = path.join(__dirname, '../public/uploads/'+post.thumbnail);
                    let path_small = path.join(__dirname, '../public/uploads/small/'+post.thumbnail);
                    fs.unlink(path_full, ()=>{});
                    fs.unlink(path_small, ()=>{});
                    res.status(200).send();
                }
            });
        }

    })

});

module.exports = router;

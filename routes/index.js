const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const createError = require('http-errors');
const postsRouter = require('../routes/posts');
let posts = postsRouter.db;
/* GET home page. */
router.get('/', function(req, res, next) {
  posts.find({ $not: { _id: '__autoid__' } }, (err, docs)=>{
    if (err) {
      console.log(err);
      createError(500);
    }
    else {
      res.render('index', { title: 'NekWeb', posts: docs, layout: false });
    }
  });
});

router.post('/sendmail', function(req, res, next) {
  console.log(req.rawBody.toString());
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'nekwebmailer@gmail.com',
      pass: 'nekwebmailernekweb'
    }
  });
  const mailOptions = {
    from: 'nekwebmailer@gmail.com',
    to: 'nikitakoz2606@gmail.com',
    subject: 'From site',
    text: "Имя: " + req.body.name + "\nАдрес: " + req.body.mail +"\nСообщение: "+req.body.message
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
      res.status(500).send();
    } else {
      console.log('Email sent: ' + info.response);
      res.status(200).send();
    }
  });


});

module.exports = router;

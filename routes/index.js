var express = require('express');
var router = express.Router();
const nodemailer = require('nodemailer');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/sendmail', function(req, res, next) {
  console.log(req.rawBody.toString());
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'nekwebmailer@gmail.com',
      pass: 'nekwebmailernekweb' // naturally, replace both with your real credentials or an application-specific password
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

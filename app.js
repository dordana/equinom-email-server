var express = require('express'),
  path = require('path'),
  nodeMailer = require('nodemailer'),
  bodyParser = require('body-parser')

var app = express()
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
var port = 3000

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.post('/send-email-props', function (req, res) {
  const transporter = nodeMailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'equinomcrop@gmail.com',
      pass: 'Crop2018!'
    }
  })
  const mailOptions = {
    from: 'Equinom - Product Profiler',
    to: 'equinomcrop@gmail.com, marketing@equi-nom.com',
    subject: 'User selections - Product Profiler',
    html: `<div style="border: solid;font-family: sans-serif; padding: 10px 30px;  text-align: left;">
    <img src="http://equi-nom.com/wp-content/uploads/2019/03/equinom_logo_final_RGB.png" style="width: 200px; margin: 0 auto;    height: 200px;display: block;" alt="">
    <h1 style="text-align: center;">User selections</h1>
    <p>First name: ${req.body.firstName} </p>
    <p>Last name: ${req.body.lastName}   </p>
    <p>Company: ${req.body.company}  </p>
    <p>Position: ${req.body.position}  </p>
    <p>Email address: ${req.body.emailAddress}  </p>
    <p>Phone number: ${req.body.phoneNumber}  </p>
  <p style="font-weight: bold;text-decoration: underline;">The user chose ${req.body.crop} and these GIDs</p>`
  }
  mailOptions.html += '<ul>'
  if (req.body.selectedProps.length > 0) {
    req.body.selectedProps.forEach(elm => {
      mailOptions.html += `<li><b>${elm.GID}</b>:`
      mailOptions.html += '<ul>'
      elm.data.forEach(row => {
        mailOptions.html += `<li>${row.traitName}: ${row.value}</li>`
      });
      mailOptions.html += '</ul><br>'
      mailOptions.html += '</li>'
    })
  }
  mailOptions.html += '</ul></div>'
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error)
    }
    console.log('Message %s sent: %s', info.messageId, info.response)
    res.end("sent");
    return
  })
})

app.post('/send-email', function(req, res) {
  const transporter = nodeMailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'equinomcrop@gmail.com',
      pass: 'Crop2018!'
    }
  })
  const mailOptions = {
    from: 'Equinom - Product Profiler',
    to: 'equinomcrop@gmail.com, marketing@equi-nom.com',
    subject: 'New client - Product Profiler',
    html: `<div style="border: solid;font-family: sans-serif; padding: 10px 30px;  text-align: left;">
    <img src="http://equi-nom.com/wp-content/uploads/2019/03/equinom_logo_final_RGB.png" style="width: 200px; margin: 0 auto;    height: 200px;display: block;" alt="">
    <h1 style="text-align: center;">New client message</h1>
    <p>First name: ${req.body.firstName} </p>
    <p>Last name: ${req.body.lastName}   </p>
    <p>Company: ${req.body.company}  </p>
    <p>Position: ${req.body.position}  </p>
    <p>Email address: ${req.body.emailAddress}  </p>
    <p>Phone number: ${req.body.phoneNumber}  </p>
  <p style="font-weight: bold;text-decoration: underline;">The user chose ${req.body.crop} and these traits</p>`
  }
  mailOptions.html += '<ul>'
  if (req.body.selectedProps.length > 0) {
    req.body.selectedProps.forEach(elm => {
      mailOptions.html += `<li> ${elm.propName}: ${elm.value[0]} - ${elm.value[1]}</li>`
    })
  }
  mailOptions.html += '</ul></div>'
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error)
    }
    console.log('Message %s sent: %s', info.messageId, info.response)
    res.end("sent");
    return
  })
})
app.listen(port, function() {
  console.log('Server is running at port: ', port)
})

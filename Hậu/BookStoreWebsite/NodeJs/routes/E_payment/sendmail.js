const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
router.post('/send', function(req, res) {

    var output = `
      <p>You was buy book </p>
      <h3>Your Info</h3>
      <ul>  
        <li>Name : ${req.body.name}</li>
        <li>Email : ${req.body.email}</li>
        <li>Address : ${req.body.address}</li>
        <li>Phone : ${req.body.phone}</li>

        </ul>  
         <h3>List Book You Was Buy</h3>
      
   
    `;
    var dem_i = 0;
    var dem_j = 0;
    var dem_k = 0;
    var dem_l = 0;
    for (let i of(req.body.nameBook).split("next")) {
        var dem_j = 0;
        for (let j of(req.body.imgBook).split("next")) {
            var dem_k = 0;
            for (let k of(req.body.count).split("next")) {
                var dem_l = 0;
                for (let l of(req.body.price).split("next")) {
                    if (dem_i == dem_j && dem_i == dem_k && dem_i == dem_l) {
                        if (i != "") {
                            output = output + `
               <div style="width:900px;height:150px;">
               <img src="${j}" style="float:left;width:75px;height:125px;">
               <div style="float:left;margin-left:10px;margin-top:-10px;">
               <h3 >Name Of Book:${i}</h3>
               <h3 >Price:${l}</h3> 
               <h3 >Count:${k}</h3>

                </div>
                </div>
              `;

                        }
                    }
                    dem_l = dem_l + 1;
                }
                dem_k = dem_k + 1;
            }
            dem_j = dem_j + 1;
        }
        dem_i = dem_i + 1;
    }

    const output2 = `

   <h1>Total : ${req.body.totalPrice}</h1>
   <h1>Order date : ${req.body.orderDate}</h1>
  `;

    // create reusable transporter object using the default SMTP transport
    var transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,

        // true for 465, false for other ports
        auth: {
            user: 'nguyenduchau210998@gmail.com', // generated ethereal user
            pass: 'ham26062015' // generated ethereal password
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    // setup email data with unicode symbols
    var mailOptions = {
        from: 'nguyenduchau210998mail.com', // sender address
        to: req.body.email, // list of receivers
        subject: 'Node Contact Request', // Subject line
        text: 'Hello world?', // plain text body
        html: output + output2 // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            res.json('Please check your email');
        } else {
            console.log('Message sent: %s', info.messageId);
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
            res.json('Email has been sent--Buy Success');
        }
    });
});
module.exports = router;
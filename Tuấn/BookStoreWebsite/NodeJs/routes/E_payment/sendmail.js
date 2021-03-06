const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
//Send mail Cash
router.post('/', function(req, res) {
    var output = `
    <head>
    <style>
        table {
         font-family: arial, sans-serif;
          border-collapse: collapse;
         width: 100%;
        }
  
          td, th {
           border: 1px solid #dddddd;
            text-align: left;
                   padding: 8px;
              }
  
        tr:nth-child(even) {
             background-color: #dddddd;
                    }
            </style>
            </head>
      <body>
    
      <h3>THÔNG TIN ĐƠN HÀNG BOOKSTORE</h3>
      <ul>  
        <li>Người Đặt Hàng : ${req.body.name}</li>
        <li>Email : ${req.body.email}</li>
        <li>Địa Chỉ Giao Hàng : ${req.body.address}</li>
        <li>Số Điện Thoại : ${req.body.phone}</li>        
      </ul>
      <h3></h3>
      <table>
      <thead>
                                 <tr>
                                   <th>Bìa sách</th>
                                   <th>Sách</th>
                                   <th>Số Lượng</th>
                                   <th>Đơn Giá</th>
                                   <th>Tổng Giá</th>
                                 </tr>
                               </thead>
                               <tbody>
      `;
    var dem_i = 0;
    var dem_j = 0;
    var dem_k = 0;
    var dem_l = 0;
    for (let i of(req.body.imgBook).split("next")) {
        dem_j = 0;
        for (let j of(req.body.nameBook).split("next")) {
            dem_k = 0;
            for (let k of(req.body.count).split("next")) {
                dem_l = 0;
                for (let l of(req.body.price).split("next")) {
                    if (dem_i == dem_j && dem_i == dem_k && dem_i == dem_l) {
                        if (i != "") {
                            output = output + `
                            <tr>
                            <td><img src = "${i}" style = "width: 70px;text-align: center;"/></td>
                            <td>${j}</td>
                            <td>${k}</td>
                            <td>${l}VND</td>
                            <td>${k * l}VND</td>
                            </tr>
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
    var paymentOption = "";
    if (req.body.paymentOption == "Online") {
        paymentOption = "Đã Thanh Toán"
    } else {
        paymentOption = "Chưa Thanh Toán"
    }
    output = output + `</tbody>
  </table>
  <h3>Tổng Hóa Đơn : ${req.body.totalPrice}VND</h3>
  <h3>Ngày Đặt Đơn Hàng : ${req.body.orderDate}</h3>
  <h2>Đơn Hàng ${paymentOption}</h2>
  </body> `;


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
        html: output // html body
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
//send mail PayPal
router.post('/PayPal', function(req, res) {
    var output = `
    <head>
    <style>
        table {
         font-family: arial, sans-serif;
          border-collapse: collapse;
         width: 100%;
        }
  
          td, th {
           border: 1px solid #dddddd;
            text-align: left;
                   padding: 8px;
              }
  
        tr:nth-child(even) {
             background-color: #dddddd;
                    }
            </style>
            </head>
      <body>
    
      <h3>INFORMATION ORDER BOOKSTORE</h3>
      <ul>  
        <li>Customer Name : ${req.body.name}</li>
        <li>Email : ${req.body.email}</li>
        <li>Order Address : ${req.body.address}</li>
        <li>Phone : ${req.body.phone}</li>        
      </ul>
      <h3></h3>
      <table>
      <thead>
                                 <tr>
                                   <th>Img Book</th>
                                   <th>Name Book</th>
                                   <th>Quantity</th>
                                   <th>Price</th>
                                   <th>Sub Total</th>
                                 </tr>
                               </thead>
                               <tbody>
      `;
    var dem_i = 0;
    var dem_j = 0;
    var dem_k = 0;
    var dem_l = 0;
    for (let i of(req.body.imgBook).split("next")) {
        dem_j = 0;
        for (let j of(req.body.nameBook).split("next")) {
            dem_k = 0;
            for (let k of(req.body.count).split("next")) {
                dem_l = 0;
                for (let l of(req.body.price).split("next")) {
                    if (dem_i == dem_j && dem_i == dem_k && dem_i == dem_l) {
                        if (i != "") {
                            output = output + `
                            <tr>
                            <td><img src = "${i}" style = "width: 70px;text-align: center;"/></td>
                            <td>${j}</td>
                            <td>${k}</td>
                            <td>$${l}</td>
                            <td>$${k * l}</td>
                            </tr>
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
    var paymentOption = "";
    if (req.body.paymentOption == "Online") {
        paymentOption = "The Order Has Been Paid"
    } else {
        paymentOption = "Unpaid Order"
    }
    output = output + `</tbody>
  </table>
  <h3>Order Total: $${req.body.totalPrice}</h3>
  <h3>Order Date: ${req.body.orderDate}</h3>
  <h2>${paymentOption}</h2>
  </body> `;


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
        html: output // html body
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
router.post('/check', function(req, res) {
    emailExistence.check(req.body.email, function(error, response) {
        console.log('res: ' + response);
    });
});

module.exports = router;
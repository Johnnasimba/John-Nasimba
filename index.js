const express =  require('express');
const bodyParser = require('body-parser');
const path =  require('path');
const nodemailer = require('nodemailer');
const morgan = require('morgan');
require('dotenv').config()

const app = express();




// Body parser middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


app.use(morgan('combined'));

app.use(express.json());
app.use(express.static(path.join(__dirname, 'client', 'build')))

app.use((req, res, next) => {
    res.header({"Access-Control-Allow-Origin": "*"});
    next();
  }) 
  if(process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
}

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'build','index.html'))
})



app.post('/send', (req, res) => {
    const output = `
    <p>You have a new contact request</p>
    <ul>
        <li>Name: ${req.body.name}</li>
        <li>company: ${req.body.company}</li>
        <li>email: ${req.body.email}</li>
        <li>Phone Number: ${req.body.phone}</li>
    </ul>
    <H3>Message</H3>
    <p> ${req.body.message}</p>       
    
    `;
    async function main() {
        
        let transporter = nodemailer.createTransport({
            host: "smtp.office365.com", //outlook.office365.com
            secureConnection: false, // TLS requires secureConnection to be false
            port: 587,
            secure: false, // true for 465, false for other ports
            tls: {
               ciphers:'SSLv3'
            },
            auth: {
                user: 'nasimba4john@outlook.com', // generated ethereal user
                pass: process.env.PASSWORD, // generated ethereal password
            },
        });
        
        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: '"Nodemailer contact form" <nasimba4john@outlook.com>', // sender address
            to: "nasimba4john@gmail.com", // list of receivers
            subject: "TESTING SENDING EMAILS USING NODEMAILER", // Subject line
            text: "Hello world?", // plain text body
            html: output, // html body
        });
        
        console.log("Message sent: %s", info.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        res.render('contact', {msg: 'Message sent'})
    }
    main().catch(console.error);
})



const PORT=process.env.PORT||8000;

app.listen(PORT, () => {
    console.log("server running on port "+ PORT);
})
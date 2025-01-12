const nodemailer=require("nodemailer");
const asynchandler=require('express-async-handler');
class EmailController{

    static  sendEmail=asynchandler(async(data,req,res)=>{

       let transporter=nodemailer.createTransport({
        service: "gmail",
        host:'smtp.gmail.com',
        port: 587, //true for 465 ,false for otther ports
        secure :false,
        auth:{
            user:process.env.MAIL_ID,
            pass:process.env.MP
        }
       
       });

       let info=await transporter.sendMail({
        from:{
            name:"Shop Express",
            address:process.env.MAIL_ID},//snder address
        to: data.to,
        subject: data.subject,
        text:data.text,
        html:data.html
       })
    });
}

module.exports=EmailController;
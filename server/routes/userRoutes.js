import express from 'express';
import bcrypt from 'bcryptjs'
import User from '../models/userModel.js';
import dotenv from 'dotenv'
import { generateToken, isAdmin, isAuth } from '../utils.js';
import expressAsyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
dotenv.config();
const userRouter = express.Router();
const transporter = nodemailer.createTransport({
    service: 'gmail',
    // host: 'kcaligam@ccc.edu.ph',
    auth: {
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS,
    }
})
const generateVerificationToken = (email) => {
    return jwt.sign({email}, process.env.JWT_SECRET, {expiresIn: '1h'});
}
userRouter.get(
    '/verify-email',
    expressAsyncHandler(async(req, res) => {
        const  token  = req.query.token;
        console.log('Received Token:', token);

        if (!token) {
            return res.status(400).json({message:"No tokenn"});
        }
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findOne({email: decoded.email});
            if (!user) {
                return res.status(400).json({message: 'Invalid token or user not found'});
            }
            if (user.isVerified) {
                return res.status(400).json({message: 'User already verified'});

            }
            user.isVerified = true;
            //user.verificationToken = null;
            await user.save();
            const htmlContent = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Email Verified</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f9;
                        margin: 0;
                        padding: 0;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                    }
                    .container {
                        background-color: white;
                        padding: 30px;
                        border-radius: 10px;
                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                        text-align: center;
                        max-width: 400px;
                        width: 100%;
                    }
                    .container h1 {
                        color: #4CAF50;
                        font-size: 24px;
                    }
                    .container p {
                        color: #333;
                        font-size: 16px;
                    }
                    .button {
                        background-color: #4CAF50;
                        color: white;
                        padding: 10px 20px;
                        text-decoration: none;
                        border-radius: 5px;
                        display: inline-block;
                        margin-top: 20px;
                    }
                    .button:hover {
                        background-color: #45a049;
                    }
                </style>
            </head>
            <body>

                <div class="container">
                    <h1>Email Verified</h1>
                    <p>Your email has been successfully verified!</p>
                    <a href="http://localhost:3000/signin" class="button">Sign in</a>
                </div>

            </body>
            </html>

            `;
            res.status(200).send(htmlContent);
            //res.json({message: 'Email verified successfully'});
            //res.json({verified: true});
            // res.status(200).json({
            //     message:'',
            //     user: {
            //         _id: user.id,
            //         name: user.naame,
            //         lastname: user.lastname,
            //         email: user.email,
            //         isAdmin:user.isAdmin,
            //         token: generateToken(user),

            //     },

            // })
           // return res.status(200).json({message: 'Email verified successfully! you can now log in.'});
        }catch (error) {
            return res.status(400).json({message: 'Invalid or expired token.'})
        }
    }))

    userRouter.post('/forgot-password', expressAsyncHandler(async (req, res) => {
        const { email } = req.body;
        const user = await User.findOne({ email });
    
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
    
        // Generate reset token
        const resetToken = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
        // Create password reset URL
        const resetUrl = `http://localhost:3000/reset-password?token=${resetToken}`;
    
        // Email content
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Password Reset',
            html: `
              <h2>Password Reset Request</h2>
              <p>Click the link below to reset your password:</p>
              <a href="${resetUrl}">Reset Password</a>
            `
        };
    
        // Send email
        await transporter.sendMail(mailOptions);
    
        res.status(200).json({ message: 'Password reset email sent!' });
    }));
    userRouter.post('/reset-password', expressAsyncHandler(async (req, res) => {
        const { token, password } = req.body;
    
        // Verify the token
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findOne({ email: decoded.email });
    
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
    
            // Hash the new password
            user.password = bcrypt.hashSync(password, 8);
    
            // Save the updated user
            await user.save();
    
            res.status(200).json({ message: 'Password updated successfully!' });
        } catch (error) {
            res.status(400).json({ message: 'Invalid or expired token' });
        }
    }));
    
    userRouter.get('/check-verification-status', async(req,res) => {
        const {email} = req.query;
        try {
            const user = await User.findOne({email});
            if (!user) {
                return res.status(404).send('User not found')
            }
            if (user.isVerified) {
                return res.json({isVerified:true})
            }
             res.json({isVerified:false})
        }catch (error) {
            res.status(500).send('Internaal server error');
        }
    })
userRouter.get(
    '/',
    isAuth,
    expressAsyncHandler(async(req,res) => {
        const users = await User.find({});
        res.send(users);
    })
)

userRouter.get(
    '/:id',
    isAuth,
    expressAsyncHandler(async(req, res) => {
        const user = await User.findById(req.params.id);
        if (user){
            res.send(user);
        }
        else {
            res.status(404).send({message: 'USER DO NOT EXIST. ERROR 404'});
        }
    })
);

userRouter.put(
    '/:id',
    isAuth,
    expressAsyncHandler(async (req, res) => {
        const user = await User.findById(req.params.id);
        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            user.isAdmin = Boolean(req.body.isAdmin);
            const updatedUser = await user.save();
            res.send({ message: 'USER INFO IS UPDATED', user: updatedUser });
        }
        else {
            res.status(404).send({ message: 'USER DO NOT EXIST. ERROR 404' })
        }
    })
);


userRouter.delete(
    '/:id',
    isAuth,
    expressAsyncHandler(async (req, res) => {
        const user = await User.findById(req.params.id);
        if (user && !user.isAdmin) {
            await user.deleteOne();
            res.send({ message: 'Account Has Been Deleted'});
        } else if (user && user.isAdmin) {
            res.status(403).send({ message: 'Admin Account Cannot Be Deleted'});
        } 
        else {
            res.status(404).send({ message: 'USER DO NOT EXIST. ERROR 404' });
        }
        
    })
);

userRouter.post(
    '/signin', 
    expressAsyncHandler(async(req, res)=> {
        const user = await User.findOne({email: req.body.email});
        if (user) {
            if (!user.isVerified) {
                res.status(401).send({message: 'Please verify your email before sign in.'})
            }
            if (bcrypt.compareSync(req.body.password, user.password)){
                res.send({
                    _id: user._id,
                    name: user.name,
                    lastname: user.lastname,
                    email: user.email,
                    password: user.password,
                    isAdmin: user.isAdmin,
                    isRider: user.isRider,
                    token: generateToken(user),
                });
                return;
            } 
        }
        res.status(401).send({message: 'Invalid Input. Error 401'})
    }) 
)

userRouter.post(
    '/signup',
    expressAsyncHandler(async (req, res) => {

        const existingUser = await User.findOne({email: req.body.email})
        if (existingUser) {
            return res.status(400).json({message: 'User already exists'});
        }
        const hashedPassword = bcrypt.hashSync(req.body.password, 8);
        const verificationToken = generateVerificationToken(req.body.email);
        const newUser = new User({
            name: req.body.name,
            middlename: req.body.middlename,
            lastname: req.body.lastname,
            suffix: req.body.suffix,
            email: req.body.email,
            password: hashedPassword,
            isAdmin: req.body.isAdmin || false,
            isCustomer: req.body.isCustomer || false,
            isVerified: false,
            verificationToken: verificationToken,
        })
        const user = await newUser.save();
        const verificationUrl = `http://localhost:5000/api/users/verify-email?token=${verificationToken}`;
        const mailOptions = {
            from: `"RYB Officials"<${process.env.EMAIL_USER}>`,
            to: user.email,
            subject:'Email Verification',
            html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 0;
                    background-color: #979797;
                }
                .container {
                    max-width: 600px;
                    margin: 20px auto;
                    background: #fff;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                    text-align: center; /* Center all text */
                }
                .header img {
                    max-width: 150px; /* Adjust logo size */
                }
                h1 {
                    font-size: 24px;
                    margin: 10px 0;
                }
                h3 {
                    font-size: 20px;
                    margin: 20px 0 10px;
                }
                p {
                    font-size: 16px;
                    margin: 0 0 20px;
                }
                .button {
                    display: inline-block;
                    background-color: #ff0000; /* Red color */
                    color: white;
                    padding: 10px 20px;
                    text-decoration: none;
                    border-radius: 5px;
                    text-align: center;
                    font-size: 16px;
                    margin-bottom: 20px; /* Space below button */
                }
                .social-icons {
                    margin: 10px 0;
                }
                .social-icons img {
                    width: 24px; /* Size for icons */
                    margin: 0 5px; /* Space between icons */
                }
                .footer {
                    font-size: 12px;
                    color: #888;
                    margin-top: 20px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <img src="https://res.cloudinary.com/dkmfsx77a/image/upload/f_auto,q_auto/eywtbaz7t59z8yjrau7f" alt="RYB Logo"> <!-- Replace with your logo URL -->
                    <h1>RYB Sportswear and Tailoring</h1>
                </div>
                <h3>VERIFY YOUR EMAIL ADDRESS</h3>
                <p>Please confirm that you want to use this as your online account for RYB. Once it's done, you will be able to start purchasing.</p>
                <a href="${verificationUrl}" class="button">Confirm Email</a>
                <div class="social-icons">
                    <a href="https://mail.google.com/mail/?view=cm&fs=1&to=busalovelyn@gmail.com" target="_blank"><img src="https://res.cloudinary.com/dkmfsx77a/image/upload/f_auto,q_auto/x2pjviwd8by44xbbiqen" alt="Gmail"></a> <!-- Replace with Gmail icon URL -->
                    <a href="https://www.facebook.com/jerseysacalamba" target="_blank"><img src="https://res.cloudinary.com/dkmfsx77a/image/upload/f_auto,q_auto/y7qneelissrmlvf9gzdm" alt="Facebook"></a> <!-- Replace with Facebook icon URL -->
                </div>
                <div class="footer">
                    <p>86 Burgos St. Brg. 6, Calamba, Philippines</p>
                </div>
            </div>
        </body>
        </html>
    `
        };
        await transporter.sendMail(mailOptions);
        res.status(200).json({
            message:'Registration successful! Please check your email to verify your account.',
        })
        // res.send({
        //     _id: user._id,
        //     name: user.name,
        //     lastname: user.lastname,
        //     email: user.email,
        //     password: user.password,
        //     isAdmin: user.isAdmin,
        //     token: generateToken(user),
        // });
    })
)

userRouter.put(
    '/profile',
    isAuth,
    expressAsyncHandler(async (req, res) =>{
        const user = await User.findById(req.user._id);
        if (user){
            user.name = req.body.name || user.name;
            user.lastname = req.body.lastname || user.lastname;
            user.email = req.body.email || user.email;
            if(req.body.password){
                user.password = bcrypt.hashSync(req.body.password, 8);
            }

            const updatedUser = await user.save();
            res.send({
                _id: updatedUser._id,
                name: updatedUser.name,
                lastname: updatedUser.lastname,
                email: updatedUser.email,
                isAdmin: updatedUser.isAdmin,
                token: generateToken(updatedUser)
            });
        }

        else {
            res.status(404).send({message: 'USER DO NOT EXIST. ERROR 404'})
        }

    })
)
export default userRouter;

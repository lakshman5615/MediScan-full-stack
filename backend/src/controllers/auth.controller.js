const bcrypt = require('bcrypt');
const UserModel = require('../models/User');
const jwt = require('jsonwebtoken');

//  SIGNUP/ REGISTER
const signup = async (req, resp) => {

    try {
        const { name, email, password, phone, age, fcmToken } = req.body;
        const user = await UserModel.findOne({ email });

        if (user) return resp.status(400).json({ message: "User already exists , you can login ", success: false });


        const hashedPassword = await bcrypt.hash(password, 10);
        const userModel = new UserModel({ name, email, password: hashedPassword, phone, age, fcmToken });

        await userModel.save();
        
        // Send welcome notification
        if (fcmToken) {
            const FCMService = require('../services/fcm.service');
            await FCMService.sendToToken(
                fcmToken,
                '🎉 Welcome to MediScan!',
                `Hi ${name}! Aapka account successfully create ho gaya hai. Medicine reminders ke liye ready rahiye!`
            );
        }
        
        resp.status(201).json({ message: "User created successfully", success: true })

    }
    catch (error) {
        // console.log("Signup error", error);
        resp.status(500).json({ message: "Internal server error", error, success: false })
    }
}


// +++++++++++++++++++++++++++++++++++++++++++++++
//  LOGIN 


const login = async (req, resp) => {

    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });
        const errormsg = "Authentication failed email or password is  wrong "

        if (!user) return resp.status(403).json({ message: errormsg, success: false });

        const isPasswordEqual = await bcrypt.compare(password, user.password);

        if (!isPasswordEqual) {
            return resp.status(403).json({ message: errormsg, success: false });
        }

        const jwtToken = jwt.sign(
            { email: user.email, _id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        )
        resp.status(200)
            .json({
                message: " Login successfully",
                success: true,
                jwtToken,
                email,
                name: user.name
            })
    }
    catch (error) {
        // console.log("Signup error", error);
        resp.status(500).json({ message: "Internal server error", error, success: false })
    }
}

module.exports = { signup, login }
const User = require('../models/User');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');

module.exports = {
    //[POST] /register
    async register(req, res, next) {
        const { username, password } = req.body;

        //simple validation
        if (!username || !password) {
            return res
                .status(400)
                .json({ success: false, message: 'Missing username or password' })
        }

        try {
            //check if the username is already exist
            const user = await User.findOne({ username });
            if(user)
            return res
                .status(400)
                .json({ success: false, message: 'Username already registered' })

            const hashedPassword = await argon2.hash(password);
            const newUser = new User({ username, password: hashedPassword });
            await newUser.save();

            //return token
            const accessToken = jwt.sign({ userId: newUser._id }, process.env.ACCESS_TOKEN_SECRET);
            res.json({ success: true, message: 'User created successfully', accessToken });
        } catch (error) {
            console.log(error);
            res.status(500).json({success: false, message: 'Internal server error'})
        }
    },

    //[POST] /login
    async login (req, res) {
        const { username, password } = req.body;

        //simple validation
        if (!username || !password) {
            return res
                .status(400)
                .json({ success: false, message: 'Missing username and/or password' })                        
        }

        try {
            //check if user already exists
            const user = await User.findOne({ username});
            if(!user) 
            return res.status(400).json({success: false, message: 'Incorrect username or password'})

            const passwordValid = await argon2.verify(user.password, password);
            if (!passwordValid) 
            return res.status(400).json({success: false, message: 'Incorrect username or password'})                            

            // return token
            const accessToken = jwt.sign(
                { userId: user.id },
                process.env.ACCESS_TOKEN_SECRET
            )

            res.json({success: true, message: 'User logged in successfully', accessToken});
        } catch (error) {
            console.log(error);
            res.status(500).json({success: false, message: 'Internal server error'})
        }
    }
}
import User from "../models/user.model.js";
import bcrypt from 'bcryptjs';
import generateTokenAndSetCookie from "../utils/generateToken.js";

export const signupUser = async (req, res) => {
    try {
        const { fullName, username, password, confirmPassword, gender } = req.body;

        // console.log(req.body)


        if (!fullName || !username || !password || !confirmPassword || !gender) {
            return res.status(400).json({ error: "All fields are required!" });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ error: "Passwords don't match!" });
        }

        // Finding user by username
        const existingUser = await User.findOne({ username });

        if (existingUser) {
            return res.status(400).json({ error: "User with this username already exists!" });
        }

        // Hash Password for security purposes
        const hashedPassword = await bcrypt.hash(password, 10);

        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

        // User create
        const newUser = new User({
            fullName,
            username,
            password: hashedPassword,
            gender,
            profilePic: gender === "male" ? boyProfilePic : girlProfilePic
        });

        if (newUser) {
            //Generate JWT Token here 
            //For creating a secret key open terminal and from options click git bash and then write this command "openssl rand -base64 32" It will generate a secret key
            generateTokenAndSetCookie(newUser._id, res);

            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                username: newUser.username,
                profilePic: newUser.profilePic
            })
        } else {
            res.status(400).json({
                error: "Invalid user data!"
            })
        }

    } catch (error) {
        console.log("Error occurs in signup controller", error.message);
        res.status(500).json({ error: "Internal Server Error!" });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");

        if (!user || !isPasswordCorrect) {
            return res.status(400).json({ error: "Invalid username or password!" });
        }

        generateTokenAndSetCookie(user._id, res);

        return res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            username: user.username,
            profilePic: user.profilePic
        });

    } catch (error) {
        console.log("Error occurs in login controller", error.message);
        return res.status(500).json({ error: "Internal Server Error!" });
    }
};

export const logoutUser = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 })
        res.status(200).json({ message: "User Logged Out successfully!" })
    } catch (error) {
        console.log("Error occurs in login controller", error.message);
        res.status(500).json({ error: "Internal Server Error!" });
    }
}


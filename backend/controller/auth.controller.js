import userModel from "../model/user.model.js"
import bcryptJs from "bcryptjs";
import generateTokenAndSetCookie from "../utils/generateToken.js";

export const signup = async(req, res)=>{
    try {
        const { fullName, username, password, confirmPassword, gender } = req.body;

        if(password !== confirmPassword){
            return res.status(400).json({message: "Passwords do not match."})
        }

        const user = await userModel.findOne({username});

        if(user){
            return res.status(400).json({message: "Username already exists."})
        }


        //Hashed The password
        const salt = await bcryptJs.genSalt(10);

        const hashedPassword = await bcryptJs.hash(password, salt);



        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=Scott${username}`
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=Scott${username}`


        const newUser = new userModel({
            fullName,
            username,
            password:hashedPassword,
            gender,
            profilePic: gender === "male" ? boyProfilePic : girlProfilePic
        })


        if(newUser) {
            generateTokenAndSetCookie(newUser._id, res)
            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                username: newUser.username,
                profilePic: newUser.profilePic,

            })
        }else{
            res.status(400).json({message: "Invalid user data"})
        }

  
        
    } catch (error) {
        res.status(500).json({message: "Internal server error."})
        console.log("Error in Signup Controller", error.message);
        
    }
}


export const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await userModel.findOne({username});

        const isPasswordCorrect = await bcryptJs.compare(password, user?.password || "");

        if(!user || !isPasswordCorrect) {
           return res.status(400).json({message: "Invalid username or password"});
        }
        generateTokenAndSetCookie(user._id, res);
        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            username: user.username,
            profilePic: user.profilePic,
        })
        
    } catch (error) {
        res.status(500).json({message: "Internal server error."})
        console.log("Error in login Controller", error.message);
    }
}


export const logout = async (req, res) =>{
    try {

        res.cookie("jwt", "", {maxAge: 0});
        res.status(200).json({ message: "Logged out successfully" });
        
    } catch (error) {
        res.status(500).json({message: "Internal server error."})
        console.log("Error in logout Controller", error.message);
    }
}
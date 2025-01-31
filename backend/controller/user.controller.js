import userModel from '../model/user.model.js';

export const getUsersForSidebar = async (req, res) => {
    try {


        const loggedInUserId = req.user._id;
        const filteredUsers = await userModel.find({ _id: { $ne: loggedInUserId } }).select("-password");
        res.status(200).json(filteredUsers)


        
    } catch (error) {
        console.error("Error in getUserForSidebar controller", error.message);
        res.status(500).json({ error: "Internal server Error"});
    }
}
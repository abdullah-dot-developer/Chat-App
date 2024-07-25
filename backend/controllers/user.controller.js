import User from "../models/user.model.js";

export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUser = req.user._id;

        const filteredUsers = await User.find({ _id: { $ne: loggedInUser } }).select("-password") //It will just not filter the user that is logged In because we have passed its id $ne means not this user

        res.status(200).json(filteredUsers)

    } catch (error) {
        console.log("Error occured in getUsersForSidebar controller:", error.message)
        res.status(500).json({ message: "Internal Server Error!" })
    }
}
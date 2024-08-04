import notifications from "../models/notification.model.js";
import User from "../models/user.model.js";

export const getNotifications =async (req,res) => {
    try {
    const id = req.user._id ; 
    const user = await User.findById(id) ;
    
    if(!user) {
        return res.status(404).json({error : "User not found"}) ; 
    }
    
    const Notifications = await notifications.find({to : user._id }).sort({createdAt : -1}).populate("to",["username","profileImg"]).populate('from',["username","profileImg"]); 
   await  notifications.updateMany({to : user.id},{read : true}) ; 
    res.json(Notifications) ;  // return notifications to the user
    }catch(err) {
        console.log(err.message) ;
        res.status(500).json({error : "Internal Server Error"}) ;  // return an error message if server encounters an issue
    }

    
    
}

 export const deleteOneNotification = async (req, res) => {
    try {
        const { id } = req.params;
        const Noti = await notifications.findById(id);

        if (!Noti) {
            return res.json({ error: "Notification not found" });
        }

        const UserId = req.user._id;
        const user = await User.findById(UserId);

        if (!user) {
            return res.json({ error: "User not found" });
        }

        if (Noti.to.toString() !== user._id.toString()) {
            return res.json({ error: "Unauthorized to delete this notification" });
        }

        await notifications.deleteOne({ _id: id });
        return res.status(200).json({ message: "Notification deleted successfully" });
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}; 

export const deleteNotifications = async (req, res) => {
    try {
        
        const UserId = req.user._id;
        const user = await User.findById(UserId);

        const Notifications = await notifications.deleteMany({to : user._id}) ; 

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }


        res.json({ message: "Notification deleted successfully" });
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};
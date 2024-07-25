import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getRecieverSocketId, io } from "../socket/socket.js";


export const sendMessage = async (req, res) => {
    try {
        const { message } = req.body; // Ensure this matches the frontend key
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        if (!message || !receiverId) {
            return res.status(400).json({ error: "Invalid input" });
        }

        // Find or create the conversation
        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        });

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId]
            });
        }

        // Create a new message
        const newMessage = new Message({
            senderId,
            receiverId, // Corrected from 'recieverId'
            message
        });

        // Add message to the conversation
        if (newMessage) {
            conversation.messages.push(newMessage._id);
        }

        // Save both the conversation and the new message
        await Promise.all([conversation.save(), newMessage.save()]);

        //Socket.io code goes here
        const recieverSocketId = getRecieverSocketId(receiverId);
        //io.to().emit() is used to send event to a specific client
        if (recieverSocketId) {
            io.to(recieverSocketId).emit("newMessage", newMessage)
        }

        res.status(201).json(newMessage);

    } catch (error) {
        console.error("Error occurred in sendMessage controller:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


export const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const senderId = req.user._id;

        const conversation = await Conversation.findOne({
            participants: {
                $all: [senderId, userToChatId]
            }
        }).populate("messages");

        if (!conversation) {
            res.status(200).json([])
        }

        const messages = conversation.messages

        res.status(200).json(messages)

    } catch (error) {
        console.log("Error occured in get messages controller:", error.message)
        res.status(500).json({ message: "Internal Server Error!" })
    }
}
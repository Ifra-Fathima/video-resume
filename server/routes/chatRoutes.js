const express = require('express');
const router = express.Router();
const Chat = require('../models/Chat');

// Send a new chat message (save to DB)
router.post('/send', async (req, res) => {
    try {
        const { senderId, receiverId, message } = req.body;

        const newChat = new Chat({
            senderId,
            receiverId,
            message,
            timestamp: new Date()
        });

        await newChat.save();

        res.status(201).json({ success: true, chat: newChat });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Get chat history between two users
router.get('/history/:senderId/:receiverId', async (req, res) => {
    try {
        const { senderId, receiverId } = req.params;

        const chats = await Chat.find({
            $or: [
                { senderId, receiverId },
                { senderId: receiverId, receiverId: senderId }
            ]
        }).sort({ timestamp: 1 });

        res.json({ success: true, chats });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Optional: Get all conversations for a user
router.get('/conversations/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        const chats = await Chat.find({
            $or: [{ senderId: userId }, { receiverId: userId }]
        }).sort({ timestamp: -1 });

        res.json({ success: true, chats });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;

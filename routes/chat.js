const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middleware/authMiddleware");
const ChatRoom = require("../models/ChatRoom");
const Message = require("../models/Message");

// Chat lobby
router.get("/", isLoggedIn, (req, res) => {
  res.render("chat/index", { user: req.user });
});
// 1-on-1 match route
router.get("/match", isLoggedIn ,async (req, res) => {
  let room = await ChatRoom.findOne({ roomType: "1v1" });

  if (!room) {
    room = await ChatRoom.create({
      topicCategory: "General Support",   // ✅ required field
      roomType: "1v1",
      participants: [req.user._id]
    });
  }

  res.redirect(`/chat/room/${room._id}`);
});

// Group chat route
router.get("/group", isLoggedIn, async (req, res) => {
  let room = await ChatRoom.findOne({ roomType: "group" });

  if (!room) {
    room = await ChatRoom.create({
      topicCategory: "Community Chat",    // ✅ required field
      roomType: "group",
      participants: [req.user._id]
    });
  }

  res.redirect(`/chat/room/${room._id}`);
});


module.exports = router;
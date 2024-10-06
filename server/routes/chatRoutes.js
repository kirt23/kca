import express from "express";
import expressAsyncHandler from "express-async-handler";
import Chat from "../models/chatModel.js";
import { isAuth, isAdmin } from "../utils.js";

const chatRouter = express.Router();

chatRouter.get(
	"/user/:id",
	isAuth,
	expressAsyncHandler(async (req, res) => {
		const chat = await Chat.findOne({ user: req.params.id }).populate(
			"user",
			"name email"
		);
		if (chat) {
			res.send(chat);
		} else {
			res.status(404).send({ message: "Chat not found" });
		}
	})
);

chatRouter.post(
	"/user/:id",
	isAuth,
	expressAsyncHandler(async (req, res) => {
		let chat = await Chat.findOne({ user: req.params.id });
		if (!chat) {
			chat = new Chat({ user: req.params.id, messages: [] });
		}
		const newMessage = {
			text: req.body.message,
			sender: "user",
			user: req.body.user,
			createdAt: Date.now(),
		};
		chat.messages.push(newMessage);
		await chat.save();
		res.send({ message: "Message sent", chat });
	})
);

// Admin route to reply to a chat
chatRouter.post(
	"/admin/reply/:id",
	isAuth,
	isAdmin,
	expressAsyncHandler(async (req, res) => {
		const chat = await Chat.findOne({ user: req.params.id });
		if (chat) {
			const newMessage = {
				text: req.body.message,
				sender: "admin",
				user: req.body.user,
				createdAt: Date.now(),
			};
			chat.messages.push(newMessage);
			await chat.save();
			res.send({ message: "Reply sent", chat });
		} else {
			res.status(404).send({ message: "Chat not found" });
		}
	})
);

chatRouter.get(
	"/admin/get_all_chats",
	isAuth,
	isAdmin,
	expressAsyncHandler(async (req, res) => {
		const chats = await Chat.find().populate("user", "name email");
		console.log(chats);
		res.send(chats);
	})
);

export default chatRouter;

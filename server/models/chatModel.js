import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		messages: [
			{
				text: { type: String, required: true },
				sender: { type: String, required: true },
				user: { type: String, required: true },
				createdAt: { type: Date, default: Date.now },
			},
		],
	},
	{
		timestamps: true,
	}
);

const Chat = mongoose.model("Chat", chatSchema);
export default Chat;

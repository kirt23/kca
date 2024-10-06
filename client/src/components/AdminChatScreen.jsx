import React, { useReducer, useEffect, useState, useRef } from "react";
import logger from "use-reducer-logger";
import axios from "axios";
import "./ChatHead.css";

const reducer = (state, action) => {
	switch (action.type) {
		case "FETCH_REQUEST":
			return { ...state, loading: true };
		case "FETCH_SUCCESS":
			return { ...state, chats: action.payload, loading: false };
		case "FETCH_FAIL":
			return { ...state, loading: false, error: action.payload };
		case "SEND_REQUEST":
			return { ...state, sending: true };
		case "SEND_SUCCESS":
			return {
				...state,
				sending: false,
			};
		case "SEND_FAIL":
			return { ...state, sending: false, error: action.payload };
		default:
			return state;
	}
};

export default function AdminChatScreen({ userInfo }) {
	const [{ loading, error, chats, sending }, dispatch] = useReducer(
		logger(reducer),
		{
			loading: true,
			chats: [],
			error: "",
			sending: false,
		}
	);

	const [isMessageBoxVisible, setIsMessageBoxVisible] = useState(false);
	const [selectedUserChat, setSelectedUserChat] = useState(null);
	const [inputValue, setInputValue] = useState("");
	const messagesEndRef = useRef(null);

	const selectUser = (user) => {
		setSelectedUserChat(user);
		setIsMessageBoxVisible(true);
	};
	const toggleMessageBox = () => {
		setIsMessageBoxVisible((prev) => !prev);
	};

	const fetchAllChats = async () => {
		dispatch({ type: "FETCH_REQUEST" });
		try {
			const { data } = await axios.get(`/api/chats/admin/get_all_chats`, {
				headers: { Authorization: `Bearer ${userInfo.token}` },
			});
			dispatch({ type: "FETCH_SUCCESS", payload: data });
		} catch (error) {
			dispatch({
				type: "FETCH_FAIL",
				payload: error.response
					? error.response.data.message
					: error.message,
			});
		}
	};

	const handleSendMessage = async () => {
		if (inputValue.trim() && selectedUserChat) {
			dispatch({ type: "SEND_REQUEST" });
			try {
				const newMessage = {
					message: inputValue,
					user: userInfo._id,
				};
				await axios.post(
					`/api/chats/admin/reply/${selectedUserChat.user._id}`,
					newMessage,
					{
						headers: { Authorization: `Bearer ${userInfo.token}` },
					}
				);

				const updatedChat = {
					...selectedUserChat,
					messages: [
						...selectedUserChat.messages,
						{
							text: inputValue,
							sender: "admin",
							createdAt: Date.now(),
						},
					],
				};
				setSelectedUserChat(updatedChat);

				dispatch({ type: "SEND_SUCCESS" });
				setInputValue("");
			} catch (error) {
				dispatch({
					type: "SEND_FAIL",
					payload: error.response
						? error.response.data.message
						: error.message,
				});
			}
		}
	};

	const scrollDown = (behavior) => {
		if (messagesEndRef.current)
			messagesEndRef.current.scrollIntoView({ behavior: behavior });
	};

	useEffect(() => {
		if (userInfo) fetchAllChats();
		scrollDown("smooth");
	}, [userInfo]);

	useEffect(() => scrollDown("instant"), [isMessageBoxVisible]);
	useEffect(() => scrollDown("smooth"), [selectedUserChat]);

	const handleKeyPress = (e) => {
		if (e.key === "Enter") {
			handleSendMessage();
		}
	};

	if (!userInfo) {
		return null;
	}

	return (
		<div
			style={{
				position: "absolute",
				top: "0",
				left: "0",
				padding: "20px",
				zIndex: "999",
			}}
		>
			{loading ? (
				<p>Loading chats...</p>
			) : error ? (
				<p className="error">{error}</p>
			) : (
				<div className="chat-dashboard">
					<img
						src="https://cdn-icons-png.flaticon.com/512/309/309666.png"
						alt="Chat Icon"
						className="chat-heads"
						onClick={toggleMessageBox}
					/>
					{isMessageBoxVisible ? (
						<div
							className={`user-list ${
								selectedUserChat ? "opened" : ""
							}`}
						>
							<div
								style={{
									backgroundColor: "black",
									padding: "10px 10px",
									color: "white",
								}}
							>
								All User
							</div>
							<div className="user-list-container">
								{chats.map((chat) => (
									<div
										key={chat.user.name}
										onClick={() => selectUser(chat)}
									>
										{chat.user.name}
									</div>
								))}
							</div>
						</div>
					) : null}

					<div
						className={`message-box ${
							isMessageBoxVisible ? "expand" : "collapse"
						}`}
					>
						{selectedUserChat ? (
							<>
								<div
									style={{
										backgroundColor: "black",
										padding: "10px 10px",
										color: "white",
									}}
								>
									{selectedUserChat.user.name}
								</div>

								<div className="message-container">
									{selectedUserChat.messages.map(
										(msg, index) => (
											<div
												key={index}
												className={`message ${
													msg.sender === "admin"
														? "your-message"
														: "their-message"
												}`}
											>
												<strong>
													{msg.sender === "admin"
														? "Service"
														: selectedUserChat.user
																.name}
													:
												</strong>{" "}
												{msg.text}
											</div>
										)
									)}
									<div ref={messagesEndRef} />
								</div>

								<div className="chat-input">
									<input
										type="text"
										value={inputValue}
										onChange={(e) =>
											setInputValue(e.target.value)
										}
										onKeyDown={handleKeyPress}
										placeholder="Type a reply..."
									/>
									<button
										onClick={handleSendMessage}
										className="send-button"
										disabled={sending}
									>
										{sending ? "Sending..." : "Send"}
									</button>
								</div>
							</>
						) : null}
					</div>
				</div>
			)}
		</div>
	);
}

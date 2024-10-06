import React, { useReducer, useEffect, useState, useRef } from "react";
import logger from "use-reducer-logger";
import axios from "axios";
import "./ChatHead.css";

const reducer = (state, action) => {
	switch (action.type) {
		case "FETCH_REQUEST":
			return { ...state, loading: true };
		case "FETCH_SUCCESS":
			return { ...state, messages: action.payload, loading: false };
		case "FETCH_FAIL":
			return { ...state, loading: false, error: action.payload };
		case "SEND_REQUEST":
			return { ...state, sending: true };
		case "SEND_SUCCESS":
			return {
				...state,
				messages: [...state.messages, action.payload],
				sending: false,
			};
		case "SEND_FAIL":
			return { ...state, sending: false, error: action.payload };
		default:
			return state;
	}
};

export default function ChatScreen({ userInfo }) {
	const [isSendDisabled, setIsSendDisabled] = useState(false);
	const handleInputChange = (e) => {
		setInputValue(e.target.value);
	};

	const [{ loading, error, messages, sending }, dispatch] = useReducer(
		logger(reducer),
		{
			loading: true,
			messages: [],
			error: "",
			sending: false,
		}
	);

	const [inputValue, setInputValue] = useState("");
	const [isMessageBoxVisible, setIsMessageBoxVisible] = useState(false);
	const messagesEndRef = useRef(null);

	const toggleMessageBox = () => {
		setIsMessageBoxVisible((prev) => !prev);
	};

	const fetchChatHistory = async () => {
		dispatch({ type: "FETCH_REQUEST" });
		try {
			const { data } = await axios.get(
				`/api/chats/user/${userInfo._id}`,
				{
					headers: { Authorization: `Bearer ${userInfo.token}` },
				}
			);
			dispatch({ type: "FETCH_SUCCESS", payload: data.messages });
		} catch (error) {
			dispatch({
				type: "FETCH_FAIL",
				payload: error.message,
			});
		}
	};

	const handleSendMessage = async () => {
		if (inputValue.trim()) {
			dispatch({ type: "SEND_REQUEST" });
			try {
				const newMessage = { user: userInfo._id, text: inputValue };
				await axios.post(
					`/api/chats/user/${userInfo._id}`,
					{ message: inputValue, user: userInfo._id },
					{
						headers: { Authorization: `Bearer ${userInfo.token}` },
					}
				);
				dispatch({ type: "SEND_SUCCESS", payload: newMessage });
				setInputValue("");
				fetchChatHistory();
			} catch (error) {
				dispatch({
					type: "SEND_FAIL",
					payload: error.message,
				});
			}
		}
	};

	const scrollDown = (behavior) => {
		if (messagesEndRef.current)
			messagesEndRef.current.scrollIntoView({ behavior: behavior });
	};

	useEffect(() => {
		if (userInfo) fetchChatHistory();
		scrollDown("smooth");
	}, [userInfo]);

	useEffect(() => scrollDown("instant"), [isMessageBoxVisible]);
	useEffect(() => scrollDown("smooth"), [messages]);

	if (!userInfo) {
		return null;
	}

	return (
		<div style={{ position: "absolute", top: "0", left: "0" }}>
			<img
				src="https://cdn-icons-png.flaticon.com/512/309/309666.png"
				alt="Chat Icon"
				className="chat-heads"
				onClick={toggleMessageBox}
			/>
			<div
				className={`message-box ${
					isMessageBoxVisible ? "expand" : "collapse"
				}`}
			>
				{isMessageBoxVisible && (
					<div className="message-container">
						{messages.length > 0 ? (
							messages.map((msg, index) => (
								<div
									key={index}
									className={`message ${
										msg.user === userInfo._id
											? "your-message"
											: "their-message"
									}`}
								>
									<strong>
										{msg.user === userInfo._id
											? "You"
											: "Service"}
										:
									</strong>{" "}
									{msg.text}
								</div>
							))
						) : (
							<div>No messages yet.</div>
						)}
						<div ref={messagesEndRef} />
					</div>
				)}

				{isMessageBoxVisible && (
					<div className="chat-input">
						<input
							type="text"
							value={inputValue}
							onChange={handleInputChange}
							placeholder="Type a message..."
						/>
						<button
							onClick={handleSendMessage}
							className="send-button"
							disabled={isSendDisabled}
						>
							{isSendDisabled ? "Wait..." : "Send"}
						</button>
					</div>
				)}
			</div>
		</div>
	);
}

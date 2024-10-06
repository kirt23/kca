import React from "react";
import "./AdminNavigation.css";
import AdminChatScreen from "../components/AdminChatScreen";

import { Link, useLocation } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import logo from "../LOGO.png";

export default function AdminNavigation({ userInfo, signoutHandler }) {
	const location = useLocation();

	const isActive = (path) => {
		return location.pathname === path ? "active" : "";
	};
	return (
		<>
			<div className="admin-dashboard">
				<img src={logo} alt="Logo" />
				<div className="admin-top">ADMIN</div>

				<Link
					className={`nav-link ${isActive("/admin/dashboard")}`}
					to="/signin"
				>
					<div className="admin-buttons">DASHBOARD</div>
				</Link>

				<Link
					className={`nav-link ${isActive("/admin/products")}`}
					to="/admin/products"
				>
					<div className="admin-buttons">PRODUCT LIST</div>
				</Link>

				<Link
					className={`nav-link ${isActive("/admin/users")}`}
					to="/admin/users"
				>
					<div className="admin-buttons">USER LIST</div>
				</Link>

				<Link
					className={`nav-link ${isActive("/admin/orders")}`}
					to="/admin/orders"
				>
					<div className="admin-buttons">ORDER LIST</div>
				</Link>

				<button
					className="admin-buttons"
					style={{ position: "absolute", bottom: "10px" }}
					onClick={signoutHandler}
				>
					<i
						className="fas fa-sign-out-alt"
						style={{ marginRight: "5px" }}
					></i>
					SIGN OUT
				</button>
			</div>
			<AdminChatScreen userInfo={userInfo} />
		</>
	);
}

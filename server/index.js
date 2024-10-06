import express from "express";
import data from "./data.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import seedRouter from "./routes/seedRoutes.js";
import productRouter from "./routes/productRoutes.js";
import userRouter from "./routes/userRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
import uploadRouter from "./routes/uploadRoutes.js";
import customRouter from "./routes/customizeRoutes.js";
import uploadImageRoutes from "./routes/uploadImageRoutes.js";
import nodemailer from "nodemailer";
import cron from "node-cron";
import Product from "./models/productModel.js";
import cors from "cors";
import chatRouter from "./routes/chatRoutes.js";

dotenv.config();

mongoose
	.connect("mongodb://localhost:27017/amazona")
	.then(() => {
		console.log("Connected to Database");
	})
	.catch((err) => {
		console.log(err.message);
	});

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static("uploads"));
app.get("/api/keys/paypal", (req, res) => {
	res.send(process.env.PAYPAL_CLIENT_ID || "sb");
});
app.use("/api/uploadImage", uploadImageRoutes);

app.use("/api/upload", uploadRouter);
app.use("/api/seed", seedRouter);
app.use("/api/products", productRouter);
app.use("/api/users", userRouter);
app.use("/api/orders", orderRouter);
app.use("/api/custom", customRouter);
app.use("/api/chats", chatRouter);

const transporter = nodemailer.createTransport({
	service: "gmail",
	// host: 'kcaligam@ccc.edu.ph',
	auth: {
		user: process.env.EMAIL_USER,
		pass: process.env.EMAIL_PASS,
	},
});
transporter.verify(function (error, success) {
	if (error) {
		console.log("Error with transporter", error);
	} else {
		console.log("Nodemailer is ready to send emails.");
	}
});

cron.schedule("0 0 * * *", async () => {
	try {
		const now = new Date();
		const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));

		const result = await Product.deleteMany({
			isArchived: true,
			archivedAt: { $lte: thirtyDaysAgo },
		});

		console.log(
			`Deleted ${result.deletedCount} archived products older than 30 days.`
		);
	} catch (error) {
		console.error("Error deleting archived products:", error);
	}
});

// const __dirname = path.resolve();
// app.use(express.static(path.join(__dirname, "/client/build")));
// app.get("*", (req, res) =>
//   res.sendFile(path.join(__dirname, "/client/build/index.html"))
// );

app.use((err, req, res, next) => {
	res.status(500).send({ message: err.message });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
	console.log(`serve at http://localhost:${port}`);
});

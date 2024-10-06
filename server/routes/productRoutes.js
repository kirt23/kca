import express, { query } from "express";
import Product from "../models/productModel.js";
import expressAsyncHandler from "express-async-handler";
import { isAdmin, isAuth } from "../utils.js";

const productRouter = express.Router();

productRouter.get("/", async (req, res) => {
	const products = await Product.find({ isArchived: false });
	res.send(products);
});
// List all archived products (Admin only)

productRouter.post(
	"/",
	isAuth,
	expressAsyncHandler(async (req, res) => {
		const newProduct = new Product({
			name: "sample name" + Date.now(),
			slug: "sample-name-" + Date.now(),
			image: " ",
			price: 0,
			category: "sample category",
			brand: "sample brand",
			countInStock: 0,
			rating: 0,
			numReviews: 0,
			description: "sample description",
			//isArchived: { type: Boolean, default: false },
			isArchived: false, // Set it as a simple Boolean
		});
		const product = await newProduct.save();
		res.send({ message: "Product Created", product });
	})
);
// List all archived products (Admin only)
productRouter.get(
	"/archived",
	isAuth,
	isAdmin,
	expressAsyncHandler(async (req, res) => {
		const archivedProducts = await Product.find({ isArchived: true });
		res.send(archivedProducts);
	})
);

productRouter.put(
	"/:id/archive",
	isAuth,
	expressAsyncHandler(async (req, res) => {
		const productId = req.params.id;
		const product = await Product.findById(productId);
		console.log("archive", product);
		if (product) {
			product.isArchived = true;
			product.archivedAt = new Date();
			await product.save();
			res.send({ message: "Product Archived" });
		} else {
			res.status(404).send({ message: "Product Not Found" });
		}
	})
);
productRouter.put(
	"/:id/unarchive",
	isAuth,
	expressAsyncHandler(async (req, res) => {
		const product = await Product.findById(req.params.id);
		if (product) {
			product.isArchived = false;
			await product.save();
			res.send({ message: "Product Unarchived" });
		} else {
			res.status(404).send({ message: "Product Not Found" });
		}
	})
);
productRouter.put(
	"/:id",
	isAuth,
	expressAsyncHandler(async (req, res) => {
		const productId = req.params.id;
		const product = await Product.findById(productId);
		if (product) {
			product.name = req.body.name;
			product.slug = req.body.slug;
			product.price = req.body.price;
			product.image = req.body.image;
			product.images = req.body.images;
			product.category = req.body.category;
			product.brand = req.body.brand;
			product.countInStock = req.body.countInStock;
			product.description = req.body.description;
			await product.save();
			res.send({ message: "Product Successfully Updated" });
		} else {
			res.status(404).send({
				message: "Product Do Not Exist. Error 404",
			});
		}
	})
);

productRouter.delete(
	"/:id",
	isAuth,
	expressAsyncHandler(async (req, res) => {
		const product = await Product.findById(req.params.id);
		if (product) {
			await product.deleteOne();
			res.send({ message: "PRODUCT IS DELETED" });
		} else {
			res.status(404).send({ message: "Product Is Not Found" });
		}
	})
);

// productRouter.put(
//   '/:id',
//   isAuth,
//   isAdmin,
//   expressAsyncHandler(async (req, res) => {
//     const productId = req.params.id;
//     const product = await Product.findById(productId);
//     if (product) {
//       product.name = req.body.name;
//       product.slug = req.body.slug;
//       product.price = req.body.price;
//       product.image = req.body.image;
//       product.images = req.body.images;
//       product.category = req.body.category;
//       product.brand = req.body.brand;
//       product.countInStock = req.body.countInStock;
//       product.description = req.body.description;
//       await product.save();
//       res.send({ message: 'Product Updated' });
//     } else {
//       res.status(404).send({ message: 'Product Not Found' });
//     }
//   })
// );

// productRouter.delete(
//   '/:id',
//   isAuth,
//   isAdmin,
//   expressAsyncHandler(async (req, res) => {
//     const product = await Product.findById(req.params.id);
//     if (product) {
//       await product.remove();
//       res.send({ message: 'Product Deleted' });
//     } else {
//       res.status(404).send({ message: 'Product Not Found' });
//     }
//   })
// );

const PAGE_SIZE = 3;

productRouter.get(
	"/admin",
	isAuth,
	expressAsyncHandler(async (req, res) => {
		const { query } = req;
		const page = query.page || 1;
		const pageSize = query.pageSize || PAGE_SIZE;

		const products = await Product.find({ isArchived: false })
			.skip(pageSize * (page - 1))
			.limit(pageSize);
		const countProducts = await Product.countDocuments({
			isArchived: false,
		});
		res.send({
			products,
			countProducts,
			page,
			pages: Math.ceil(countProducts / pageSize),
		});
	})
);

productRouter.post(
	"/:id/reviews",
	isAuth,
	expressAsyncHandler(async (req, res) => {
		const productId = req.params.id;
		const product = await Product.findById(productId);
		if (product) {
			if (product.reviews.find((x) => x.name === req.user.name)) {
				return res
					.status(400)
					.send({ message: "YOU ALREADY SUBMITTED A REVIEW" });
			}

			const review = {
				name: req.user.name,
				rating: Number(req.body.rating),
				comment: req.body.comment,
			};
			product.reviews.push(review);
			product.numReviews = product.reviews.length;
			product.rating =
				product.reviews.reduce((a, c) => c.rating + a, 0) /
				product.reviews.length;
			const updatedProduct = await product.save();
			res.status(201).send({
				message: "Review Created",
				review: updatedProduct.reviews[
					updatedProduct.reviews.length - 1
				],
				numReviews: product.numReviews,
				rating: product.rating,
			});
		} else {
			res.status(404).send({ message: "Product Not Found" });
		}
	})
);

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// const PAGE_SIZE = 3;
// productRouter.get(
//   '/search',
//   expressAsyncHandler(async (req, res) => {
//     const { query } = req;
//     const pageSize = query.pageSize || PAGE_SIZE;
//     const page = query.page || 1;
//     const category = query.category || '';
//     const price = query.price || '';
//     const rating = query.rating || '';
//     const order = query.order || '';
//     const searchQuery = query.query || '';

//     const queryFilter =
//       searchQuery && searchQuery !== 'all'
//         ? {
//             name: {
//               $regex: searchQuery,
//               $options: 'i',
//             },
//           }
//         : {};
//     const categoryFilter = category && category !== 'all' ? { category } : {};
//     const ratingFilter =
//       rating && rating !== 'all'
//         ? {
//             rating: {
//               $gte: Number(rating),
//             },
//           }
//         : {};
//     const priceFilter =
//       price && price !== 'all'
//         ? {
//             // 1-50
//             price: {
//               $gte: Number(price.split('-')[0]),
//               $lte: Number(price.split('-')[1]),
//             },
//           }
//         : {};
//     const sortOrder =
//       order === 'featured'
//         ? { featured: -1 }
//         : order === 'lowest'
//         ? { price: 1 }
//         : order === 'highest'
//         ? { price: -1 }
//         : order === 'toprated'
//         ? { rating: -1 }
//         : order === 'newest'
//         ? { createdAt: -1 }
//         : { _id: -1 };

//     const products = await Product.find({
//       ...queryFilter,
//       ...categoryFilter,
//       ...priceFilter,
//       ...ratingFilter,
//     })
//       .sort(sortOrder)
//       .skip(pageSize * (page - 1))
//       .limit(pageSize);

//     const countProducts = await Product.countDocuments({
//       ...queryFilter,
//       ...categoryFilter,
//       ...priceFilter,
//       ...ratingFilter,
//     });
//     res.send({
//       products,
//       countProducts,
//       page,
//       pages: Math.ceil(countProducts / pageSize),
//     });
//   })
// );
///////////////////////DIVIDER HERE////////////////////////////////

productRouter.get(
	"/search",
	expressAsyncHandler(async (req, res) => {
		const { query } = req;
		const pageSize = query.pageSize || PAGE_SIZE;
		const page = query.page || 1;
		const category = query.category || "";
		const price = query.price || "";
		const rating = query.rating || "";
		const order = query.order || "";
		const searchQuery = query.query || "";

		const queryFilter =
			searchQuery && searchQuery !== "all"
				? {
						name: {
							$regex: searchQuery,
							$options: "i",
						},
				  }
				: {};
		const categoryFilter =
			category && category !== "all" ? { category } : {};
		const ratingFilter =
			rating && rating !== "all"
				? {
						rating: {
							$gte: Number(rating),
						},
				  }
				: {};
		const priceFilter =
			price && price !== "all"
				? {
						// 1-50
						price: {
							$gte: Number(price.split("-")[0]),
							$lte: Number(price.split("-")[1]),
						},
				  }
				: {};
		const sortOrder =
			order === "featured"
				? { featured: -1 }
				: order === "lowest"
				? { price: 1 }
				: order === "highest"
				? { price: -1 }
				: order === "toprated"
				? { rating: -1 }
				: order === "newest"
				? { createdAt: -1 }
				: { _id: -1 };

		const products = await Product.find({
			isArchived: false,
			...queryFilter,
			...categoryFilter,
			...priceFilter,
			...ratingFilter,
		})
			.sort(sortOrder)
			.skip(pageSize * (page - 1))
			.limit(pageSize);

		const countProducts = await Product.countDocuments({
			isArchived: false,
			...queryFilter,
			...categoryFilter,
			...priceFilter,
			...ratingFilter,
		});

		res.send({
			products,
			countProducts,
			page,
			pages: Math.ceil(countProducts / pageSize),
		});
	})
);

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

productRouter.get(
	"/categories",
	expressAsyncHandler(async (req, res) => {
		const categories = await Product.find().distinct("category");
		res.send(categories);
	})
);

productRouter.get("/slug/:slug", async (req, res) => {
	// BACKEND API FOR RETURNING PROD INFO BASE SLUG
	const product = await Product.findOne({ slug: req.params.slug });
	if (product) {
		res.send(product);
	} else {
		res.status(404).send({ message: "PRODUCT NOT FOUND" });
	}
});

productRouter.get("/:id", async (req, res) => {
	// BACKEND API FOR RETURNING PROD INFO BASE ON id
	const product = await Product.findById(req.params.id);
	if (product) {
		res.send(product);
	} else {
		res.status(404).send({ message: "PRODUCT NOT FOUND" });
	}
});
export default productRouter;

// import express from 'express';
// import expressAsyncHandler from 'express-async-handler';
// import Product from '../models/productModel.js';
// import { isAuth, isAdmin } from '../utils.js';

// const productRouter = express.Router();

// productRouter.get('/', async (req, res) => {
//   const products = await Product.find();
//   res.send(products);
// });

// productRouter.post(
//   '/',
//   isAuth,
//   isAdmin,
//   expressAsyncHandler(async (req, res) => {
//     const newProduct = new Product({
//       name: 'sample name ' + Date.now(),
//       slug: 'sample-name-' + Date.now(),
//       image: '/images/p1.jpg',
//       price: 0,
//       category: 'sample category',
//       brand: 'sample brand',
//       countInStock: 0,
//       rating: 0,
//       numReviews: 0,
//       description: 'sample description',
//     });
//     const product = await newProduct.save();
//     res.send({ message: 'Product Created', product });
//   })
// );

// productRouter.put(
//   '/:id',
//   isAuth,
//   isAdmin,
//   expressAsyncHandler(async (req, res) => {
//     const productId = req.params.id;
//     const product = await Product.findById(productId);
//     if (product) {
//       product.name = req.body.name;
//       product.slug = req.body.slug;
//       product.price = req.body.price;
//       product.image = req.body.image;
//       product.images = req.body.images;
//       product.category = req.body.category;
//       product.brand = req.body.brand;
//       product.countInStock = req.body.countInStock;
//       product.description = req.body.description;
//       await product.save();
//       res.send({ message: 'Product Updated' });
//     } else {
//       res.status(404).send({ message: 'Product Not Found' });
//     }
//   })
// );

// productRouter.delete(
//   '/:id',
//   isAuth,
//   isAdmin,
//   expressAsyncHandler(async (req, res) => {
//     const product = await Product.findById(req.params.id);
//     if (product) {
//       await product.deleteMany();
//       res.send({ message: 'Product Deleted' });
//     } else {
//       res.status(404).send({ message: 'Product Not Found' });
//     }
//   })
// );

// productRouter.post(
//   '/:id/reviews',
//   isAuth,
//   expressAsyncHandler(async (req, res) => {
//     const productId = req.params.id;
//     const product = await Product.findById(productId);
//     if (product) {
//       if (product.reviews.find((x) => x.name === req.user.name)) {
//         return res
//           .status(400)
//           .send({ message: 'You already submitted a review' });
//       }

//       const review = {
//         name: req.user.name,
//         rating: Number(req.body.rating),
//         comment: req.body.comment,
//       };
//       product.reviews.push(review);
//       product.numReviews = product.reviews.length;
//       product.rating =
//         product.reviews.reduce((a, c) => c.rating + a, 0) /
//         product.reviews.length;
//       const updatedProduct = await product.save();
//       res.status(201).send({
//         message: 'Review Created',
//         review: updatedProduct.reviews[updatedProduct.reviews.length - 1],
//         numReviews: product.numReviews,
//         rating: product.rating,
//       });
//     } else {
//       res.status(404).send({ message: 'Product Not Found' });
//     }
//   })
// );

// const PAGE_SIZE = 3;

// productRouter.get(
//   '/admin',
//   isAuth,
//   isAdmin,
//   expressAsyncHandler(async (req, res) => {
//     const { query } = req;
//     const page = query.page || 1;
//     const pageSize = query.pageSize || PAGE_SIZE;

//     const products = await Product.find()
//       .skip(pageSize * (page - 1))
//       .limit(pageSize);
//     const countProducts = await Product.countDocuments();
//     res.send({
//       products,
//       countProducts,
//       page,
//       pages: Math.ceil(countProducts / pageSize),
//     });
//   })
// );

// productRouter.get(
//   '/search',
//   expressAsyncHandler(async (req, res) => {
//     const { query } = req;
//     const pageSize = query.pageSize || PAGE_SIZE;
//     const page = query.page || 1;
//     const category = query.category || '';
//     const price = query.price || '';
//     const rating = query.rating || '';
//     const order = query.order || '';
//     const searchQuery = query.query || '';

//     const queryFilter =
//       searchQuery && searchQuery !== 'all'
//         ? {
//             name: {
//               $regex: searchQuery,
//               $options: 'i',
//             },
//           }
//         : {};
//     const categoryFilter = category && category !== 'all' ? { category } : {};
//     const ratingFilter =
//       rating && rating !== 'all'
//         ? {
//             rating: {
//               $gte: Number(rating),
//             },
//           }
//         : {};
//     const priceFilter =
//       price && price !== 'all'
//         ? {
//             // 1-50
//             price: {
//               $gte: Number(price.split('-')[0]),
//               $lte: Number(price.split('-')[1]),
//             },
//           }
//         : {};
//     const sortOrder =
//       order === 'featured'
//         ? { featured: -1 }
//         : order === 'lowest'
//         ? { price: 1 }
//         : order === 'highest'
//         ? { price: -1 }
//         : order === 'toprated'
//         ? { rating: -1 }
//         : order === 'newest'
//         ? { createdAt: -1 }
//         : { _id: -1 };

//     const products = await Product.find({
//       ...queryFilter,
//       ...categoryFilter,
//       ...priceFilter,
//       ...ratingFilter,
//     })
//       .sort(sortOrder)
//       .skip(pageSize * (page - 1))
//       .limit(pageSize);

//     const countProducts = await Product.countDocuments({
//       ...queryFilter,
//       ...categoryFilter,
//       ...priceFilter,
//       ...ratingFilter,
//     });
//     res.send({
//       products,
//       countProducts,
//       page,
//       pages: Math.ceil(countProducts / pageSize),
//     });
//   })
// );

// productRouter.get(
//   '/categories',
//   expressAsyncHandler(async (req, res) => {
//     const categories = await Product.find().distinct('category');
//     res.send(categories);
//   })
// );

// productRouter.get('/slug/:slug', async (req, res) => {
//   const product = await Product.findOne({ slug: req.params.slug });
//   if (product) {
//     res.send(product);
//   } else {
//     res.status(404).send({ message: 'Product Not Found' });
//   }
// });
// productRouter.get('/:id', async (req, res) => {
//   const product = await Product.findById(req.params.id);
//   if (product) {
//     res.send(product);
//   } else {
//     res.status(404).send({ message: 'Product Not Found' });
//   }
// });

// export default productRouter;

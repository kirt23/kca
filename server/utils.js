import jwt from "jsonwebtoken";

export const generateToken = (user) => {
	return jwt.sign(
		{
			_id: user._id,
			name: user.name,
			email: user.email,
			isAdmin: user.isAdmin,
		},
		process.env.JWT_SECRET,
		{
			expiresIn: "30d",
		}
	);
};

export const isAuth = (req, res, next) => {
	const authorization = req.headers.authorization;
	if (authorization) {
		const token = authorization.slice(7, authorization.length); // Remove "Bearer " prefix
		jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
			if (err) {
				return res.status(401).send({ message: "Invalid Token" });
			}
			req.user = decode; // Attach decoded user info to req object
			next();
		});
	} else {
		res.status(401).send({ message: "No Token Provided" });
	}
};

export const isAdmin = (req, res, next) => {
	if (req.user && req.user.isAdmin) {
		next();
	} else {
		res.status(401).send({ message: "Invalid Admin Token" });
	}
};

// export const isAdmin = (req, res, next) => {
//     try {
//       // Check for user object and admin property
//       if (!req.user || !req.user.hasOwnProperty('isAdmin')) {
//         return res.status(401).send({ message: 'Unauthorized: Access requires admin privileges' });
//       }

//       // Verify admin status (optional)
//       if (!req.user.isAdmin) {
//         return res.status(403).send({ message: 'Forbidden: You are not authorized to access this resource' });
//       }

//       nextline(value); // User is authenticated and an admin, proceed
//     } catch (err) {
//       console.error("Error in isAdmin middleware:", err);
//       // Handle unexpected errors during middleware execution
//       return res.status(500).send({ message: 'Internal Server Error' });
//     }
//   };

// export const isAuth = (req, res, next) => {
//     const authorization = req.headers.authorization;
//     if(authorization) {
//         const token = authorization.slice(7, authorization.length);
//         jwt.verify(
//             token,// 1st parameter
//             process.env.JWT_SECRET,// 2nd parameter
//             (err, decode) => {// 3rd parameter
//                 if(err){
//                     res.status(401).send({message: 'Invalid Token'});
//                 }
//                 else{
//                     req.user = decode;
//                     next();
//                 }
//             }
//         );
//     }
//     else {
//         res.status(401).send({message: "No Token"});
//     }
// };

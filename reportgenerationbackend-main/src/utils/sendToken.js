import { apiResponse } from "./apiResponse.js";

const sendToken = (res, user, message, statusCode = 201) => {
    const token = user.getJWTToken();
    console.log("send token:", token)
    const options = {
        expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: true,
        sameSite: "None",
    };
    res.status(statusCode).cookie("token", token, options).json(new apiResponse(user, message, true));
};


// // import { apiResponse } from "./apiResponse.js";

// // const sendToken = (res, user, message, statusCode = 201) => {
// //     const token = user.getJWTToken();
// //     console.log("send token:", token);

// //     // Define cookie options
// //     const options = {
// //         expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // Expiration time
// //         httpOnly: true, // HttpOnly flag for security
// //         // secure: true, // Uncomment for secure cookie (requires HTTPS)
// //         sameSite: "none", // Uncomment for same-site cookie (for cross-site requests)
// //         // domain: ".yourdomain.com", // Optionally specify domain
// //         // path: "/", // Optionally specify path
// //     };

// //     // Set the cookie with the provided token and options
// //     res.cookie("token", token, options);

// //     // Respond with JSON data
// //     res.status(statusCode).json(new apiResponse(user, message, true));
// // };

export default sendToken;
/////////>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>/////////////////////////
// import { apiResponse } from "./apiResponse.js";

// const sendToken = (res, user, message, statusCode = 201) => {
//     const token = user.getJWTToken();
//     console.log("send token:", token);

//     // Conditionally set the 'secure' flag based on the environment (for HTTPS in production)
//     const options = {
//         expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),  // Cookie expiry time (15 days)
//         httpOnly: true,  // Makes cookie accessible only via HTTP(S)
//         secure: process.env.NODE_ENV === "production",  // Set to true for production (HTTPS)
//         sameSite: "None",  // Required for cross-site cookies (CORS)
//         domain: process.env.NODE_ENV === "production" ? ".sagarsinghawesome.com" : "localhost",  // Adjust domain for production
//     };

//     // Send the token as a cookie and respond
//     res.status(statusCode).cookie("token", token, options).json(new apiResponse(user, message, true));
// };

// export default sendToken;

import {User} from "../models/user.model.js";
import {apiResponse} from "../utils/apiResponse.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import sendToken from "../utils/sendToken.js";
import {generateStrongPassword} from "../utils/generatePassword.js";
import apiError from "../utils/apiError.js";
import ExcelJs from "exceljs"
import XlsxPopulate from "xlsx-populate";
import path from 'path';
import mongoose from 'mongoose';
import Medical from "../models/medical.model.js";
import Telecom from "../models/telecom.model.js";
import ExcelPassword from "../models/excelPassword.model.js";
import {fileURLToPath} from "url";
import {dirname} from 'path';
import nodemailer from "nodemailer";
import fs from 'fs';
// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


export const register = asyncHandler(async (req, res, next) => {

    const {name, email} = req.body

    if ([name, email].some((field) => field?.trim() === "")) {
        return next(new apiError("all fields are required", 400))
    }

    const existedUser = await User.findOne({email});

    if (existedUser) {
        return next(new apiError("user already exists", 404))
    }

    const user = await User.create({
        name, email
    })

    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if (!createdUser) return next(new apiError("something went wrong while registering user", 404))

    res.status(201).json(
        new apiResponse(createdUser, "contact admin for your credential", true)
    )
})

export const login = asyncHandler(async (req, res, next) => {
    const {email, password} = req.body

    if (!email || !password) return next(new apiError("all fields are required", 404))

    const cleanInput = email.trim();
    const escapedInput = cleanInput.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const user = await User.findOne({
        $or: [
            { email: { $regex: `^${escapedInput}$`, $options: "i" } },
            { name: { $regex: `^${escapedInput}$`, $options: "i" } }
        ]
    });
    // console.log(user)

    if (!user) return next(new apiError("user not found", 404))

    const isCorrect = await user.comparePassword(password);
    // console.log(isCorrect)
    if (!isCorrect) {
        return next(new apiError("either email or password is incorrect", 404))
    }

    // if (user.deniedAccess === "yes") return next(new apiError("service suspended for now", 404))
    if (user.deniedAccess === "yes") {
        return next(new apiError(user.accessMessage, 404));
    }

    sendToken(res, user, `welcome ${user.name}`, 200)
});

//admin
export const setPasswordAndLevel = asyncHandler(async (req, res, next) => {
    const {userId, level, accessMessage, password} = req.body
    // console.log(userId);
    // console.log(accessMessage)

    if (userId == null || userId == "") return next(new apiError("User ID Not Received", 404))

    let user = await User.findOne({_id: userId})

    if (!user) return next(new apiError(`user not found with ID: ${userId}`, 404))

    if (password != null && password != "") {
        user.password = password;
    } else if (user.password == null || user.password == "") {
        user.password = generateStrongPassword(10);
    }

    if (level != null && level != "") {
        user.accessLevel = level;
    }

    if (accessMessage != null && accessMessage != "") {
        user.accessMessage = accessMessage;
    }

    await user.save();

    res.status(201).json(new apiResponse(user, "Data saved successfully", true))


});

//corrupted set
export const setUserCorruptedStatus = asyncHandler(async (req, res, next) => {
    const {id} = req.body;

    if (!id) return next(new apiError("User ID not received", 400));

    const user = await User.findById(id);
    if (!user) return next(new apiError(`User not found with ID: ${id}`, 404));

    user.corrupted = true;
    await user.save();

    res.status(200).json(new apiResponse(user, `Corrupted flag set to TRUE`, true));
});
//corrupted set
export const setUserUnCorruptedStatus = asyncHandler(async (req, res, next) => {
    const {id} = req.body;

    if (!id) return next(new apiError("User ID not received", 400));

    const user = await User.findById(id);
    if (!user) return next(new apiError(`User not found with ID: ${id}`, 404));

    user.corrupted = false;
    await user.save();

    res.status(200).json(new apiResponse(user, `Corrupted flag set to FALSE`, true));
});


export const resetPassword = asyncHandler(async (req, res, next) => {
    const {id} = req.body
    const user = await User.findOne({_id: id})

    user.password = generateStrongPassword(10);

    await user.save()
    res.status(201).json(new apiResponse("", "password reset successfully", true))

})

export const getAllUsers = asyncHandler(async (req, res, next) => {
    const { page = 1, limit = 10, search = "" } = req.query;

    // Convert page and limit to numbers
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build search query
    let searchQuery = { role: "user" };

    if (search && search.trim() !== "") {
        searchQuery.$or = [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } }
        ];
    }

    // Get total count for pagination
    const totalUsers = await User.countDocuments(searchQuery);

    // Get paginated users
    const users = await User.find(searchQuery)
        .select("-refreshToken") // Exclude only refreshToken, keep password
        .sort({ createdAt: -1 }) // Sort by newest first
        .skip(skip)
        .limit(limitNum);

    // Calculate pagination info
    const totalPages = Math.ceil(totalUsers / limitNum);
    const hasNextPage = pageNum < totalPages;
    const hasPrevPage = pageNum > 1;

    res.status(200).json(new apiResponse({
        users,
        pagination: {
            currentPage: pageNum,
            totalPages,
            totalUsers,
            hasNextPage,
            hasPrevPage,
            limit: limitNum
        }
    }, "Users fetched successfully", true));
});

export const sendMail = asyncHandler(async (req, res, next) => {
    //todo
    const {name, email, phone_number, msg_subject, message} = req.body;
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.hostinger.com",
            port: 465,
            secure: true,
            auth: {
                user: "info@greeneracetechnologies.com",
                pass: "Sagar675@greenerace"
            }
        });

        await transporter.sendMail({
            from: '"Website Contact Form" <info@greeneracetechnologies.com>',
            to: "greenracetechnologies@gmail.com",
            subject: msg_subject || "New Message from Website",
            html: `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone_number}</p>
        <p><strong>Message:</strong><br>${message}</p>
      `,
        });

        res.status(200).send("Email sent successfully.");
    } catch (error) {
        console.error("Email send error:", error);
        res.status(500).send("Failed to send email.");
    }

});
export const getAUser = asyncHandler(async (req, res, next) => {

    const {id} = req.params
    // console.log(id)

    // Use aggregation to get user data with total report count
    const pipeline = [
        { $match: { _id: new mongoose.Types.ObjectId(id) } },
        {
            $lookup: {
                from: "telecoms",
                localField: "report",
                foreignField: "_id",
                as: "telecomReports"
            }
        },
        {
            $lookup: {
                from: "medicals",
                localField: "report",
                foreignField: "_id",
                as: "medicalReports"
            }
        },
        {
            $addFields: {
                totalReports: { $size: { $concatArrays: ["$telecomReports", "$medicalReports"] } }
            }
        },
        {
            $project: {
                _id: 1,
                name: 1,
                email: 1,
                role: 1,
                accessLevel: 1,
                reportModel: 1,
                password: 1,
                deniedAccess: 1,
                deniedReportAccess: 1,
                accessMessage: 1,
                corrupted: 1,
                isFreezed: 1,
                createdAt: 1,
                updatedAt: 1,
                totalReports: 1,
                jumbleUpReports: 1,
                duplicateReport: 1
                // Note: report array and refreshToken are automatically excluded
            }
        }
    ];

    const user = await User.aggregate(pipeline);

    if (!user || user.length === 0) {
        return res.status(404).json(new apiResponse(null, "User not found", false));
    }

    res.status(200).json(new apiResponse([user[0]], "user data retrieved", true))

});

export const deleteUser = asyncHandler(async (req, res, next) => {

    const {id} = req.params
    // console.log(id)
    await User.findByIdAndDelete({_id: id})

    res.status(200).json(new apiResponse("", "user Deleted successfully", true))

});

export const deleteReport = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    console.log("[deleteReport] incoming delete request", {
        reportIdParam: id,
        userId: req.user?._id,
        time: new Date().toISOString(),
    });

    if (!mongoose.Types.ObjectId.isValid(id)) {
        console.log("[deleteReport] invalid report id", { id });
        return res.status(400).json(new apiResponse(null, "Invalid report id", false));
    }

    const reportObjectId = new mongoose.Types.ObjectId(id);

    const user = await User.findById(req.user._id).select("_id accessLevel report");
    if (!user) {
        console.log("[deleteReport] user not found", { userId: req.user?._id });
        return res.status(404).json(new apiResponse(null, "User not found", false));
    }

    console.log("[deleteReport] user loaded", {
        accessLevel: user.accessLevel,
        reportCount: Array.isArray(user.report) ? user.report.length : 0,
    });

    // Try deleting from both collections to be safe (access levels may vary)
    const [telecomDelete, medicalDelete] = await Promise.all([
        Telecom.deleteOne({ _id: reportObjectId }),
        Medical.deleteOne({ _id: reportObjectId }),
    ]);

    console.log("[deleteReport] delete results", {
        telecomDeletedCount: telecomDelete?.deletedCount || 0,
        medicalDeletedCount: medicalDelete?.deletedCount || 0,
    });

    if ((telecomDelete?.deletedCount || 0) === 0 && (medicalDelete?.deletedCount || 0) === 0) {
        console.log("[deleteReport] no matching report found in either collection", { id });
        // Continue to pull from user's list anyway, in case of drift
    }

    // Remove reference from user's report array using $pull
    const pullResult = await User.updateOne(
        { _id: user._id },
        { $pull: { report: reportObjectId } }
    );

    console.log("[deleteReport] user $pull result", pullResult);

    // Optionally reflect new count for clarity
    const updatedUser = await User.findById(user._id).select("report");
    console.log("[deleteReport] updated user report count", {
        count: Array.isArray(updatedUser?.report) ? updatedUser.report.length : 0,
    });

    return res.status(200).json(new apiResponse(
        {
            telecomDeletedCount: telecomDelete?.deletedCount || 0,
            medicalDeletedCount: medicalDelete?.deletedCount || 0,
            pulledFromUser: pullResult?.modifiedCount || 0,
        },
        "report deleted successfully",
        true
    ));
});


export const getALLReports = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search ? decodeURIComponent(req.query.search.trim()) : "";
    
    console.log("[getALLReports] Search parameters:", {
        originalSearch: req.query.search,
        decodedSearch: search,
        page,
        limit,
        userId: id
    });

    // Step 1: validate user
    const user = await User.findById(id).select("reportModel deniedReportAccess report");
    if (!user) {
        return res.status(404).json(new apiResponse(null, "User not found", false));
    }
    if (user.deniedReportAccess === "yes") {
        return res.status(403).json(new apiResponse(null, "Access denied", false));
    }

    // Step 2: build search filter (apply BEFORE pagination)
    let searchFilter = {};
    if (search) {
        const parsedDate = new Date(search);
        if (!isNaN(parsedDate.getTime())) {
            // Date search: one day before to one day after
            const startDate = new Date(parsedDate);
            startDate.setDate(startDate.getDate());
            startDate.setHours(0, 0, 0, 0);

            const endDate = new Date(parsedDate);
            endDate.setDate(endDate.getDate());
            endDate.setHours(23, 59, 59, 999);

            searchFilter.createdAt = { $gte: startDate, $lte: endDate };
        } else {
            // Text search across multiple fields - escape special regex characters
            const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            console.log("[getALLReports] Regex escaping:", { original: search, escaped: escapedSearch });
            const regex = new RegExp(escapedSearch, "i");
            searchFilter.$or = [
                { name: regex },
                { description: regex },
                { reportId: regex },
                { referenceNo: regex },
                { caseNo: regex },
                { "Ref No": regex },
                { "Record No": regex },
                { "Invoice No": regex },
                { "File No": regex },
                { "customer name": regex }
            ];
        }
    }

    console.log("[getALLReports] Search filter:", JSON.stringify(searchFilter, null, 2));

    // Step 3: Use aggregation pipeline for efficient search, sort, and pagination
    const reportIds = Array.isArray(user.report) ? user.report : [];
    
    if (reportIds.length === 0) {
        return res.status(200).json(new apiResponse({
            reports: [],
            pagination: {
                currentPage: page,
                totalPages: 1,
                totalReports: 0,
                hasNextPage: false,
                hasPrevPage: false,
                limit,
            }
        }, "No reports found", true));
    }

    // Build aggregation pipeline
    const pipeline = [
        // Match user's report IDs and search filter
        {
            $match: {
                _id: { $in: reportIds },
                ...searchFilter
            }
        },
        // Sort by creation date
        { $sort: { createdAt: 1 } },
        // Add facet for total count and paginated results
        {
            $facet: {
                totalCount: [{ $count: "count" }],
                reports: [
                    { $skip: skip },
                    { $limit: limit }
                ]
            }
        }
    ];

    // Execute aggregation on both collections
    const [telecomResults, medicalResults] = await Promise.all([
        mongoose.connection.db.collection("telecoms").aggregate(pipeline).toArray(),
        mongoose.connection.db.collection("medicals").aggregate(pipeline).toArray(),
    ]);

    // Combine results
    const totalTelecomCount = telecomResults[0]?.totalCount[0]?.count || 0;
    const totalMedicalCount = medicalResults[0]?.totalCount[0]?.count || 0;
    const totalCount = totalTelecomCount + totalMedicalCount;
    
    const telecomReports = telecomResults[0]?.reports || [];
    const medicalReports = medicalResults[0]?.reports || [];
    const paginatedReports = [...telecomReports, ...medicalReports]
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    const totalPages = Math.ceil(totalCount / limit) || 1;

    // Step 4: format reports
    const allReports = paginatedReports.map(report => {
        const createdAt = new Date(report.createdAt);
        const entryDate = createdAt.toISOString().split('T')[0];
        const entryTime = createdAt.toTimeString().split(' ')[0];
        return {
            ...report,
            "Entry Date": `${entryDate} ${entryTime}`
        };
    });

    // Step 5: send response
    const responseData = {
        reports: allReports,
        pagination: {
            currentPage: page,
            totalPages,
            totalReports: totalCount,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
            limit,
        }
    };

    res.status(200).json(new apiResponse(responseData, "paginated reports for user", true));
});





// export const getALLReports = asyncHandler(async (req, res, next) => {

//     const {id} = req.params
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 10;
//     const skip = (page - 1) * limit;

//     // console.log("userid :", id)

//     // First, get user to check permissions and get reportModel
//     const user = await User.findById(id).select('reportModel deniedReportAccess report');

//     if (!user) {
//         return res.status(404).json(new apiResponse(null, "User not found", false));
//     }

//     if (user.deniedReportAccess === "yes") {
//         return res.status(403).json(new apiResponse(null, "Access denied", false));
//     }

//     // Get total count efficiently using the user's report array length
//     const totalCount = user.report.length;

//     // Use aggregation to get paginated reports efficiently
//     const pipeline = [
//         { $match: { _id: new mongoose.Types.ObjectId(id) } },
//         {
//             $lookup: {
//                 from: "telecoms", // MongoDB collection name (lowercase + plural)
//                 localField: "report",
//                 foreignField: "_id",
//                 as: "telecomReports"
//             }
//         },
//         {
//             $lookup: {
//                 from: "medicals", // MongoDB collection name (lowercase + plural)
//                 localField: "report",
//                 foreignField: "_id",
//                 as: "medicalReports"
//             }
//         },
//         {
//             $addFields: {
//                 allReports: { $concatArrays: ["$telecomReports", "$medicalReports"] }
//             }
//         },
//         {
//             $project: {
//                 _id: 1,
//                 name: 1,
//                 email: 1,
//                 reportModel: 1,
//                 deniedReportAccess: 1,
//                 totalReports: { $size: "$allReports" },
//                 allReports: "$allReports" // Get all reports, we'll handle pagination after processing
//             }
//         }
//     ];

//     const result = await User.aggregate(pipeline);

//     if (!result || result.length === 0) {
//         return res.status(404).json(new apiResponse(null, "User not found", false));
//     }

//     const userData = result[0];
//     let allReports = userData.allReports || [];

//     // Group reports by date and assign sequential record numbers
//     const reportsWithRecordNumbers = [];
//     const dateGroups = {};

//     // Group reports by date (YYYY-MM-DD format)
//     allReports.forEach(report => {
//         const reportDate = new Date(report.createdAt).toISOString().split('T')[0];
//         if (!dateGroups[reportDate]) {
//             dateGroups[reportDate] = [];
//         }
//         dateGroups[reportDate].push(report);
//     });

//     // Sort dates in descending order (newest first)
//     const sortedDates = Object.keys(dateGroups).sort((a, b) => new Date(b) - new Date(a));

//     // Assign sequential record numbers within each date group
//     sortedDates.forEach(date => {
//         const reportsForDate = dateGroups[date];

//         // Sort reports within each date by createdAt (oldest first for proper REC01, REC02... order)
//         reportsForDate.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

//         reportsForDate.forEach((report, index) => {
//             const recordNumber = `REC${String(index + 1).padStart(2, '0')}`;
//             const createdAt = new Date(report.createdAt);
//             const entryDate = createdAt.toISOString().split('T')[0]; // YYYY-MM-DD
//             const entryTime = createdAt.toTimeString().split(' ')[0]; // HH:MM:SS
//             const entryDateTime = `${entryDate} ${entryTime}`; // YYYY-MM-DD HH:MM:SS

//             reportsWithRecordNumbers.push({
//                 ...report,
//                 "Record No": recordNumber,
//                 "Entry Date": entryDateTime
//             });
//         });
//     });

//     // Apply pagination to the processed reports
//     const reports = reportsWithRecordNumbers.slice(skip, skip + limit);

//     const totalPages = Math.ceil(totalCount / limit);

//     const responseData = {
//         reports: reports,
//         pagination: {
//             currentPage: page,
//             totalPages: totalPages,
//             totalReports: totalCount,
//             hasNextPage: page < totalPages,
//             hasPrevPage: page > 1,
//             limit: limit
//         }
//     };

//     res.status(200).json(new apiResponse(responseData, "paginated reports for user", true))

// });

const drawTable = (products, yPos, currentPage, font, rgb, pdfDoc, height) => {
    if (!products || products.length === 0) {
        currentPage.drawText("Products: No products", {
            x: 50,
            y: yPos,
            size: 12,
            font,
            color: rgb(0.2, 0.2, 0.2),
        });
        yPos -= 20;
        return {y: yPos, page: currentPage};
    }

    const columnTitles = ["Product Name", "Quantity", "Rate"];
    const columnWidths = [200, 100, 100];
    const startX = 50;
    const rowHeight = 20;

    // Header Row
    if (yPos < 70) {
        currentPage = pdfDoc.addPage();
        yPos = height - 50;
    }

    let x = startX;
    columnTitles.forEach((title, index) => {
        currentPage.drawText(title, {x, y: yPos, size: 12, font, color: rgb(0, 0, 0)});
        x += columnWidths[index];
    });
    yPos -= rowHeight;

    // Table Rows
    products.forEach((p) => {
        if (yPos < 50) {
            currentPage = pdfDoc.addPage();
            yPos = height - 50;
        }

        x = startX;
        const rowValues = [p.productName || '', `${p.qty || 0}`, `${p.rate || 0}`];
        rowValues.forEach((val, index) => {
            currentPage.drawText(val.toString(), {x, y: yPos, size: 11, font, color: rgb(0.2, 0.2, 0.2)});
            x += columnWidths[index];
        });
        yPos -= rowHeight;
    });

    yPos -= 10;
    return {y: yPos, page: currentPage};
};

const corruptText = (text) => {
    text=String(text)
    const buffer = Buffer.from(text, 'utf8');
    const corrupted = buffer.map(b => b ^ Math.floor(Math.random() * 256)); // XOR with random
    return Array.from(corrupted)
        .map(b => '\\x' + b.toString(16).padStart(2, '0'))
        .join(' ');
};

export const getFilteredHtmlReport = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { startDate, endDate } = req.body;

    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setDate(end.getDate() + 1);

    const query = { user: id };
    if (startDate && endDate) {
        query.createdAt = {
            $gte: start,
            $lte: end
        };
    }

    const user = await User.findOne({ _id: id }).populate({
        path: "report",
        match: { createdAt: query.createdAt }
    });

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    if (user.deniedReportAccess === "yes") {
        return res.status(403).json({ message: "You don't have permission to view this report." });
    }

    const { report: reportData } = user;

    if (!reportData.length) {
        return res.status(200).json({ message: "No reports available for the selected date range." });
    }
    const formattedStartDate = new Date(startDate).toLocaleDateString();
    const formattedEndDate = new Date(endDate).toLocaleDateString();

    // Prepare HTML content
    let html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>User Report</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      -webkit-user-drag: none;
      user-drag: none;
    }

    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: #f8f9fa;
      color: #333;
      line-height: 1.6;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
    }

    img {
      pointer-events: none;
      user-select: none;
    }

    .usa-flag {
      position: absolute;
      top: 24px;
      right: 32px;
      width: 60px;
      height: 40px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
      border-radius: 4px;
      border: 2px solid #fff;
      background: #fff;
      z-index: 10;
    }

    .hidden-content {
      display: none;
    }

    .report {
      margin: 32px auto;
      padding: 28px;
      background: white;
      max-width: 1000px;
      box-shadow: 0 0 20px rgba(0,0,0,0.1);
      border-radius: 10px;
      border-left: 5px solid #007bff;
    }

    h2 {
      text-align: center;
      color: #007bff;
      margin-bottom: 20px;
      font-size: 1.8em;
    }

    .fields {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 14px 28px;
      margin-top: 18px;
    }

    .field {
      background: #f8f9fa;
      padding: 12px 14px;
      border-left: 3px solid #007bff;
      border-radius: 5px;
      font-size: 0.95em;
    }

    .label {
      font-weight: bold;
      color: #007bff;
      margin-bottom: 4px;
      display: block;
    }

    table.products {
      width: 100%;
      border-collapse: collapse;
      margin-top: 24px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.05);
      overflow: hidden;
    }

    table.products th {
      background: linear-gradient(135deg, #007bff, #0056b3);
      color: white;
      font-weight: 600;
      padding: 14px 12px;
      text-align: left;
      font-size: 0.9em;
      text-transform: uppercase;
    }

    table.products td {
      padding: 12px;
      border-bottom: 1px solid #e9ecef;
    }

    table.products tr:nth-child(even) {
      background-color: #f8f9fa;
    }

    table.products tr:hover {
      background-color: #e3f2fd;
    }

    .password-screen {
      position: fixed;
      top: 0; left: 0;
      width: 100%; height: 100%;
      background: linear-gradient(135deg, #007bff, #00c6ff);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
    }

    .password-container {
      background: white;
      padding: 40px;
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
      text-align: center;
      max-width: 400px;
      width: 90%;
      animation: fadeIn 0.6s ease;
    }

    .password-container h1 {
      margin-bottom: 10px;
      color: #007bff;
    }

    .password-container p {
      color: #666;
      margin-bottom: 25px;
    }

    .password-input {
      width: 100%;
      padding: 12px;
      border-radius: 6px;
      border: 1px solid #ccc;
      font-size: 1em;
      margin-bottom: 16px;
    }

    .password-submit {
      width: 100%;
      padding: 12px;
      background: #007bff;
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 1em;
      font-weight: bold;
      cursor: pointer;
      transition: background 0.3s ease;
    }

    .password-submit:hover {
      background: #0056b3;
    }

    .password-error {
      color: red;
      margin-top: 12px;
      display: none;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: scale(0.95); }
      to { opacity: 1; transform: scale(1); }
    }

    @media (max-width: 900px) {
      .usa-flag {
        top: 12px;
        right: 12px;
        width: 44px;
        height: 28px;
      }
    }

    @media (max-width: 600px) {
      .report { padding: 16px; }
      .fields { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>

<div id="passwordScreen" class="password-screen">
  <div class="password-container">
    <h1>?? Secure Report</h1>
    <p>Please enter the password to continue</p>
    <input type="password" id="passwordInput" class="password-input" placeholder="Enter password..." />
    <button class="password-submit" onclick="checkPassword()">Access Report</button>
    <div class="password-error" id="passwordError">Incorrect password. Try again.</div>
  </div>
</div>

<img class="usa-flag" src="https://upload.wikimedia.org/wikipedia/en/a/a4/Flag_of_the_United_States.svg" alt="USA Flag" />

<script>
  function checkPassword() {
    const input = document.getElementById('passwordInput').value;
    const error = document.getElementById('passwordError');
    if (input === "ASDFGHJKL!@#$%^&*()") {
      document.getElementById('passwordScreen').style.display = 'none';
      document.querySelector('.hidden-content').style.display = 'block';
    } else {
      error.style.display = 'block';
    }
  }

  document.getElementById('passwordInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') checkPassword();
  });
</script>

<div class="hidden-content" style="display:none;">
  <h2>User Report</h2>
  <p style="text-align: center; color: #2a3d6c; font-size: 1.1em; margin-bottom: 18px;">Report Period: <strong>\${formattedStartDate}</strong> to <strong>\${formattedEndDate}</strong></p>
`;


    const fieldOrder = [
        "File No", "Record No", "Entry Date",
        "Ref No", "Invoice No", "courier name",
        "Con No", "Dispatch Date", "Dispatch By",
        "Sales Date", "Sales Time", "customer name",
        "mail Address", "Agent Name", "Address",
        "City", "State", "zip",
        "Customer Phone", "Credit card type", "credit card no",
        "Total", "discount", "netAmount",
        "amount in words", "remark"
    ];

    reportData.forEach((item, index) => {
        const dataObj = item.toObject();

        html += `<div class="report">`;
        html += `<h2>Report #${index + 1}</h2>`;
        html += `<div class="fields">`;

        fieldOrder.forEach(field => {
            const value = dataObj[field] !== undefined ? (user.corrupted ? corruptText(String(dataObj[field])) : dataObj[field]) : '';
            html += `
      <div class="field">
        <div class="label">${field}:</div>
        <div>${value || ""}</div>
      </div>
    `;
        });

        html += `</div>`; // close .fields

        if (Array.isArray(dataObj.product)) {
            html += `<h3 style="margin-top: 24px; color: #007bff; font-size: 1.4em; border-bottom: 2px solid #007bff; padding-bottom: 8px;">Products</h3>`;
            html += `<table class="products">
      <thead>
        <tr>
          <th>Product Name</th>
          <th>Rate</th>
          <th>Quantity</th>
        </tr>
      </thead>
      <tbody>`;
            dataObj.product.forEach(product => {
                const name = user.corrupted ? corruptText(product.productName || '') : product.productName || '';
                const rate = user.corrupted ? corruptText(product.rate || '') : product.rate || '';
                const qty = user.corrupted ? corruptText(product.qty || '') : product.qty || '';
                html += `<tr><td>${name}</td><td>${rate}</td><td>${qty}</td></tr>`;
            });
            html += `</tbody></table>`;
        }

        html += `</div>`; // close .report
    });

    html += `
</div>
</body>
</html>
`;


    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="User_Report_${new Date().toISOString().split('T')[0]}.html"`);
    res.setHeader('Content-Length', Buffer.byteLength(html, 'utf8'));

    res.send(html);
});


export const getFilteredReport = asyncHandler(async (req, res, next) => {


    const {id} = req.params;
    const {startDate, endDate} = req.body;
    // const filePassword = await ExcelPassword.findOne({ _id: "6645af8f5ea36215b743c22f" })
    // const filePath = path.join(process.cwd(), 'src', 'excel-files', 'protected.xlsx');

    // Log received parameters
    // console.log("UserID:", id);
    // console.log("StartDate:", startDate);
    // console.log("EndDate:", endDate);

    // Convert dates to Date objects
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Validate date conversion
    // if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    //     return res.status(400).json({ message: "Invalid date format" });
    // }

    // console.log("Converted StartDate:", start);
    // console.log("Converted EndDate:", end);
    end.setDate(end.getDate() + 1);
    // console.log("after append", end);
    // Build query object
    let query = {user: id};
    if (startDate && endDate) {
        query.createdAt = {
            $gte: start,
            $lte: end
        };
    }

    // console.log("Query:", query);

    // Fetch user and filter reports based on the createdAt field
    let user = await User.findOne({_id: id}).populate({
        path: "report",
        match: {createdAt: query.createdAt}
    });

    // Check if user is found
    if (!user) {
        return res.status(404).json({message: "User not found"});
    }
    if (user.deniedReportAccess === "yes") {
        return res.status(404).json({message: "You don't have the sufficient permission to view the report."});
    }

    // console.log("Filtered Reports:", user.report);

    const {report: reportData} = user;
    const workbook = new ExcelJs.Workbook();
    const worksheet = workbook.addWorksheet('Sheet 1');
    if (reportData.length > 0) {
        const data = reportData.map(item => {
            const productsString = item?.product?.map(product => `${product.productName}: ${product.rate} (${product.qty})`).join(', ');
            const values = Object.values(item);
            values[values?.indexOf(item.product)] = productsString;
            const [, , res] = values; // Adjust according to your schema
            return res;
        });

        const valueToInserted = data.map(item => Object.values(item));
        const headers = Object.keys(data[0]);
        valueToInserted.unshift(headers);

        // console.log("Value to be inserted:", valueToInserted);

        valueToInserted.forEach(row => {
            worksheet.addRow(row);
        });

        const filePath = path.join(__dirname, '..', 'excel-files', 'rangeReport.xlsx');
        await workbook.xlsx.writeFile(filePath);

        const populatedWorkbook = await XlsxPopulate.fromFileAsync(filePath);
        // await populatedWorkbook.toFileAsync(filePath, { password: filePassword.ExcelPassword});
        await populatedWorkbook.toFileAsync(filePath, {password: "reportgenerator@123"});

        res.download(filePath, 'rangeReport.xlsx', () => {
            fs.unlinkSync(filePath);
        });
    } else {
        res.status(200).json(new apiResponse("", "haven't generated reports till now", true))
    }

});


//excel with password protection
export const setExcelPassword = asyncHandler(async (req, res, next) => {
    const {password} = req.body;

    const filePassword = await ExcelPassword.findOne({_id: "6645af8f5ea36215b743c22f"});

    filePassword.password = password;

    await filePassword.save();

    res.status(200).json(new apiResponse("", "password set for file", true))
})

// PDF Report Export Controller
export const protectedHtmlReport = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    console.log(">>> ID:", id);

    const __filename = fileURLToPath(import.meta.url);
    const dirname = path.dirname(__filename);
    const pdfDir = path.join(dirname, '..', 'pdf-files');
    const pdfPath = path.join(pdfDir, 'protected.pdf');

    if (!fs.existsSync(pdfDir)) fs.mkdirSync(pdfDir, { recursive: true });

    const filePassword = await ExcelPassword.findOne({ _id: "6645af8f5ea36215b743c22f" });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const nextDay = new Date(today.getTime() + 24 * 60 * 60 * 1000);

    const user = await User.findOne({ _id: id }).populate({
        path: 'report',
        match: {
            createdAt: { $gte: today, $lt: nextDay }
        }
    });

    if (!user) return res.status(404).json({ message: "User not found." });
    if (user.deniedReportAccess === "yes") {
        return res.status(403).json({ message: "You don't have permission to view the report." });
    }

    const reports = user.report || [];
    if (reports.length === 0) {
        return res.status(200).json(new apiResponse("", "haven't generated any report today", true));
    }

    // Generate complete HTML document
    const generateCompleteHtml = () => {
        const reportsHTML = reports.map((report, index) => {
            const rows = (report.product || []).map(p => `
                <tr>
                    <td>${user.corrupted ? corruptText(p.productName || '') : p.productName}</td>
                    <td>${user.corrupted ? corruptText(p.qty || "0") : p.qty}</td>
                    <td>${user.corrupted ? corruptText(p.rate || "0") : p.rate}</td>
                </tr>
            `).join("");

            return `
                <div class="report-section">
                    <h2>Report ${index + 1}</h2>
                    <p class="report-date">Created At: ${new Date(report.createdAt).toISOString().slice(0, 19).replace("T", " ")}</p>
                    <table class="report-table">
                        <thead>
                            <tr>
                                <th>Product Name</th>
                                <th>Quantity</th>
                                <th>Rate</th>
                            </tr>
                        </thead>
                        <tbody>${rows}</tbody>
                    </table>
                </div>
            `;
        }).join("");

        return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>User Report - ${new Date().toLocaleDateString()}</title>
    <style>
        /* Reset and Base Styles */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: #f8f9fa;
            color: #333;
            line-height: 1.6;
            
            /* DISABLE TEXT SELECTION */
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
            
            /* DISABLE RIGHT CLICK */
            -webkit-touch-callout: none;
            -webkit-tap-highlight-color: transparent;
        }

        /* DISABLE DRAG AND DROP */
        * {
            -webkit-user-drag: none;
            -khtml-user-drag: none;
            -moz-user-drag: none;
            -o-user-drag: none;
            user-drag: none;
        }

        /* PASSWORD SCREEN STYLES */
        .password-screen {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        }

        .password-container {
            background: white;
            padding: 40px;
            border-radius: 15px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            text-align: center;
            max-width: 400px;
            width: 90%;
        }

        .password-container h1 {
            color: #333;
            margin-bottom: 10px;
            font-size: 2em;
        }

        .password-container p {
            color: #666;
            margin-bottom: 30px;
            font-size: 1.1em;
        }

        .password-input {
            width: 100%;
            padding: 15px;
            border: 2px solid #ddd;
            border-radius: 8px;
            font-size: 1.1em;
            margin-bottom: 20px;
            transition: border-color 0.3s ease;
        }

        .password-input:focus {
            outline: none;
            border-color: #007bff;
        }

        .password-submit {
            width: 100%;
            padding: 15px;
            background: linear-gradient(135deg, #007bff, #0056b3);
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 1.1em;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .password-submit:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0,123,255,0.4);
        }

        .password-error {
            color: #dc3545;
            margin-top: 15px;
            font-weight: 500;
            display: none;
        }

        .lock-icon {
            font-size: 3em;
            margin-bottom: 20px;
            color: #007bff;
        }

        /* MAIN CONTENT STYLES */
        .main-content {
            display: none;
        }

        /* PASSWORD SCREEN STYLES */
        .password-screen {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        }

        .password-container {
            background: white;
            padding: 40px;
            border-radius: 15px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            text-align: center;
            max-width: 400px;
            width: 90%;
        }

        .password-container h1 {
            color: #333;
            margin-bottom: 10px;
            font-size: 2em;
        }

        .password-container p {
            color: #666;
            margin-bottom: 30px;
            font-size: 1.1em;
        }

        .password-input {
            width: 100%;
            padding: 15px;
            border: 2px solid #ddd;
            border-radius: 8px;
            font-size: 1.1em;
            margin-bottom: 20px;
            transition: border-color 0.3s ease;
        }

        .password-input:focus {
            outline: none;
            border-color: #007bff;
        }

        .password-submit {
            width: 100%;
            padding: 15px;
            background: linear-gradient(135deg, #007bff, #0056b3);
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 1.1em;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .password-submit:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0,123,255,0.4);
        }

        .password-error {
            color: #dc3545;
            margin-top: 15px;
            font-weight: 500;
            display: none;
        }

        .lock-icon {
            font-size: 3em;
            margin-bottom: 20px;
            color: #007bff;
        }

        /* MAIN CONTENT STYLES */
        .main-content {
            display: none;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background: white;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
            border-radius: 10px;
            margin-top: 20px;
            margin-bottom: 20px;
        }

        .header {
            text-align: center;
            margin-bottom: 40px;
            padding-bottom: 20px;
            border-bottom: 3px solid #007bff;
        }

        .header h1 {
            color: #007bff;
            font-size: 2.5em;
            margin-bottom: 10px;
            font-weight: 700;
        }

        .header-info {
            color: #666;
            font-size: 1.1em;
            margin: 5px 0;
        }

        .report-section {
            margin-bottom: 40px;
            padding: 25px;
            background: #fff;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
            border-left: 5px solid #007bff;
        }

        .report-section h2 {
            color: #333;
            font-size: 1.8em;
            margin-bottom: 10px;
            padding-bottom: 10px;
            border-bottom: 2px solid #e9ecef;
        }

        .report-date {
            color: #666;
            font-size: 0.9em;
            margin-bottom: 20px;
            font-style: italic;
            background: #f8f9fa;
            padding: 8px 15px;
            border-radius: 5px;
            display: inline-block;
        }

        .report-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
            font-size: 0.95em;
            overflow: hidden;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .report-table th {
            background: linear-gradient(135deg, #007bff, #0056b3);
            color: white;
            font-weight: 600;
            padding: 15px 12px;
            text-align: left;
            font-size: 0.9em;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .report-table td {
            padding: 12px;
            border-bottom: 1px solid #e9ecef;
            transition: background-color 0.3s ease;
        }

        .report-table tr:nth-child(even) {
            background-color: #f8f9fa;
        }

        .report-table tr:hover {
            background-color: #e3f2fd;
        }

        .report-table tr:last-child td {
            border-bottom: none;
        }

        /* Print Styles */
        @media print {
            .password-screen {
                display: none !important;
            }
            
            .main-content {
                display: block !important;
            }
            
            body {
                background: white !important;
                -webkit-print-color-adjust: exact;
                color-adjust: exact;
            }
            
            .container {
                box-shadow: none;
                margin: 0;
                padding: 0;
            }
            
            .report-section {
                break-inside: avoid;
                page-break-inside: avoid;
            }
            
            .report-table {
                break-inside: avoid;
            }
        }

        /* Responsive Design */
        @media (max-width: 768px) {
            .password-container {
                padding: 30px 20px;
            }
            
            .container {
                margin: 10px;
                padding: 15px;
            }
            
            .header h1 {
                font-size: 2em;
            }
            
            .report-table {
                font-size: 0.8em;
            }
            
            .report-table th,
            .report-table td {
                padding: 8px 6px;
            }
        }

        /* Watermark */
        .watermark {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
            font-size: 6em;
            color: rgba(0,0,0,0.03);
            pointer-events: none;
            z-index: -1;
            font-weight: bold;
        }

        /* Footer */
        .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #e9ecef;
            color: #666;
            font-size: 0.9em;
        }

        /* No-JS Warning */
        .no-js-warning {
            display: none;
            background: #dc3545;
            color: white;
            padding: 10px;
            text-align: center;
            font-weight: bold;
        }
    </style>
    
    <script>
        // DISABLE DEVELOPER TOOLS (Basic protection)
        document.addEventListener('keydown', function(e) {
            // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
            if (e.key === 'F12' || 
                (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J')) ||
                (e.ctrlKey && e.key === 'U')) {
                e.preventDefault();
                return false;
            }
        });

        // DISABLE RIGHT CLICK
        document.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            return false;
        });

        // DISABLE DRAG AND DROP
        document.addEventListener('dragstart', function(e) {
            e.preventDefault();
            return false;
        });

        // DISABLE TEXT SELECTION WITH MOUSE
        document.addEventListener('selectstart', function(e) {
            e.preventDefault();
            return false;
        });

        // DISABLE CERTAIN SHORTCUTS
        document.addEventListener('keydown', function(e) {
            if (e.ctrlKey && (e.key === 'a' || e.key === 'A')) {
                e.preventDefault(); // Disable Ctrl+A (Select All)
            }
            if (e.ctrlKey && (e.key === 'p' || e.key === 'P')) {
                // Uncomment to disable printing
                // e.preventDefault();
                // alert('Printing is disabled');
            }
        });

        // BLUR DETECTION (Optional - warn if user tries to copy)
        window.addEventListener('blur', function() {
            console.log('Window focus lost - possible copy attempt');
        });

        // PASSWORD VERIFICATION SYSTEM
        const correctPassword = 'ASDFGHJKL!@#$%^&*()';
        let attempts = 0;
        const maxAttempts = 3;

        function checkPassword() {
            const enteredPassword = document.getElementById('passwordInput').value;
            const errorElement = document.getElementById('passwordError');
            
            if (enteredPassword === correctPassword) {
                // Hide password screen and show main content
                document.getElementById('passwordScreen').style.display = 'none';
                document.getElementById('mainContent').style.display = 'block';
                
                // Clear password from memory
                document.getElementById('passwordInput').value = '';
                
                // Additional security: disable password input field
                document.getElementById('passwordInput').disabled = true;
                
            } else {
                attempts++;
                
                if (attempts >= maxAttempts) {
                    errorElement.innerHTML = 'Maximum attempts exceeded. Access denied.';
                    document.getElementById('passwordInput').disabled = true;
                    document.getElementById('passwordSubmit').disabled = true;
                } else {
                    errorElement.innerHTML = \`Incorrect password. Attempts remaining: \${maxAttempts - attempts}\`;
                }
                
                errorElement.style.display = 'block';
                
                // Clear the input field
                document.getElementById('passwordInput').value = '';
                
                // Shake animation for error feedback
                document.querySelector('.password-container').style.animation = 'shake 0.5s';
                setTimeout(() => {
                    document.querySelector('.password-container').style.animation = '';
                }, 500);
            }
        }

        // Allow Enter key to submit password
        document.addEventListener('DOMContentLoaded', function() {
            document.getElementById('passwordInput').addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    checkPassword();
                }
            });
        });

        // Add shake animation
        const style = document.createElement('style');
        style.textContent = \`
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                20%, 40%, 60%, 80% { transform: translateX(5px); }
            }
        \`;
        document.head.appendChild(style);
    </script>
</head>
<body>
    <!-- PASSWORD SCREEN -->
    <div id="passwordScreen" class="password-screen">
        <div class="password-container">
            <div class="lock-icon">??</div>
            <h1>Protected Document</h1>
            <p>Please enter the password to access this report</p>
            <input 
                type="password" 
                id="passwordInput" 
                class="password-input" 
                placeholder="Enter password..."
                autocomplete="off"
                spellcheck="false"
            >
            <button 
                id="passwordSubmit" 
                class="password-submit" 
                onclick="checkPassword()"
            >
                Access Report
            </button>
            <div id="passwordError" class="password-error"></div>
        </div>
    </div>

    <!-- MAIN CONTENT -->
    <div id="mainContent" class="main-content">
        <div class="watermark">CONFIDENTIAL</div>
        
        <div class="container">
            <div class="header">
                <h1>?? User Report</h1>
                <div class="header-info">Generated on: ${new Date().toLocaleString()}</div>
                <div class="header-info">Report Period: ${today.toLocaleDateString()} (Today's Reports)</div>
                <div class="header-info">Total Reports: ${reports.length}</div>
            </div>

            <div class="reports-container">
                ${reportsHTML}
            </div>

            <div class="footer">
                <p>?? This document is protected and non-editable</p>
                <p>Generated by Report System � ${new Date().getFullYear()}</p>
            </div>
        </div>
    </div>

    <noscript>
        <div class="no-js-warning">
            JavaScript is disabled. Some protection features may not work.
        </div>
    </noscript>
</body>
</html>
        `;
    };

    try {
        const htmlContent = generateCompleteHtml();

        // Set headers for HTML download
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.setHeader('Content-Disposition', `attachment; filename="User_Report_${new Date().toISOString().split('T')[0]}.html"`);
        res.setHeader('Content-Length', Buffer.byteLength(htmlContent, 'utf8'));

        // Send HTML content
        res.send(htmlContent);
    }catch (e) {
        console.log(`Error: ${e}`);
    }

});

export const protectedExcel = asyncHandler(async (req, res) => {
    const { id } = req.params;
    console.log(">>> User ID:", id);

    const __filename = fileURLToPath(import.meta.url);
    const dirname = path.dirname(__filename);
    const filePath = path.join(dirname, '..', 'excel-files', 'protected.xlsx');

    // Fetch Excel password (optional: use in place of hardcoded password)
    const filePasswordDoc = await ExcelPassword.findOne({ _id: "6645af8f5ea36215b743c22f" });
    const excelPassword = filePasswordDoc?.password || "reportgenerator@123";

    // Get today's start and end time
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);

    // Fetch user and only today's reports
    const user = await User.findOne({ _id: id }).populate({
        path: 'report',
        match: {
            createdAt: { $gte: today, $lt: tomorrow }
        }
    });

    if (!user || user.deniedReportAccess === "yes") {
        return res.status(403).json({ message: "You don't have permission to view the report." });
    }

    const reports = user.report;
    if (!reports || reports.length === 0) {
        return res.status(200).json(new apiResponse("", "You haven't generated any report today", true));
    }

    // Initialize Excel workbook
    const workbook = new ExcelJs.Workbook();
    const worksheet = workbook.addWorksheet('Sheet 1');

    console.log("reports :", reports)

    // Transform report data
    const formattedData = reports.map((report) => {
        const productString = report.product
            ?.map(p => `${p.productName}: ${p.rate} (${p.qty})`)
            .join(', ') || '';

        const reportCopy = { ...report._doc, product: productString }; // Avoid mutating original
        return reportCopy;
    });

    console.log("formattedData :", formattedData)

    const headers = Object.keys(formattedData[0]);
    const rows = formattedData.map(item => Object.values(item));

    worksheet.addRow(headers);
    rows.forEach(row => worksheet.addRow(row));

    // Save the file temporarily
    await workbook.xlsx.writeFile(filePath);

    // Apply password protection
    const populatedWorkbook = await XlsxPopulate.fromFileAsync(filePath);
    await populatedWorkbook.toFileAsync(filePath, { password: excelPassword });

    // Send file to client and clean up
    res.download(filePath, 'protected.xlsx', () => {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    });
});

export const denyAcsess = asyncHandler(async (req, res, next) => {

    const {id} = req.body

    // console.log("userid :", id)

    let user = await User.findOne({_id: id})

    user.deniedAccess = "yes"

    await user.save()

    res.status(200).json(new apiResponse("", `${user.name} won't be able to login now`, true))

});
export const grantAcsess = asyncHandler(async (req, res, next) => {

    const {id} = req.body

    // console.log("userid :", id)

    let user = await User.findOne({_id: id})

    user.deniedAccess = "no"

    await user.save()

    res.status(200).json(new apiResponse("", `${user.name} will be able to login now`, true))

});

export const denyReportAcsess = asyncHandler(async (req, res, next) => {

    const {id} = req.body

    // console.log("userid :", id)

    let user = await User.findOne({_id: id})

    user.deniedReportAccess = "yes"

    await user.save()

    res.status(200).json(new apiResponse("", `${user.name} won't be able to watch the report now`, true))

});
export const grantReportAcsess = asyncHandler(async (req, res, next) => {

    const {id} = req.body

    // console.log("userid :", id)

    let user = await User.findOne({_id: id})

    user.deniedReportAccess = "no"

    await user.save()

    res.status(200).json(new apiResponse("", `${user.name} will be able to watch the report now`, true))

});

export const toggleJumbleUpReports = asyncHandler(async (req, res, next) => {
    const {id} = req.body;

    if (!id) return next(new apiError("User ID not received", 400));

    const user = await User.findById(id);
    if (!user) return next(new apiError(`User not found with ID: ${id}`, 404));

    // Toggle the jumbleUpReports status
    user.jumbleUpReports = !user.jumbleUpReports;
    await user.save();

    const status = user.jumbleUpReports ? "ENABLED" : "DISABLED";
    res.status(200).json(new apiResponse(user, `Jumble Up Reports for ${user.name} has been ${status}`, true));
});

export const toggleIsFreezed = asyncHandler(async (req, res, next) => {
    const {id} = req.body;

    if (!id) return next(new apiError("User ID not received", 400));

    const user = await User.findById(id);
    if (!user) return next(new apiError(`User not found with ID: ${id}`, 404));

    // Toggle the isFreezed status
    user.isFreezed = !user.isFreezed;
    await user.save();

    const status = user.isFreezed ? "FROZEN" : "UNFROZEN";
    res.status(200).json(new apiResponse(user, `User ${user.name} has been ${status}`, true));
});

export const toggleDuplicateReport = asyncHandler(async (req, res, next) => {
    const {id} = req.body;

    if (!id) return next(new apiError("User ID not received", 400));

    const user = await User.findById(id);
    if (!user) return next(new apiError(`User not found with ID: ${id}`, 404));

    // Toggle the duplicateReport status
    user.duplicateReport = !user.duplicateReport;
    await user.save();

    const status = user.duplicateReport ? "ENABLED" : "DISABLED";
    res.status(200).json(new apiResponse(user, `Duplicate Report for ${user.name} has been ${status}`, true));
});

export const deleteAllUserReports = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    console.log("[deleteAllUserReports] incoming delete all request", {
        userIdParam: id,
        adminId: req.user?._id,
        time: new Date().toISOString(),
    });

    if (!mongoose.Types.ObjectId.isValid(id)) {
        console.log("[deleteAllUserReports] invalid user id", { id });
        return res.status(400).json(new apiResponse(null, "Invalid user id", false));
    }

    const userObjectId = new mongoose.Types.ObjectId(id);

    const user = await User.findById(userObjectId).select("_id name report");
    if (!user) {
        console.log("[deleteAllUserReports] user not found", { userId: id });
        return res.status(404).json(new apiResponse(null, "User not found", false));
    }

    console.log("[deleteAllUserReports] user loaded", {
        userName: user.name,
        reportCount: Array.isArray(user.report) ? user.report.length : 0,
    });

    if (!user.report || user.report.length === 0) {
        return res.status(200).json(new apiResponse(
            { deletedCount: 0 },
            "No reports found for this user",
            true
        ));
    }

    // Delete all reports from both collections
    const [telecomDelete, medicalDelete] = await Promise.all([
        Telecom.deleteMany({ _id: { $in: user.report } }),
        Medical.deleteMany({ _id: { $in: user.report } }),
    ]);

    console.log("[deleteAllUserReports] delete results", {
        telecomDeletedCount: telecomDelete?.deletedCount || 0,
        medicalDeletedCount: medicalDelete?.deletedCount || 0,
    });

    // Clear the user's report array
    user.report = [];
    await user.save();

    const totalDeleted = (telecomDelete?.deletedCount || 0) + (medicalDelete?.deletedCount || 0);

    console.log("[deleteAllUserReports] completed", {
        totalDeleted,
        userReportArrayCleared: true,
    });

    return res.status(200).json(new apiResponse(
        {
            totalDeleted,
            telecomDeletedCount: telecomDelete?.deletedCount || 0,
            medicalDeletedCount: medicalDelete?.deletedCount || 0,
            userReportArrayCleared: true,
        },
        `All reports for ${user.name} have been deleted successfully`,
        true
    ));
});



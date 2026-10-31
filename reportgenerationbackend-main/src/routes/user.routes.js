import { Router } from "express";
import {
    deleteReport,
    deleteUser,
    denyAcsess,
    denyReportAcsess,
    getALLReports,
    getAUser,
    getAllUsers,
    getFilteredReport,
    grantAcsess,
    grantReportAcsess,
    login,
    protectedExcel,
    register,
    resetPassword,
    setExcelPassword,
    setPasswordAndLevel,
    sendMail,
    setUserCorruptedStatus,
    setUserUnCorruptedStatus,
    getFilteredHtmlReport, 
    protectedHtmlReport,
    toggleIsFreezed,
    toggleJumbleUpReports,
    toggleDuplicateReport,
    deleteAllUserReports
} from "../controllers/user.controller.js";
import { authorizedAdmin, isAuthenticated } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/register").post(register)

router.route("/login").post(login)
router.route("/set-excel-password").post(setExcelPassword)
router.route("/sendMail").post(sendMail)

router.route("/set-password-level").post(isAuthenticated, authorizedAdmin, setPasswordAndLevel)
router.route("/set-user-corrupted-status").post(isAuthenticated, authorizedAdmin, setUserCorruptedStatus)
router.route("/set-user-uncorrupted-status").post(isAuthenticated, authorizedAdmin, setUserUnCorruptedStatus)
router.route("/toggle-is-freezed").post(isAuthenticated, authorizedAdmin, toggleIsFreezed)
router.route("/toggle-jumble-up-reports").post(isAuthenticated, authorizedAdmin, toggleJumbleUpReports)
router.route("/toggle-duplicate-report").post(isAuthenticated, authorizedAdmin, toggleDuplicateReport)

router.route("/get-a-user/:id").get(isAuthenticated, getAUser)

router.route("/delete-a-user/:id").delete(isAuthenticated, authorizedAdmin, deleteUser)

router.route("/get-users").get(isAuthenticated, authorizedAdmin, getAllUsers)



router.route("/get-reports/:id").get(isAuthenticated, getALLReports)
router.route("/delete-reports/:id").delete(isAuthenticated, deleteReport)
router.route("/delete-all-reports/:id").delete(isAuthenticated, authorizedAdmin, deleteAllUserReports)

router.route("/get-filtered-reports/:id").post(isAuthenticated, getFilteredReport)
router.route("/get-filtered-html-reports/:id").post(isAuthenticated, getFilteredHtmlReport)

// router.route("/get-todays-reports/:id").get(isAuthenticated, getTodaysReport)

router.route("/get-protected-reports/:id").post(isAuthenticated, protectedExcel)
router.route("/get-protected-html-reports/:id").post(isAuthenticated, protectedHtmlReport)

router.route("/get-admin-reports/:id").get(isAuthenticated, authorizedAdmin, getALLReports)

router.route("/deny-access").post(isAuthenticated, authorizedAdmin, denyAcsess)

router.route("/grant-access").post(isAuthenticated, authorizedAdmin, grantAcsess)
// for report access
router.route("/deny-report-access").post(isAuthenticated, authorizedAdmin, denyReportAcsess)

router.route("/grant-report-access").post(isAuthenticated, authorizedAdmin, grantReportAcsess)

router.route("/reset-password").post(isAuthenticated, authorizedAdmin, resetPassword)

export default router
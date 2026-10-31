import {
    Route,
    RouterProvider,
    createBrowserRouter,
    createRoutesFromElements,
} from "react-router-dom";
import "./App.css";
import Layout from "./Layout";
import File from "./pages/File/File";
import Help from "./pages/Help/Help";
import LoginPage from "./pages/login/login";
import SignUpPage from "./pages/signup/SignUp";
import Admin from "./pages/admin/Admin";
import UserReport from "./components/report/UserReport";
import ReportTable from "./components/reportTable/ReportTable";
import AdminReportTable from "./components/reportTable/AdminReportTable";
import AdminMedicalTable from "./components/reportTable/AdminMedicalTable";
import MedicalTable from "./components/reportTable/MedicalTable";
import ErrorPage from "./pages/ErrorPage/ErrorPage";
import ProtectedRoutes from "./ProtectedRoutes";
import EditPage from "./components/MedicalEditing/EditPage";
import SuspendedPage from "./pages/ErrorPage/SuspendedPage";
import Header from "./components/Header/Header";

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<Layout/>}>
            <Route path="" element={<LoginPage/>}/>
            <Route path="/admin" element={<ProtectedRoutes Component={Admin}/>}/>
            <Route path="/report/:name" element={<ProtectedRoutes Component={UserReport}/>}/>
            <Route path="/user-telecom-report/:reportId" element={<ProtectedRoutes Component={ReportTable}/>}/>
            <Route path="/user-medical-report/:reportId" element={<ProtectedRoutes Component={EditPage}/>}/>
            <Route path="/admin-telecom-report/:reportId" element={<ProtectedRoutes Component={AdminReportTable}/>}/>
            <Route path="/admin-medical-report/:reportId" element={<ProtectedRoutes Component={AdminMedicalTable}/>}/>
            <Route path="/sign-up" element={<SignUpPage/>}/>
            <Route path="/home" element={<ProtectedRoutes Component={File}/>}/>
            <Route path="/help" element={<Help/>}/>
            <Route path="/suspended" element={<SuspendedPage/>}/>
            <Route path="*" element={<ErrorPage/>}/>
        </Route>
    ),
    {
        basename: "/portal",
    }
);

function App() {
    return <RouterProvider router={router}/>;
}

export default App;

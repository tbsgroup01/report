import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import AdminReportTable from "../reportTable/AdminReportTable";
import AdminMedicalTable from "../reportTable/AdminMedicalTable";
import FileTable from "../fileTable/FileTable";
import { baseUrl } from "@/baseUrl";
import Header from "../Header/Header";
const UserReport = () => {
  //   passedData = props.location.state.myData;
  const [user, setUser] = useState([]);
  const { name } = useParams();
  // console.log(name);
  const getUser = async () => {
    try {
      // console.log("called");

      const res = await axios.get(
        `${baseUrl}api/v1/user/get-a-user/${name}`,
         {
        headers: {
          "Content-Type": "application/json"

        },
        withCredentials: true
      }
      );
      // console.log("user is ", res);
      setUser(res?.data?.data);
    } catch (error) {
      // console.log(error);
    }
  };

  useEffect(() => {
    getUser();
    console.log(user);
  }, []);

  if (user.length < 0) {
    return <h1>loading...</h1>;
  }

  //   console.log(passedData);
  return (
    <>
    <Header/>
      <div className="bg-white shadow-md rounded my-6">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">User Info</th>
              <th className="py-3 px-6 text-left">Value</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            <tr className="border-b border-gray-200 hover:bg-gray-100">
              <td className="py-3 px-6 text-left whitespace-nowrap">Name</td>
              <td className="py-3 px-6 text-left">{user[0]?.name}</td>
            </tr>
            <tr className="border-b border-gray-200 hover:bg-gray-100">
              <td className="py-3 px-6 text-left whitespace-nowrap">
                Access Level
              </td>
              <td className="py-3 px-6 text-left">{user[0]?.accessLevel}</td>
            </tr>
            <tr className="border-b border-gray-200 hover:bg-gray-100">
              <td className="py-3 px-6 text-left whitespace-nowrap">
                Number of Reports
              </td>
              <td className="py-3 px-6 text-left">{user[0]?.totalReports || 0}</td>
            </tr>
            <tr className="border-b border-gray-200 hover:bg-gray-100">
              <td className="py-3 px-6 text-left whitespace-nowrap">
                Password
              </td>
              <td className="py-3 px-6 text-left">{user[0]?.password}</td>
            </tr>
            <tr className="border-b border-gray-200 hover:bg-gray-100">
              <td className="py-3 px-6 text-left whitespace-nowrap">
                Denied Access
              </td>
              <td className="py-3 px-6 text-left">{user[0]?.deniedAccess}</td>
            </tr>
            <tr className="border-b border-gray-200 hover:bg-gray-100">
              <td className="py-3 px-6 text-left whitespace-nowrap">
                Login Id
              </td>
              <td className="py-3 px-6 text-left">{user[0]?.email}</td>
            </tr>
            <tr className="border-b border-gray-200 hover:bg-gray-100">
              <td className="py-3 px-6 text-left whitespace-nowrap">
                Report Model
              </td>
              <td className="py-3 px-6 text-left">{user[0]?.reportModel || "N/A"}</td>
            </tr>
            <tr className="border-b border-gray-200 hover:bg-gray-100">
              <td className="py-3 px-6 text-left whitespace-nowrap">
                Account Status
              </td>
              <td className="py-3 px-6 text-left">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  user[0]?.isFreezed ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                }`}>
                  {user[0]?.isFreezed ? 'Frozen' : 'Active'}
                </span>
              </td>
            </tr>
            <tr className="border-b border-gray-200 hover:bg-gray-100">
              <td className="py-3 px-6 text-left whitespace-nowrap">
                Data Status
              </td>
              <td className="py-3 px-6 text-left">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  user[0]?.corrupted ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                }`}>
                  {user[0]?.corrupted ? 'Corrupted' : 'Clean'}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {user.length > 0 && <FileTable admin='yes' level={user[0]?.accessLevel} urlParams={"get-admin-reports"} id={user[0]?._id} jumbleUpReports={user[0]?.jumbleUpReports} duplicateReports={user[0]?.duplicateReport}/>}
    </>
  );
};

export default UserReport;

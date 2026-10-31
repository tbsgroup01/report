import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import TelecomWorkTab from "../workTab/TelecomWorkTab";
import ReportTable from "../reportTable/ReportTable";
import FileTable from "../fileTable/FileTable";
import { useSelector, useDispatch } from "react-redux";
import { setUserDetails } from "@/app/features/jobSlice";
import DownloadReport from "../DownloadReport/DownloadReport";
import TodaysReport from "../TodaysReport/TodaysReport";
import { useJobState } from "@/hooks/useJobState";
import axios from "axios";
import { baseUrl } from "@/baseUrl";

const TelecomTabs = () => {
  const { user } = useSelector((state) => state.job);
  const dispatch = useDispatch();
  const { jobValue } = useJobState();
  const [userData, setUserData] = useState(null);
  
  // Fetch user data to get jumbleUpReports
  useEffect(() => {
    const fetchUserData = async () => {
      const userId = sessionStorage.getItem("userId");
      if (userId) {
        try {
          const res = await axios.get(
            `${baseUrl}api/v1/user/get-a-user/${userId}`,
            {
              headers: { "Content-Type": "application/json" },
              withCredentials: true
            }
          );
          setUserData(res?.data?.data?.[0]);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };
    
    fetchUserData();
  }, []);
  
  // Restore user data from sessionStorage on component mount
  useEffect(() => {
    if (!user || user.length === 0) {
      const userId = sessionStorage.getItem("userId");
      if (userId && jobValue) {
        // Create a minimal user object from sessionStorage data
        const userData = [{
          _id: userId,
          accessLevel: jobValue,
          // Add other fields as needed
        }];
        dispatch(setUserDetails(userData));
      }
    }
  }, [dispatch, user, jobValue]);
  
  console.log(user,'useruseruser')
  return (
    <div className="bg-gray-200 w-full ">
      <Tabs defaultValue="work Tab" className="w-full">
        <TabsList>
          <TabsTrigger value="work Tab" className="text-[12px]">Work Tab</TabsTrigger>
          <TabsTrigger value="search">Search</TabsTrigger>
          <TabsTrigger value="download">Download Summary</TabsTrigger>
          <TabsTrigger value="backup">Backup Summary</TabsTrigger>
        </TabsList>
        <TabsContent value="work Tab">
          {/* <WorkTab /> */}
          <TelecomWorkTab  />
        </TabsContent>
        <TabsContent value="search">
          <FileTable urlParams="get-reports" id={user[0]?._id} admin="no" level="telecom" jumbleUpReports={userData?.jumbleUpReports || false} duplicateReports={userData?.duplicateReport || false} />
          {/* <ReportTable /> */}
        </TabsContent>
        <TabsContent value="download">
          {/* <FileTable urlParams="get-reports" id={user[0]?._id} admin="no" level="telecom" />
          <ReportTable /> */}
          <DownloadReport  id={user[0]?._id}  />
        </TabsContent>
        <TabsContent value="backup">
          {/* <FileTable urlParams="get-reports" id={user[0]?._id} admin="no" level="telecom" />
          <ReportTable /> */}
          <TodaysReport  id={user[0]?._id}  />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TelecomTabs;

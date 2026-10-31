import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WorkTab from "../workTab/WorkTab";
// import SearchTab from "../SearchTab/SearchTab";
import MedicalTable from "../reportTable/MedicalTable";
import FileTable from "../fileTable/FileTable";
import { useSelector } from "react-redux";
import DownloadReport from "../DownloadReport/DownloadReport";
import TodaysReport from "../TodaysReport/TodaysReport";
import axios from "axios";
import { baseUrl } from "@/baseUrl";

const TabsComponent = () => {

  // const { user } = useSelector(state => state.job)
  var id= sessionStorage.getItem("userId");
  const [userData, setUserData] = useState(null);
  
  // Fetch user data to get jumbleUpReports
  useEffect(() => {
    const fetchUserData = async () => {
      if (id) {
        try {
          const res = await axios.get(
            `${baseUrl}api/v1/user/get-a-user/${id}`,
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
  }, [id]);
  
  //todo>>>>
  return (
    <div className="bg-gray-200 w-full">
      <Tabs defaultValue="work Tab" className="w-full">
        <TabsList>
          <TabsTrigger value="work Tab">Work Tab</TabsTrigger>
          <TabsTrigger value="search">Search</TabsTrigger>
          <TabsTrigger value="download">Download Summary</TabsTrigger>
          <TabsTrigger value="backup">Backup Summary</TabsTrigger>
        </TabsList>
        <TabsContent value="work Tab">
          <WorkTab />
        </TabsContent>
        <TabsContent value="search">
          {/* <MedicalTable /> */}
          <FileTable urlParams="get-reports" id={id} admin="no" level="medical" jumbleUpReports={userData?.jumbleUpReports || false} duplicateReports={userData?.duplicateReport || false} />
        </TabsContent>
        <TabsContent value="download">
          {/* <FileTable urlParams="get-reports" id={user[0]?._id} admin="no" level="telecom" />
          <ReportTable /> */}
          <DownloadReport urlParams="get-reports" id={id} admin="no" level="medical" />
        </TabsContent>
        <TabsContent value="backup">
          {/* <FileTable urlParams="get-reports" id={user[0]?._id} admin="no" level="telecom" />
          <ReportTable /> */}
          <TodaysReport id={id} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TabsComponent;

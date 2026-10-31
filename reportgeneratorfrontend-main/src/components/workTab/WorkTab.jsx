import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import ProductSale from "../Tabs/ProductSale";
import TotalTab from "../Tabs/TotalTab";
import { Button } from "../ui/button";
import SalesAutomationTab from "../Tabs/SalesAutomationTab";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  addProduct,
  setTitle,
  setTotal,
  setformTotalTabData,
} from "@/app/features/medicalslice";
import { updateRecordNumber } from "@/app/features/jobSlice";
import { prepareAutoBatched } from "@reduxjs/toolkit";
import { baseUrl } from "@/baseUrl";

const tabsContent = [
  { titleValue: "Sales Automation", component: SalesAutomationTab },
  { titleValue: "Product Sale", component: ProductSale },
  { titleValue: "Total", component: TotalTab },
];

const WorkTab = () => {
  const { title, products, formTotalTabData } = useSelector(
    (state) => state.medical
  );
  const { recordNumber } = useSelector((state) => state.job);
  const { imageName } = useSelector(state => state.image)
  const [recNoCounter, setRecNoCounter] = useState(parseInt(recordNumber.slice(3)) || 1);
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({
    "File No": imageName || "",
    "Record No": recordNumber || "",
    "Ref No": "Mb_Sales-Med-Np#-l44604#1I @as-PUC1a#- 00000",
    "Entry Date": new Date().toISOString().slice(0, 10),
    "Invoice No": "SP-l7700IOOI",
  });

  useEffect(() => {
    setFormData((prevData) => ({ ...prevData, "File No": imageName, "Record No": recordNumber }))
    dispatch(setTitle({...formData,"File No": imageName, "Record No": recordNumber}));
  }, [imageName, recordNumber])

  useEffect(() => {
    if (recordNumber === "REC01") {
      setRecNoCounter(1);
      setFormData((prev) => ({ ...prev, "Record No": recordNumber}));
    }
  }, [recordNumber]);

  // Fetch user data to get duplicateReport status
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

  const dispatch = useDispatch();

  const handleChange = (e) => {
    console.log("event :", e)
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    console.log(`Updated ${name}: ${value}`); // Log updated value

    dispatch(setTitle(formData));
  };
  let newRecordNumber;
  const handleSubmit = async () => {
    try {
      // Increment REC No counter for next submission
      setRecNoCounter((prevCounter) => prevCounter + 1);

      // Construct new record number using the updated counter value
      newRecordNumber = `REC${(recNoCounter + 1).toString().padStart(2, "0")}`;

      // Update record number immediately after successful submission
      console.log("record no :", newRecordNumber)
      dispatch(updateRecordNumber(newRecordNumber));
      let remark = formTotalTabData?.remark;
      let total = formTotalTabData?.Total;
      let amountInWords = formTotalTabData['amount in words'];
      let discount = formTotalTabData?.discount
      let netAmount = formTotalTabData?.netAmount
      const data = { remark, Total: total, discount, netAmount, 'amount in words': amountInWords, ...title, product: [...products], 'credit card no': formData['credit card no'] // Ensure you're explicitly including it
      };

      console.log(formData,title)
      console.log("Credit card no from formData:", formData['credit card no']);
      

      console.log("data", data);
      
      // Check if duplicateReport is enabled
      const shouldDuplicate = userData?.duplicateReport || false;
      const apiCalls = shouldDuplicate ? 2 : 1;
      
      // Make API calls based on duplicateReport setting
      const apiPromises = [];
      for (let i = 0; i < apiCalls; i++) {
        apiPromises.push(
          axios.post(
            `${baseUrl}api/v1/medical/medical-report`,
            data,
            {
              headers: {
                "Content-Type": "application/json"
              },
              withCredentials: true
            }
          )
        );
      }
      
      const responses = await Promise.all(apiPromises);
      console.log(`Report saved successfully (${apiCalls} ${apiCalls === 1 ? 'time' : 'times'})`);
      
      toast.success(`Report saved successfully (${apiCalls} ${apiCalls === 1 ? 'time' : 'times'})`);
      setFormData({
        "File No": imageName,
        "Record No": newRecordNumber,
        "Ref No": "Mb_Sales-Med-Np#-l44604#1I @as-PUC1a#- 00000",
        "Entry Date": new Date().toISOString().slice(0, 10),
        "Invoice No": "SP-l7700IOOI",
      });
      // dispatch(setRemark(""));
      dispatch(setTitle({}));
      // dispatch(setTotal({}));
      dispatch(addProduct(Array(5).fill({ productNo: "", qty: "", productName: "", rate: "" })));
      dispatch(setformTotalTabData({
        discount: '',
        Total: '',
        netAmount: '',
        'amount in words': '',
        remark: '',
      }))

    } catch (error) {
      console.error("Error:", error);
      // Handle error
    }
  };

  const resetForm = () => {
    setFormData({
      "File No": "",
      "Record No": recordNumber,
      "Ref No": "Mb_Sales-Med-Np#-l44604#1I @as-PUC1a#- 00000",
      "Entry Date": new Date().toISOString().slice(0, 10),
      "Invoice No": "SP-l7700IOOI",
    });
    // dispatch(setRemark(""));
    dispatch(setTitle({}));
    // dispatch(setTotal({}));
    dispatch(addProduct(Array(5).fill({ productNo: "", qty: "", productName: "", rate: "" })));
    dispatch(setformTotalTabData({
      discount: '',
      Total: '',
      netAmount: '',
      'amount in words': '',
      remark: '',
    }))

  };

  return (
    <>
      <div className="w-[90%]">
        <Tabs defaultValue="Sales Automation">
          <TabsList>
            {tabsContent.map((tab) => (
              <TabsTrigger key={tab.titleValue} value={tab.titleValue}>
                {tab.titleValue}
              </TabsTrigger>
            ))}
          </TabsList>
          {tabsContent.map((tab) => (
            <TabsContent key={tab.titleValue} value={tab.titleValue}>
              <tab.component
                formData={formData}
                handleChange={handleChange}
                resetForm={resetForm}
              />
            </TabsContent>
          ))}
        </Tabs>
        <div className="flex mt-2 gap-10 justify-end">
          <Button size="sm" className='h-8' onClick={handleSubmit}>
            Save
          </Button>
          <Button size="sm" className="h-8" onClick={resetForm}>Reset</Button>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default WorkTab;

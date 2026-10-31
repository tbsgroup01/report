import React, { useEffect, useState } from "react";
import SelectDropdown from "@/components/selectDropdown/SelectDropdown";
import Tabs from "@/components/Tabs/MedicalTabs";
import { useDispatch, useSelector } from "react-redux";
import TelecomTabs from "@/components/Tabs/TelecomTabs";
import { addImageName, imageUrl } from "@/app/features/imageSlice";
import { Logout, selectJob, updateRecordNumber } from "@/app/features/jobSlice";
import { useNavigate } from "react-router-dom";
import { addProduct, setformTotalTabData } from "@/app/features/medicalslice";
import Header from "@/components/Header/Header";
import FrozenOverlay from "@/components/FrozenOverlay/FrozenOverlay";
import { useJobState } from "@/hooks/useJobState";
// import image from "../../assets/TP_(2).jpeg";
const emptyFormData = {
  form1: {
    "File No": "",
    "Invoice date": "",
    "Device Name": "",
    MMS: "",
    "customer type": "",
    "company name": "",
    city: "",
    "residence type": "",
    // "agency type": "",
    "agency code": "",
    balance: "",
    "card expiry date": "",
  },
  form2: {
    "Record No": "",
    "phone No": "",
    "phone cost": "",
    texts: "",
    "cust name": "",
    "cust address": "",
    state: "",
    "agent no": "",
    "agency name": "",
    "Credit card type": "",
    "Credit rate": "",
  },
  form3: {
    "invoice no": "",
    "price plans": "",
    "monthly cost": "",
    "extra value included": "",
    // "details": "",
    initials: "",
    email: "",
    zip: "",
    "agent name": "",
    deposit: "",
    "credit card no": "",
    remark: "",
  },
};

const File = () => {
  // Use custom hook for job state management
  const { jobValue } = useJobState();
  const isFreezed = sessionStorage.getItem('isFreezed') === 'true';
  
  console.log('File component - jobValue:', jobValue, 'sessionStorage job:', sessionStorage.getItem('job'))
  const { image } = useSelector((state) => state.image);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null); // State to store the URL of the preview image
  const dispatch = useDispatch();
  const navigate = useNavigate()

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file); // Store the selected file
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        dispatch(imageUrl(reader.result));
        dispatch(addImageName(file.name));
        // setPreviewImage(reader.result); // Set the URL of the preview image
      };
      dispatch(updateRecordNumber("REC01"));
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(null); // Clear the preview image if no file is selected
    }
  };
  // console.log(job);
  return (
    <>
      <Header />
      <div className=" h-[100vh]">
        {isFreezed && <FrozenOverlay />}
        <div className="flex flex-col items-start gap-2  text-[14px]">
          <div className="flex items-center  w-full ">
            <div className="w-[30%]">
              {/* <SelectDropdown /> */}

              <div class="job-container">
                Job: {jobValue}
              </div>
            </div>
            <div className="flex justify-between  w-[70%]">
              <div>

                <label htmlFor="imageUpload" className="mr-3">
                  Browse Image :
                </label>
                <input
                  type="file"
                  id="imageUpload"
                  name="imageUpload"
                  onChange={handleFileChange}
                />
              </div>

              {/* {previewImage && (
              <img
                src={previewImage}
                alt="Preview"
                style={{ maxWidth: "100%", marginTop: "10px" }}
              />
            )} */}
              <button
                onClick={() => {
                  localStorage.clear();
                  sessionStorage.clear();
                  navigate("/");
                  dispatch(Logout([]));
                  dispatch(updateRecordNumber(""))
                  dispatch(addImageName(""));
                  dispatch(imageUrl(""));
                  dispatch(selectJob(""));
                  dispatch(addProduct(Array(5).fill({ productNo: "", qty: "", productName: "", rate: "" })));
                  dispatch(setformTotalTabData({
                    discount: '',
                    Total: '',
                    netAmount: '',
                    'amount in words': '',
                    remark: '',
                  }));
                }}
                className="mr-4 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-orange-700 lg:p-0"
              >
                {" "}
                Logout
              </button>
            </div>
          </div>
          {jobValue !== "telecom" ? (
            <Tabs />
          ) : (
            <TelecomTabs />
          )}
          <div className="h-44 w-full overflow-scroll  p-2">
            <img src={image} alt="report image" className="w-[100%]" />
          </div>
        </div>
      </div>
    </>

  );
};

export default File;


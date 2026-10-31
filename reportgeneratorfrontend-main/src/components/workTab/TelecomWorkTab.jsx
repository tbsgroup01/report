// import React, { useEffect, useState } from "react";
// import { Button } from "../ui/button";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { useDispatch, useSelector } from "react-redux";
// import { updateRecordNumber } from "@/app/features/jobSlice";

// const TelecomWorkTab = ({ emptyFormData }) => {
//   const { imageName } = useSelector((state) => state.image);
//   const { recordNumber } = useSelector((state) => state.job);
//   const dispatch = useDispatch();

//   const [formData, setFormData] = useState({
//     ...emptyFormData,
//     form1: {
//       ...emptyFormData.form1,
//       "File No": imageName, // Prefill "Record No" with "REC01"
//     },
//     form2: {
//       ...emptyFormData.form2,
//       "Record No": recordNumber,
//     },
//     form3: {
//       ...emptyFormData.form3,
//       "invoice no": "TC_vd-sdi-IB-BtunVp-00", // Prefill "Invoice No" field
//     },
//   });
//   const navigate = useNavigate();
//   const [recNoCounter, setRecNoCounter] = useState(1); // Initialize REC No counter

//   useEffect(() => {
//     setFormData((prevFormData) => ({
//       ...prevFormData,
//       form1: {
//         ...prevFormData.form1,
//         "File No": imageName,
//       },
//       form2: {
//         ...emptyFormData.form2,
//         "Record No": recordNumber,
//       },
//     }));
//   }, [imageName]);

//   const handleChange = (e, formName) => {
//     const { name, value } = e.target;
//     setFormData((prevFormData) => ({
//       ...prevFormData,
//       [formName]: {
//         ...prevFormData[formName],
//         [name]: value,
//       },
//     }));
//   };

//   const handleSubmit = async () => {
//     try {
//       // Increment REC No counter for next submission
//       const updatedCounter = recNoCounter + 1;

//       // Update record number immediately after successful submission
//       dispatch(updateRecordNumber(`REC0${updatedCounter}`));

//       // Proceed to submit form data without uploading the image
//       const data = {
//         ...formData.form1,
//         ...formData.form2,
//         ...formData.form3,
//         "Record No": `REC0${updatedCounter}`, // Use the updated counter value
//       };

//       const res = await axios.post(
//         "https://api.sagarsinghawesome.com/api/v1/telecom/telecom-report",
//         data,
//          {
//         headers: {
//           "Content-Type": "application/json"

//         },
//         withCredentials: true
//       }
//       );

//       toast.success(res.data.message);

//       // Reset form data
//       setFormData({
//         ...emptyFormData,
//         form1: {
//           ...emptyFormData.form1,
//           "File No": imageName, // Prefill "Record No" with "REC01"
//         },
//         form2: {
//           ...emptyFormData.form2,
//           "Record No": `REC0${updatedCounter}`, // Update Record No in form data
//         },
//         form3: {
//           ...emptyFormData.form3,
//           "invoice no": "TC_vd-sdi-IB-BtunVp-00", // Prefill "Invoice No" field
//         },
//       });

//       // Update REC No counter for next submission
//       setRecNoCounter(updatedCounter);
//     } catch (error) {
//       console.error("Error:", error);
//       // Handle error
//     }
//   };

//   return (
//     <>
//       <div className="w-[90%]  ">
//         <form className="grid bg-gray grid-cols-1 md:grid-cols-3 gap-5 p-2 ">
//           {Object.entries(formData).map(([formName, form]) => (
//             <div key={formName}>
//               {Object.entries(form).map(([label, value]) => (
//                 <div key={label} className="flex justify-between my-1">
//                   <label className="uppercase " htmlFor={label}>
//                     {label}:
//                   </label>
//                   {label === "remark" ? (
//                     <select
//                       id={label}
//                       name={label}
//                       value={value}
//                       onChange={(e) => handleChange(e, formName)}
//                     >
//                       <option value="">Select Remark</option>
//                       <option value="N.A.">N.A.</option>
//                       <option value="FORM DETAILS ARE NOT FOUND">
//                         FORM DETAILS ARE NOT FOUND
//                       </option>
//                       <option value="FIELD NAME IS MISSING">
//                         FIELD NAME IS MISSING
//                       </option>
//                     </select>
//                   ) : (
//                     <input
//                       type="text"
//                       id={label}
//                       name={label}
//                       value={label === "File No" ? imageName : value}
//                       onChange={(e) => handleChange(e, formName)}

//                     />
//                   )}
//                 </div>
//               ))}
//             </div>
//           ))}
//         </form>

//         <div className="flex mt-0  gap-10  justify-end">
//           <Button size="sm" className="h-8">Delete</Button>
//           <Button size="sm" className="h-8">Reset</Button>
//           <Button size="sm"className="h-8" onClick={handleSubmit}>
//             Save
//           </Button>
//         </div>
//       </div>
//       <ToastContainer />
//     </>
//   );
// };
// export default TelecomWorkTab;

import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { updateRecordNumber } from "@/app/features/jobSlice";
import { baseUrl } from "@/baseUrl";

const emptyFormData = {
  "File No": "",
  "Record No": "",
  "invoice no": "",
  "Invoice date": "",
  "phone No": "",
  "price plans": "",
  "Device Name": "",
  "phone cost": "",
  "monthly cost": "",
  MMS: "",
  texts: "",
  "extra value included": "",
  "customer type": "",
  "cust name": "",
  initials: "",
  "company name": "",
  "cust address": "",
  email: "",
  city: "",
  state: "",
  zip: "",
  "residence type": "",
  "agent no": "",
  "agent name": "",
  "agency code": "",
  "agency name": "",
  // "agency type": "",
  deposit: "",
  balance: "",
  "Credit card type": "",
  "credit card no": "",
  "card expiry date": "",
  "Credit rate": "",
  // "details": "",
  remark: "",
};
let newRecordNumber;

const TelecomWorkTab = () => {
  const { imageName } = useSelector((state) => state.image);
  const { recordNumber } = useSelector((state) => state.job);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [recNoCounter, setRecNoCounter] = useState(parseInt(recordNumber.slice(3)) || 1); // Initialize REC No counter
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({
    ...emptyFormData,
    "File No": imageName,
    "invoice no": "TC_vd-Sdi-IB-BtunVp-00",
  }); // Initialize form data

  useEffect(() => {
    // Prefill "Record No" and "Invoice No" fields when the component mounts
    setFormData((prevFormData) => ({
      ...prevFormData,
      "File No": imageName,
      // Prefill "Record No" with the current record number
      "invoice no": "TC_vd-Sdi-IB-BtunVp-00", // Prefill "Invoice No" with a predefined value
    }));
    console.log(formData)
  }, [imageName]);

  useEffect(() => {
    console.log(formData)
   }, [formData["File No"]])

  useEffect(() => {
    if (recordNumber === "REC01") {
      setRecNoCounter(1);
      setFormData((prev) => ({ ...prev, "Record No": recordNumber }));
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





  const handleChange = (e) => {
    const { name, value } = e.target;

    // Update the form data
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };
  const handleSubmit = async () => {
    // Submission logic remains unchanged
    try {
      // Increment REC No counter for next submission
      setRecNoCounter((prevCounter) => prevCounter + 1);

      newRecordNumber = `REC${(recNoCounter + 1).toString().padStart(2, "0")}`;
      // Update record number immediately after successful submission
      dispatch(updateRecordNumber(newRecordNumber));

      // Proceed to submit form data without uploading the image
      // const data = {
      //   ...formData.form1,
      //   ...formData.form2,
      //   ...formData.form3,
      //   "Record No": `REC0${updatedCounter}`, // Use the updated counter value
      // };
      console.log(formData);
      
      // Check if duplicateReport is enabled
      const shouldDuplicate = userData?.duplicateReport || false;
      const apiCalls = shouldDuplicate ? 2 : 1;
      
      // Make API calls based on duplicateReport setting
      const apiPromises = [];
      for (let i = 0; i < apiCalls; i++) {
        apiPromises.push(
          axios.post(
            `${baseUrl}api/v1/telecom/telecom-report`,
            formData,
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

      // Reset form data
      setFormData({
        ...emptyFormData,
        "File No": imageName,
        "Record No": newRecordNumber, // Update Record No in form data
        "invoice no": "TC_vd-sdi-IB-BtunVp-00", // Prefill "Invoice No" field
      });

      // Update REC No counter for next submission
      // setRecNoCounter(updatedCounter);
    } catch (error) {
      console.error("Error:", error);
      // Handle error
    }
  };

  const handleReset = () => {
    console.log("reset",newRecordNumber)
    setFormData((prev) => ({
      ...emptyFormData,
      "Record No": newRecordNumber, // Update Record No in form data
      "invoice no": "TC_vd-sdi-IB-BtunVp-00", // Prefill "Invoice No" field
    }));
  };

  return (
    <>
      <div className="w-[90%]">
        <form className="grid bg-gray grid-cols-1 md:grid-cols-3 gap-2  p-2 ">
          {Object.entries(formData).map(([label, value]) => (
            <div key={label} className="flex justify-between ">
              <label className="uppercase" htmlFor={label}>
                {label}:
              </label>
              {label === "remark" ? (
                <select
                  id={label}
                  name={label}
                  value={value}
                  onChange={handleChange}
                  // onKeyDown={(e) => handleTabNavigation(e, label)} // Handle tab navigation
                  tabIndex="0" // Make select element focusable
                >
                  <option value="">Select Remark</option>
                  <option value="N.A.">N.A.</option>
                  <option value="FORM DETAILS ARE NOT FOUND">
                    FORM DETAILS ARE NOT FOUND
                  </option>
                  <option value="FIELD NAME IS MISSING">
                    FIELD NAME IS MISSING
                  </option>
                </select>
              ) : (
                <input
                  type="text"
                  id={label}
                  name={label}
                  value={ value}
                  onChange={handleChange}
                  // onKeyDown={(e) => handleTabNavigation(e, label)} // Handle tab navigation
                  tabIndex="0" // Make input element focusable
                />
              )}
            </div>
          ))}
        </form>

        <div className="flex mt-0 gap-10 justify-end">
          {/* <Button size="sm" className="h-8">
            Delete
          </Button> */}
          <Button size="sm" className="h-8" onClick={handleSubmit}>
            Save
          </Button>
          <Button onClick={handleReset} size="sm" className="h-8">
            Reset
          </Button>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default TelecomWorkTab;

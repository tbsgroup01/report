// import React, { useEffect, useState } from "react";
// import { Button } from "../ui/button";
// import { useSelector } from "react-redux";
// import axios from "axios";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { useParams } from "react-router-dom";

// const data2 = [
//   {
//     "File No": "FN123456",
//     "Invoice date": "2022-07-07T05:28:41.351Z",
//     "Device Name": "Smartphone",
//     MMS: "Enabled",
//     "customer type": "Business",
//     "company name": "ABC Company",
//     city: "New York",
//     "residence type": "Apartment",
//     "agency type": "Marketing",
//     balance: "$1000.00",
//     "card expiry date": "2024-12-31T23:59:59.999Z",
//     "Record No": "R123456789",
//     "phone No": "+1234567890",
//     "phone cost": "$200.00",
//     texts: "Unlimited",
//     "cust name": "John Doe",
//     "cust address": "123 Main Street",
//     state: "California",
//     "agent no": "A987654321",
//     "agency name": "XYZ Agency",
//     "Credit card type": "Visa",
//     "Credit rate": "18%",
//     "invoice no": "INV-2023001",
//     "price plan": "Gold",
//     "monthly cost": "$50.00",
//     "extra value included": "Bonus data",
//     details: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
//     email: "john.doe@example.com",
//     zip: "12345",
//     "agent name": "Agent Smith",
//     deposit: "$500.00",
//     "credit card no.": "1234-5678-9012-3456",
//     remark: "No special remarks",
//   },
// ];
// const emptyFormData = {
//   form1: {
//     "File No": "",
//     "Invoice date": "",
//     "Device Name": "",
//     MMS: "",
//     "customer type": "",
//     "company name": "",
//     city: "",
//     "residence type": "",
//     // "agency type": "",
//     "agency code": "",
//     balance: "",
//     "card expiry date": "",
//   },
//   form2: {
//     "Record No": "",
//     "phone No": "",
//     "phone cost": "",
//     texts: "",
//     "cust name": "",
//     "cust address": "",
//     state: "",
//     "agent no": "",
//     "agency name": "",
//     "Credit card type": "",
//     "Credit rate": "",
//   },
//   form3: {
//     "invoice no": "",
//     "price plans": "",
//     "monthly cost": "",
//     "extra value included": "",
//     // "details": "",
//     initials: "",
//     email: "",
//     zip: "",
//     "agent name": "",
//     deposit: "",
//     "credit card no": "",
//     remark: "",
//   },
// };


// const ReportTable = () => {
//   const [editableRow, setEditableRow] = useState(null);
//   const [editedData, setEditedData] = useState({});
//   const [data, setData] = useState([]);
//   const { reportId } = useParams();

//   const getReports = async () => {
//     try {
//       const url = `https://api.sagarsinghawesome.com/api/v1/telecom/get-a-report/${reportId}`;
//       const res = await axios.get(url, {
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         withCredentials: true,
//       });
//       setData([res?.data?.data]);
//     } catch (error) {
//       console.error('Error fetching reports:', error);
//     }
//   };

//   useEffect(() => {
//     getReports();
//   }, []);

//   const onEdit = (row) => {
//     setEditableRow(row);
//     setEditedData({ ...row });
//   };

//   const handleChange = (e, key) => {
//     const { value } = e.target;
//     setEditedData((prevData) => ({
//       ...prevData,
//       [key]: value,
//     }));
//   };

//   const handleSave = async () => {
//     const updatedData = data.map((row) =>
//       row === editableRow ? editedData : row
//     );
//     // console.log(updatedData)
//     const url = `https://api.sagarsinghawesome.com/api/v1/telecom/update/telecom-report`;
//     const res = await axios.put(
//       url,
//       {
//         id: updatedData[0]._id,
//         data: updatedData[0],
//       },
//       {
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         withCredentials: true,
//       }
//     );
//     // console.log(res)
//     getReports();
//     setEditableRow(null);
//     setEditedData({});
//     toast.success('report updated successfully');
//   };

//   return (
//     <>
//       <div className="w-full overflow-x-scroll">
//         {data.map((row, index) => (
//           <div key={index}>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-2 bg-gray-100 p-4 mb-4 rounded-md">
//               {Object.entries(row).map(([key, value], i) => {
//                 // Skip rendering _id and __v fields
//                 if (key === '_id' || key === '__v') return null;
//                 return (
//                   <div key={i} className="flex ">
//                     <div className="flex justify-between w-full">
//                       <label className="uppercase font-bold">{key}:</label>
//                       {editableRow === row ? (
//                         <input
//                           type={
//                             key === 'Invoice date' || key === 'card expiry date'
//                               ? 'date'
//                               : 'text'
//                           }
//                           name={key}
//                           value={editedData[key]}
//                           onChange={(e) => handleChange(e, key)}
//                           className="border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
//                         />
//                       ) : (
//                         <span>{value}</span>
//                       )}
//                     </div>
//                   </div>
//                 );
//               })}
//               <div className="flex justify-start ">
//                 {editableRow === row ? (
//                   <Button size="sm" onClick={handleSave}>
//                     Save
//                   </Button>
//                 ) : (
//                   <Button size="sm" onClick={() => onEdit(row)}>
//                     Edit
//                   </Button>
//                 )}
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//       <ToastContainer />
//     </>

//   );
// };

// export default ReportTable;



// import React, { useEffect, useState } from "react";
// import { Button } from "../ui/button";
// import axios from "axios";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { useNavigate, useParams } from "react-router-dom";

// const ReportTable = () => {
//   const [editableRow, setEditableRow] = useState(null);
//   const [editedData, setEditedData] = useState({});
//   const [data, setData] = useState([]);
//   const { reportId } = useParams();
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [previewImage, setPreviewImage] = useState(null);

//   const getReports = async () => {
//     try {
//       const url = `https://api.sagarsinghawesome.com/api/v1/telecom/get-a-report/${reportId}`;
//       const res = await axios.get(url, {
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         withCredentials: true,
//       });
//       setData([res?.data?.data]);
//     } catch (error) {
//       console.error('Error fetching reports:', error);
//     }
//   };

//   useEffect(() => {
//     getReports();
//   }, []);

//   const onEdit = (row) => {
//     setEditableRow(row);
//     setEditedData({ ...row });
//   };

//   const handleChange = (e, key) => {
//     const { value } = e.target;
//     setEditedData((prevData) => ({
//       ...prevData,
//       [key]: value,
//     }));
//   };

//   const handleSave = async () => {
//     const updatedData = data.map((row) =>
//       row === editableRow ? editedData : row
//     );
//     const url = `https://api.sagarsinghawesome.com/api/v1/telecom/update/telecom-report`;
//     const res = await axios.put(
//       url,
//       {
//         id: updatedData[0]._id,
//         data: updatedData[0],
//       },
//       {
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         withCredentials: true,
//       }
//     );
//     getReports();
//     setEditableRow(null);
//     setEditedData({});
//     toast.success('report updated successfully');
//   };
//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     setSelectedFile(file); // Store the selected file
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         // dispatch(imageUrl(reader.result));
//         // dispatch(addImageName(file.name));
//         setPreviewImage(reader.result); // Set the URL of the preview image
//       };
//       reader.readAsDataURL(file);
//     } else {
//       setPreviewImage(null); // Clear the preview image if no file is selected
//     }
//   };
//   const navigate = useNavigate()
//   const handleDelete = (value) => {
//     const confirmation = confirm("Are you sure?");
//     console.log(value._id)

//     if (confirmation) {
//       try {

//         const url = `https://api.sagarsinghawesome.com/api/v1/user/delete-reports/${value._id}`
//         const res = axios.delete(url, {
//           headers: {
//             "Content-Type": "application/json"
//           },
//           withCredentials: true
//         }
//         )
//         alert("report deleted successfully")
//         // getReports()
//         navigate('/home')
//       } catch (err) {
//         console.log("error during report deletion", err.message)
//       }
//     }
//   }



//   return (
//     <>
//       <div className="w-full overflow-x-scroll">
//         {data.map((row, index) => (
//           <div key={index}>
//             <div className="grid grid-cols-3 gap-2 bg-gray-100 p-4 mb-4 rounded-md">
//               <div className="col-span-1">
//                 <div className="flex justify-between ">
//                   <label className="font-bold">File No:</label>
//                   <div>{row["File No"]}</div>
//                 </div>
//               </div>
//               <div className="col-span-1">
//                 <div className="flex justify-between ">
//                   <label className="font-bold">Record No:</label>
//                   <div>{row["Record No"]}</div>
//                 </div>
//               </div>
//               <div className="col-span-1">
//                 <div className="flex justify-between ">
//                   <label className="font-bold">Invoice No:</label>
//                   <div>{row["invoice no"]}</div>
//                 </div>
//               </div>
//               {Object.entries(row).map(([key, value], i) => {
//                 if (key === '_id' || key === 'createdAt' || key === 'updatedAt' || key === '__v' || key === 'File No' || key === 'Record No' || key === 'invoice no') return null;
//                 return (
//                   <div key={i} className="flex justify-between">
//                     <label>{key}:</label>
//                     {editableRow === row ? (
//                       <input
//                         type={
//                           key === 'Invoice date' || key === 'card expiry date'
//                             ? 'text'
//                             : 'text'
//                         }
//                         name={key}
//                         value={editedData[key]}
//                         onChange={(e) => handleChange(e, key)}
//                         className="border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
//                       />
//                     ) : (
//                       <div>{value}</div>
//                     )}
//                   </div>
//                 );
//               })}
//               <div className="col-span-3 flex justify-start  gap-4">
//                 {editableRow === row ? (
//                   <Button size="sm" onClick={handleSave}>
//                     Save
//                   </Button>
//                 ) : (
//                   <Button size="sm" onClick={() => onEdit(row)}>
//                     Edit
//                   </Button>
//                 )}

//                 <button onClick={() => handleDelete(row)} className="px-6 py-2 rounded bg-red-500 text-sm text-white text-center">
//                   Delete
//                 </button>
//                 <div>


//                   <label htmlFor="imageUpload" className="mr-3">
//                     Browse Image :
//                   </label>
//                   <input
//                     type="file"
//                     id="imageUpload"
//                     name="imageUpload"
//                     onChange={handleFileChange}
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//       <div className="h-44 w-full overflow-scroll  p-2">
//         <img src={previewImage} alt="report image" className="w-[100%]" />
//       </div>
//       <ToastContainer />
//     </>
//   );
// };

// export default ReportTable;
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { baseUrl } from '@/baseUrl';

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

const ReportTable = () => {
  const [formData, setFormData] = useState(emptyFormData);
  // const [imageName, setImageName] = useState(''); // Assuming you have imageName state
  const [isEditing, setIsEditing] = useState(false);
  const { reportId } = useParams();
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const getReports = async () => {
    try {
      const url = `${baseUrl}api/v1/telecom/get-a-report/${reportId}`;
      const res = await axios.get(url, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });
      if (res?.data?.data) {
        setFormData(res.data.data);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
    }
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file); // Store the selected file
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // dispatch(imageUrl(reader.result));
        // dispatch(addImageName(file.name));
        setPreviewImage(reader.result); // Set the URL of the preview image
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(null); // Clear the preview image if no file is selected
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEditing) {
      console.log(formData)
      // try {
      //   const url = `https://api.sagarsinghawesome.com/api/v1/telecom/update-report/${reportId}`;
      //   await axios.put(url, formData, {
      //     headers: {
      //       'Content-Type': 'application/json',
      //     },
      //     withCredentials: true,
      //   });
      //   console.log('Report updated successfully');
      // } catch (error) {
      //   console.error('Error updating report:', error);
      // }
      try {
        const url = `${baseUrl}api/v1/telecom/update/telecom-report`;
        const res = await axios.put(
          url,
          {
            id: formData._id,
            data: formData,
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
            withCredentials: true,
          }
        )

        console.log(res)
        getReports()
      } catch (error) {
        console.log("error while sending data : ", error);
      }
    }
    setIsEditing(!isEditing);
  };

  useEffect(() => {
    // if (reportId) {
    getReports();

  }, []);

  const navigate = useNavigate()
  const handleDelete = (value) => {
    const confirmation = confirm("Are you sure?");
    console.log(value._id)

    if (confirmation) {
      try {

        const url = `${baseUrl}api/v1/user/delete-reports/${value._id}`
        const res = axios.delete(url, {
          headers: {
            "Content-Type": "application/json"
          },
          withCredentials: true
        }
        )
        alert("report deleted successfully")
        // getReports()
        navigate('/home')
      } catch (err) {
        console.log("error during report deletion", err.message)
      }
    }
  }

  return (
    <>
      <div className='bg-gray-300'>
        <form className="grid grid-cols-1 md:grid-cols-3 gap-2 p-2" >
          {Object.keys(emptyFormData).map((key) => (
            <div key={key} className="flex justify-between">
              <label className="uppercase" htmlFor={key}>
                {key}:
              </label>
              {key === "remark" ? (
                <select
                  id={key}
                  name={key}
                  value={formData[key]}
                  onChange={handleChange}
                  tabIndex="0"
                  disabled={!isEditing}
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
                  id={key}
                  name={key}
                  value={formData[key]}
                  onChange={handleChange}
                  tabIndex="0"
                  disabled={!isEditing}
                />
              )}
            </div>
          ))}
        </form>
        <div className='m-2 flex gap-2'>

          <button onClick={handleSubmit} className={`${isEditing ? "bg-green-400" : "bg-blue-500"} text-white p-2 rounded`}>
            {isEditing ? 'Save' : 'Edit'}
          </button>
          <button onClick={() => handleDelete(formData)} className="bg-red-500 text-white p-2 rounded">
            delete
          </button>
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
        </div>
      </div>
      <div className="h-44 w-full overflow-scroll  p-2">
        <img src={previewImage} alt="report image" className="w-[100%]" />
      </div>
    </>
  );
};

export default ReportTable;


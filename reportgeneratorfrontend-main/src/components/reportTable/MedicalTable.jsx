import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useParams } from "react-router-dom";
import { baseUrl } from "@/baseUrl";

const initialData = [
  {
    "File No": "ABC123",
    "Ref No": "REF456",
    "Con No": "CON789",
    "Sales Date": "2024-04-12",
    "Sales Time": "10:30 AM",
    "mail Address": "example@example.com",
    City: "New York",
    "Customer Phone": "+1234567890",
    "Record No": "REC123",
    "Invoice No": "INV456",
    "courier name": "FedEx",
    "Dispatch Date": "2024-04-13",
    "Dispatch By": "John Doe",
    "Agent Name": "Agent Smith",
    State: "California",
    "Credit card type": "Visa",
    "Entry Date": "2024-04-10",
    "customer name": "Alice Smith",
    Address: "123 Main St",
    zip: "12345",
    "credit card no": "1234 5678 9012 3456",
    Total: "$100.00",
    discount: "$10.00",
    netAmount: "$90.00",
    "amount in words": "Ninety dollars",
    remark: "field name is missing",
    product: [
      {
        productName: "Product 1",
        productNo: 1,
        rate: "$50.00",
        city: "Delhi",
      },
      {
        productName: "Product 2",
        productNo: 2,
        rate: "$60.00",
        city: "Mumbai",
      },
    ],
  },
  {
    "File No": "ABC123",
    "Ref No": "REF456",
    "Con No": "CON789",
    "Sales Date": "2024-04-12",
    "Sales Time": "10:30 AM",
    "mail Address": "example@example.com",
    City: "New York",
    "Customer Phone": "+1234567890",
    "Record No": "REC123",
    "Invoice No": "INV456",
    "courier name": "FedEx",
    "Dispatch Date": "2024-04-13",
    "Dispatch By": "John Doe",
    "Agent Name": "Agent Smith",
    State: "California",
    "Credit card type": "Visa",
    "Entry Date": "2024-04-10",
    "customer name": "Alice Smith",
    Address: "123 Main St",
    zip: "12345",
    "credit card no": "1234 5678 9012 3456",
    Total: "$100.00",
    discount: "$10.00",
    netAmount: "$90.00",
    "amount in words": "Ninety dollars",
    remark: "field name is missing",
    product: [
      {
        productName: "Product 1",
        productNo: 1,
        rate: "$50.00",
        city: "Delhi",
      },
      {
        productName: "Product 2",
        productNo: 2,
        rate: "$60.00",
        city: "Mumbai",
      },
    ],
  },
  // Add more objects as needed
];

// const MedicalTable = () => {
//   const [data, setData] = useState([]);
//   const [editedData, setEditedData] = useState([]);
//   const [editingIndex, setEditingIndex] = useState(null); // State to track editing index
//   const { user } = useSelector((state) => state.job);

//   const getReports = async () => {
//     try {
//       const url = `https://api.sagarsinghawesome.com/api/v1/user/get-reports/${user[0]?._id}`;
//       const res = await axios.get(url, {
//         headers: {
//           "Content-Type": "application/json",
//         },
//         withCredentials: true,
//       });
//       setData(res?.data?.data || []);
//       console.log(res);
//     } catch (error) {
//       console.error("Error fetching reports:", error);
//     }
//   };

//   useEffect(() => {
//     getReports();
//   }, []);

//   useEffect(() => {
//     // Copy data to editedData state for editing purposes
//     setEditedData([...data]);
//   }, [data]);

//   const handleEdit = (index) => {
//     setEditingIndex(index); // Set the editing index when editing starts
//   };

//   const handleSave = async () => {
//     // Save the changes for the currently editing object
//     const url = `api/v1/medical/update/medical-report`;
//     const res = await axios.put(
//       url,
//       {
//         id: editedData[editingIndex]._id,
//         data: editedData[editingIndex],
//       },
//       {
//         headers: {
//           "Content-Type": "application/json",
//         },
//         withCredentials: true,
//       }
//     );
//     setEditingIndex(null); // Exit edit mode
//     getReports();
//     toast.success("report updated successfully");
//   };

//   const handleChange = (objectIndex, key, value) => {
//     const newData = [...editedData];
//     // Update the value in the editedData state
//     newData[objectIndex][key] = value;
//     setEditedData(newData);
//   };

//   const handleProductChange = (objectIndex, productIndex, key, value) => {
//     const newData = [...editedData];
//     // Update the value in the editedData state
//     newData[objectIndex].product[productIndex][key] = value;
//     setEditedData(newData);
//   };

//   return (
//     <>
//       <div className="container mx-auto">
//         {editedData.length > 0 &&
//           editedData.map((object, objectIndex) => (
//             <div
//               key={objectIndex}
//               className="grid grid-cols-3 gap-4 bg-gray-100 p-6 mb-8 rounded-lg shadow-md"
//             >
//               {Object.entries(object).map(([key, value], idx) => (
//                 <div key={idx} className="p-2">
//                   <div className="text-gray-600 font-semibold mb-1">{key}</div>
//                   {Array.isArray(value) ? (
//                     <ul className="list-disc pl-5">
//                       {value.map((item, i) => (
//                         <li key={i} className="mb-1">
//                           {Object.entries(item).map(([subKey, subValue], j) => (
//                             <div key={j} className="flex mb-1">
//                               <span className="font-semibold mr-1">
//                                 {subKey}:
//                               </span>
//                               <span>{subValue}</span>
//                             </div>
//                           ))}
//                         </li>
//                       ))}
//                     </ul>
//                   ) : editingIndex === objectIndex ? (
//                     <input
//                       type="text"
//                       value={value}
//                       onChange={(e) =>
//                         handleChange(objectIndex, key, e.target.value)
//                       }
//                       className="border-b border-gray-500"
//                     />
//                   ) : (
//                     <div>{value}</div>
//                   )}
//                 </div>
//               ))}
//               <div className="col-span-3">
//                 {editingIndex === objectIndex ? (
//                   <button
//                     onClick={handleSave}
//                     className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
//                   >
//                     Save
//                   </button>
//                 ) : (
//                   <button
//                     onClick={() => handleEdit(objectIndex)}
//                     className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
//                   >
//                     Edit
//                   </button>
//                 )}
//               </div>
//               {/* Product editing */}
//               {editingIndex === objectIndex && (
//                 <div className="col-span-3">
//                   {object.product.map((product, productIndex) => (
//                     <div key={productIndex} className="grid grid-cols-3 gap-4">
//                       {Object.entries(product).map(
//                         ([prodKey, prodValue], idx) => (
//                           <div key={idx} className="p-2">
//                             <div className="text-gray-600 font-semibold mb-1">
//                               {prodKey}
//                             </div>
//                             <input
//                               type="text"
//                               value={prodValue}
//                               onChange={(e) =>
//                                 handleProductChange(
//                                   objectIndex,
//                                   productIndex,
//                                   prodKey,
//                                   e.target.value
//                                 )
//                               }
//                               className="border-b border-gray-500"
//                             />
//                           </div>
//                         )
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           ))}
//       </div>
//       <ToastContainer />
//     </>
//   );
// };

// export default MedicalTable;



const MedicalTable = () => {
  const [data, setData] = useState([]);
  const { image } = useSelector((state) => state.image);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [editedData, setEditedData] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null); // State to track editing index
  const { user } = useSelector((state) => state.job);
  const { reportId } = useParams();
  const getReports = async () => {
    try {
      const url = `${baseUrl}api/v1/medical/get-a-report/${reportId}`;
      const res = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      setData([res?.data?.data] || []);
      // console.log(res);
    } catch (error) {
      console.error("Error fetching reports:", error);
    }
  };

  useEffect(() => {
    getReports();
  }, []);

  useEffect(() => {
    // Copy data to editedData state for editing purposes
    setEditedData([...data]);
  }, [data]);


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

  const handleEdit = (index) => {
    setEditingIndex(index); // Set the editing index when editing starts
  };

  const handleSave = async () => {
    // Save the changes for the currently editing object
    const url = `${baseUrl}api/v1/medical/update/medical-report`;
    const res = await axios.put(
      url,
      {
        id: editedData[editingIndex]._id,
        data: editedData[editingIndex],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    setEditingIndex(null); // Exit edit mode
    getReports();
    toast.success("report updated successfully");
  };

  const handleChange = (objectIndex, key, value) => {
    const newData = [...editedData];
    // Update the value in the editedData state
    newData[objectIndex][key] = value;
    setEditedData(newData);
  };

  const handleProductChange = (objectIndex, productIndex, key, value) => {
    const newData = [...editedData];
    // Update the value in the editedData state
    newData[objectIndex].product[productIndex][key] = value;
    setEditedData(newData);
  };

  const navigate = useNavigate()
  const handleDelete = () => {
    const confirmation = confirm("Are you sure?");
    // console.log(reportId)

    if (confirmation) {
      try {

        const url = `${baseUrl}api/v1/user/delete-reports/${reportId}`
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

      <div className="container mx-auto">

        {editedData.length > 0 &&
          editedData.map((object, objectIndex) => (
            <div
              key={objectIndex}
              className="grid grid-cols-3 gap-4 bg-gray-100 p-2  rounded-lg shadow-md"
            >
              {Object.entries(object).map(([key, value], idx) => (
                // Skip rendering _id and __v fields
                key !== "_id" && key !== "__v" && key !== "createdAt" && key !== "updatedAt" && (
                  <div key={idx} className="">
                    <div className="text-gray-600 font-semibold mb-1">{key}</div>
                    {Array.isArray(value) ? (
                      <ul className="list-disc pl-5">
                        {value.map((item, i) => (
                          <li key={i} className="">
                            {Object.entries(item).map(([subKey, subValue], j) => (
                              // Skip rendering _id and __v fields for products
                              subKey !== "_id" && subKey !== "__v" && (
                                <div key={j} className="flex ">
                                  <span className="font-semibold mr-1">
                                    {subKey}:
                                  </span>
                                  <span>{subValue}</span>
                                </div>
                              )
                            ))}
                          </li>
                        ))}
                      </ul>
                    ) : editingIndex === objectIndex ? (
                      <input
                        type="text"
                        value={value}
                        onChange={(e) =>
                          handleChange(objectIndex, key, e.target.value)
                        }
                        className="border-b border-gray-500"
                      />
                    ) : (
                      <div>{value}</div>
                    )}
                  </div>
                )
              ))}
              <div className="col-span-2 flex gap-4">
                {editingIndex === objectIndex ? (
                  <button
                    onClick={handleSave}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() => handleEdit(objectIndex)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Edit
                  </button>
                )}

                <div className="flex justify-between items-center gap-2  w-[70%]">
                  <button onClick={handleDelete} className="bg-red-400 capitalize text-white font-bold p-2 rounded">delete</button>
                  <div className="flex w-full">

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
              {/* Product editing */}
              {editingIndex === objectIndex && (
                <div className="col-span-3">
                  {object.product.map((product, productIndex) => (
                    <div key={productIndex} className="grid grid-cols-3 gap-4">
                      {Object.entries(product).map(
                        ([prodKey, prodValue], idx) => (
                          // Skip rendering _id and __v fields for products
                          prodKey !== "_id" && prodKey !== "__v" && (
                            <div key={idx} className="p-2">
                              <div className="text-gray-600 font-semibold mb-1">
                                {prodKey}
                              </div>
                              <input
                                type="text"
                                value={prodValue}
                                onChange={(e) =>
                                  handleProductChange(
                                    objectIndex,
                                    productIndex,
                                    prodKey,
                                    e.target.value
                                  )
                                }
                                className="border-b border-gray-500"
                              />
                            </div>
                          )
                        )
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
      </div>
      <div className="h-44 w-full overflow-scroll  p-2">
        <img src={previewImage} alt="report image" className="w-[100%]" />
      </div>
      <ToastContainer />
    </>
  );
};

export default MedicalTable;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams } from "react-router-dom";
import { baseUrl } from "@/baseUrl";
import Header from "../Header/Header";
import { Button } from "../ui/button";

// Options for the remark dropdown
const remarkOptions = ["", "N.A.", "FORM DETAILS ARE NOT FOUND", "FIELD NAME IS MISSING"];


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
    // product: [
    //   {
    //     productName: "Product 1",
    //     productNo: 1,
    //     rate: "$50.00",
    //     city: "Delhi",
    //   },
    //   {
    //     productName: "Product 2",
    //     productNo: 2,
    //     rate: "$60.00",
    //     city: "Mumbai",
    //   },
    // ],
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
    // product: [
    //   {
    //     productName: "Product 1",
    //     productNo: 1,
    //     rate: "$50.00",
    //     city: "Delhi",
    //   },
    //   {
    //     productName: "Product 2",
    //     productNo: 2,
    //     rate: "$60.00",
    //     city: "Mumbai",
    //   },
    // ],
  },
  // Add more objects as needed
];


const AdminMedicalTable = () => {
  const [data, setData] = useState([]);
  const [editedData, setEditedData] = useState(initialData); // Initialize with initialData
  const [editingIndex, setEditingIndex] = useState(null);

  const { reportId } = useParams();

  const getReports = async () => {
    try {
      const url = `${baseUrl}api/v1/medical/get-admin-report/${reportId}`;
      // console.log(url)
      const res = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      setData([res?.data?.data] || []);
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

  const handleEdit = (index) => {
    setEditingIndex(index);
  };

  const handleSave = async () => {
    const url = `${baseUrl}api/v1/medical/admin-update/medical-report`;
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
    setEditingIndex(null);
    toast.success("report updated successfully");
    getReports();
  };

  const handleChange = (objectIndex, key, value) => {
    const newData = [...editedData];
    newData[objectIndex][key] = value;
    setEditedData(newData);
  };

  const handleProductChange = (objectIndex, productIndex, key, value) => {
    const newData = [...editedData];
    // Skip mapping _id for products
    if (key === '_id') return;
    newData[objectIndex].product[productIndex][key] = value;
    setEditedData(newData);
  };
  const renderField = (objectIndex, key, value) => (
    <div
      key={key}
      className="p-2"
      style={{ display: 'grid', gridTemplateColumns: '1fr 2fr' }}
    >
      <span className="text-gray-600 font-semibold mb-1" style={{ fontSize: '13px' }}>
        {key}
      </span>
      {Array.isArray(value) ? (
        <></>
      ) : editingIndex === objectIndex ? (
        <input
          type="text"
          value={value}
          onChange={(e) => handleChange(objectIndex, key, e.target.value)}
          className="border-b border-gray-500"
        />
      ) : (
        <p style={{ fontSize: '13px', border: '1px solid black', padding: '2px' }}>
          {value}
        </p>
      )}
    </div>
  );

  // Renders a dropdown field for fields like "remark"
// Renders a dropdown field for fields like "remark"
const renderDropdownField = (objectIndex, key, value, options) => (
  <div
    key={key}
    className="p-2"
    style={{ display: 'grid', gridTemplateColumns: '1fr 2fr' }}
  >
    <span className="text-gray-600 font-semibold mb-1" style={{ fontSize: '13px' }}>
      {key}
    </span>
    {editingIndex === objectIndex ? (
      <select
        value={value}
        onChange={(e) => handleChange(objectIndex, key, e.target.value)}
        className="border-b border-gray-500 p-1"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    ) : (
      <p style={{ fontSize: '13px', border: '1px solid black', padding: '2px' }}>
        {value || "No Remark"}
      </p>
    )}
  </div>
);


  // const fieldGroups = [
  //   ['File No', 'Ref No', 'Con No'],
  //   ['Sales Date', 'mail Address', 'City'],
  //   ['Customer Phone', 'Record No', 'Invoice No'],
  //   ['Dispatch Date', 'Sales Time', 'Agent Name'],
  //   ['State', 'Credit card type', 'Entry Date'],
  //   ['courier name', 'Dispatch By', 'customer name'],
  //   ['Address', 'zip', 'credit card no'],
  // ];
  const fieldGroups = [
    ['File No', 'Record No', 'Entry Date'],
    ['Ref No', 'Invoice No', 'courier name'],
    ['Con No', 'Dispatch Date', 'Dispatch By'],
    ['Sales Date', 'Sales Time', 'customer name'],
    ['mail Address', 'Agent Name', 'Address'],
    ['City', 'State', 'zip'],
    ['Customer Phone', 'Credit card type', 'credit card no'],
  ];
 console.log(editedData,'editedDataeditedData')
  return (
    <>
    <Header/>
    <div className="container mx-auto">
      {editedData.length > 0 &&
        editedData.map((object, objectIndex) => {
          const mainEntries = Object.entries(object).filter(([key]) => 
            !['_id', '__v', 'product', 'credit card no', 'Total', 'amount in words', 'createdAt', 'updatedAt','remark','discount','netAmount'].includes(key)
          )
          const columnLength = Math.ceil(mainEntries.length / 3)

          return (
            <div
              key={objectIndex}
              className="bg-gray-100 p-4 rounded-lg shadow-md mb-6"
            >
             <div className="grid grid-rows-7 gap-4 mb-6">
              {fieldGroups.map((group, rowIndex) => (
                <div key={rowIndex} className="grid grid-cols-3 gap-4">
                  {group.map((key, colIndex) => (
                    <div key={colIndex}>
                      {renderField(objectIndex, key, object[key])}
                    </div>
                  ))}
                </div>
              ))}
            </div>
              
            

            <div style={{borderTop:'1px solid black', paddingTop:'20px'}}>
  <h3 className="text-lg font-semibold mb-4 text-center">Product Data</h3>
  {object?.product?.map((product, productIndex) => (
    <div key={productIndex} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
      {['productNo', 'qty', 'productName', 'rate'].map((prodKey, idx) => {
        const prodValue = product[prodKey];
        if (prodValue === undefined) return null; // Skip undefined values

        return (
          <div key={idx} className="p-2" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr' }}>
            <div className="text-gray-500 font-semibold mb-1" style={{ fontSize: '13px' }}>
              {prodKey}
            </div>
            {editingIndex === objectIndex ? (
              <input
                type="text"
                value={prodValue}
                onChange={(e) =>
                  handleProductChange(objectIndex, productIndex, prodKey, e.target.value)
                }
                className="border-b border-gray-500"
              />
            ) : (
              <div className="p-2" style={{ border: '1px solid black' }}>
                {prodValue}
              </div>
            )}
          </div>
        );
      })}
    </div>
  ))}
</div>



<div className="mb-6" style={{ borderTop: '1px solid black', paddingTop: '20px' }}>
  <h3 className="text-lg font-semibold mb-4 text-center">Total Info</h3>
  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
    {['discount', 'Total', 'netAmount', 'amount in words', 'remark'].map((key) =>
      key === 'remark'
        ? renderDropdownField(objectIndex, key, object[key], remarkOptions)
        : renderField(objectIndex, key, object[key])
    )}
  </div>
</div>



              <div className="mt-6">
                {editingIndex === objectIndex ? (
                  <Button
                    onClick={handleSave}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Save
                  </Button>
                ) : (
                  <Button
                    onClick={() => handleEdit(objectIndex)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Edit
                  </Button>
                )}
              </div>
            </div>
          )
        })}
    </div>
      <ToastContainer />
    </>
  );
};

export default AdminMedicalTable;

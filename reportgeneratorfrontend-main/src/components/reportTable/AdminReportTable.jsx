import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { useParams } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { baseUrl } from "@/baseUrl";

const remarkOptions = ["", "N.A.", "FORM DETAILS ARE NOT FOUND", "FIELD NAME IS MISSING"];

const AdminReportTable = () => {
  const [editableRow, setEditableRow] = useState(null);
  const [editedData, setEditedData] = useState([]);
  const [data, setData] = useState([]);
  const { reportId } = useParams();

  const getReports = async () => {
    try {
      const url = `${baseUrl}api/v1/telecom/get-admin-report/${reportId}`;
      const res = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      setData([res?.data?.data]);
    } catch (error) {
      console.error("Error fetching reports:", error);
    }
  };

  useEffect(() => {
    getReports();
  }, []);

  const onEdit = (row) => {
    setEditableRow(row);
    setEditedData({ ...row });
  };

  const handleChange = (e, key) => {
    const { value } = e.target;
    setEditedData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  const handleSave = async () => {
    const updatedData = data.map((row) =>
      row === editableRow ? editedData : row
    );
    const url = `${baseUrl}api/v1/telecom/admin-update/telecom-report`;
    await axios.put(
      url,
      {
        id: updatedData[0]._id,
        data: updatedData[0],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    getReports();
    setEditableRow(null);
    setEditedData({});
    toast.success("Report updated successfully");
  };

  const fieldOrder = [
    "File No", "Record No", "invoice no", "Invoice date", "phone No", 
    "price plans", "Device Name", "phone cost", "monthly cost", "MMS", 
    "texts", "extra value included", "customer type", "cust name", 
    "initials", "company name", "cust address", "email", "city", 
    "state", "zip", "residence type", "agent no", "agent name", 
    "agency code", "agency name", "deposit", "balance", "Credit card type", 
    "credit card no", "card expiry date", "Credit rate", "remark"
  ];

  return (
    <>
      <div className="w-full p-4">
        {data.map((row, index) => (
          <div key={index} className="bg-white shadow-md rounded-lg p-6 mb-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {fieldOrder.map((key, i) => {
                if (row[key] === undefined) return null;
                return (
                  <div key={i} className="flex items-center">
                    <label className="uppercase font-semibold text-gray-700 w-40">
                      {key}:
                    </label>
                    <div className="flex-grow">
                      {editableRow === row ? (
                        key === "remark" ? (
                          <select
                            name={key}
                            value={editedData[key]}
                            onChange={(e) => handleChange(e, key)}
                            className="w-full px-2 py-1 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                          >
                            {remarkOptions.map((option, idx) => (
                              <option key={idx} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type={key === "Invoice date" || key === "card expiry date" ? "date" : "text"}
                            name={key}
                            value={editedData[key]}
                            onChange={(e) => handleChange(e, key)}
                            className="w-full px-2 py-1 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        )
                      ) : (
                        <span className="text-gray-600">{row[key]}</span>
                      )}
                    </div>
                  </div>
                );
              })}
              <div className="flex justify-start mt-4">
                {editableRow === row ? (
                  <Button size="sm" className="bg-green-500 text-white px-4 py-2 rounded-md" onClick={handleSave}>
                    Save
                  </Button>
                ) : (
                  <Button size="sm" className="bg-blue-500 text-white px-4 py-2 rounded-md" onClick={() => onEdit(row)}>
                    Edit
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      <ToastContainer />
    </>
  );
};

export default AdminReportTable;

// import axios from 'axios';
// import React, { useState } from 'react';
// import * as XLSX from 'xlsx/xlsx.mjs';

// const TodaysReport = ({ id }) => {
//     const [startDate, setStartDate] = useState('');
//     const [endDate, setEndDate] = useState('');
//     const [reportData, setReportData] = useState([]);

//     const handleChange = (event) => {
//         const { name, value } = event.target;
//         if (name === 'startDate') {
//             setStartDate(value);
//         } else {
//             setEndDate(value);
//         }
//     };
//     const generateReport = async () => {
//         try {
//             const url = `https://api.sagarsinghawesome.com/api/v1/user/get-todays-reports/${id}`;
//             // const dates = { startDate, endDate }
//             const res = await axios.get(url, {
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 withCredentials: true,
//             });
//             // console.log(url);
//             console.log(res);
//             setReportData(res?.data?.data);
//         } catch (error) {
//             console.error("Error fetching reports:", error);
//         }
//     };
//     // const generateReport = () => {
//     //     // Logic to generate report data between startDate and endDate
//     //     // For demo, let's create a sample data
//     //     const data = [
//     //         ['Name', 'Age'],
//     //         ['John', 30],
//     //         ['Doe', 25]
//     //     ];

//     //     setReportData(data); // Set the report data

//     //     // Optionally, you can also set the report data based on an API call or any other data source
//     // };

//     const exportToExcel = () => {
//         // Create a workbook with a worksheet
//         const wb = XLSX.utils.book_new();

//         // Convert array of objects to array of arrays
//         const data = reportData.map(item => {
//             // Extract values from each object
//             const productsString = item?.product?.map(product => `${product.productName}: ${product.rate} (${product.qty})`).join(', ');

//             const values = Object.values(item);
//             // Replace the 'product' property with the stringified products
//             values[values?.indexOf(item.product)] = productsString;
//             return values;
//         });
//         console.log("data", data)

//         // Prepend headers to the data
//         const headers = Object.keys(reportData[0]);
//         data.unshift(headers);

//         const ws = XLSX.utils.aoa_to_sheet(data);
//         XLSX.utils.book_append_sheet(wb, ws, 'Report');

//         // Generate a downloadable file
//         XLSX.writeFile(wb, 'today-report.xlsx');
//     };

//     return (
//         <div className="p-4 bg-gray-100">
//             <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2" onClick={generateReport}>Generate Report</button>
//             {reportData.length > 0 && (
//                 <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" onClick={exportToExcel}>Download Report</button>
//             )}
//             {reportData.length === 0 ? (
//                 <h2>no reports available yet</h2>
//             ) : ""}
//         </div>
//     );
// }

// export default TodaysReport



import React from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver';
import { baseUrl } from '@/baseUrl';

const TodaysReport = ({ id }) => {
    const handleDownload = async () => {
        try {
            const url = `${baseUrl}api/v1/user/get-protected-html-reports/${id}`
            const response = await axios.post(url, {}, {
                responseType: 'blob', // Ensure the response type is 'blob' to handle binary data
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true,
            });
            console.log(response)
            if (response.data.message === "haven't generated any report today") {
                alert(response.data.message)
            }
            else {
                // Download HTML
                const blob = new Blob([response.data], { type: 'text/html' });
                const filename = `User_Protected_Report_${new Date().toISOString().split('T')[0]}.html`;
                saveAs(blob, filename);

            }
        } catch (error) {
            alert('You dont have the sufficient permission to view the report')
            console.error('Error downloading the file', error);
        }
    };

    return (
        <div className="bg-gray-100  flex items-center justify-center">
            <div className=" p-10 rounded ">
                <h1 className="text-2xl font-bold mb-4">Download your daily backup</h1>
                <button onClick={handleDownload} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Download
                </button>
            </div>
        </div>
    );
};

export default TodaysReport;





import { baseUrl } from '@/baseUrl';
import axios from 'axios';
import React, { useState } from 'react';
import * as XLSX from 'xlsx/xlsx.mjs';

const DownloadReport = ({ id }) => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [reportData, setReportData] = useState([]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        if (name === 'startDate') {
            setStartDate(value);
        } else {
            setEndDate(value);
        }
    };
    const generateReport = async () => {
        try {
            const url = `${baseUrl}api/v1/user/get-filtered-html-reports/${id}`;
            const dates = { startDate, endDate };

            const res = await axios.post(url, dates, {
                responseType: 'text', // Only change needed here
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true,
            });

            // Try to parse as JSON first (error messages)
            try {
                const jsonResponse = JSON.parse(res.data);
                alert(jsonResponse.message || 'No reports available');
                return;
            } catch (parseError) {
                // If parsing fails, it's HTML - proceed with download
            }

            // Download HTML
            const blob = new Blob([res.data], { type: 'text/html' });
            const filename = `User_Report_${new Date().toISOString().split('T')[0]}.html`;
            saveAs(blob, filename);

        } catch (error) {
            console.error("Error downloading report:", error);
            alert('You do not have access to download this file');
        }
    };    // const generateReport = () => {
    //     // Logic to generate report data between startDate and endDate
    //     // For demo, let's create a sample data
    //     const data = [
    //         ['Name', 'Age'],
    //         ['John', 30],
    //         ['Doe', 25]
    //     ];

    //     setReportData(data); // Set the report data

    //     // Optionally, you can also set the report data based on an API call or any other data source
    // };

    // const exportToExcel = () => {
    //     // Create a workbook with a worksheet
    //     const wb = XLSX.utils.book_new();

    //     // Convert array of objects to array of arrays
    //     // const data = reportData.map(item => Object.values(item));
    //     const data = reportData.map(item => {
    //         // Extract values from each object
    //         const productsString = item?.product?.map(product => `${product.productName}: ${product.rate} (${product.qty})`).join(', ');

    //         const values = Object.values(item);
    //         // Replace the 'product' property with the stringified products
    //         values[values?.indexOf(item.product)] = productsString;
    //         return values;
    //     });
    //     console.log("data", data)
    //     // Prepend headers to the data
    //     const headers = Object.keys(reportData[0]);
    //     data.unshift(headers);

    //     const ws = XLSX.utils.aoa_to_sheet(data);
    //     XLSX.utils.book_append_sheet(wb, ws, 'Report');

    //     // Generate a downloadable file
    //     XLSX.writeFile(wb, 'report.xlsx');
    // };

    return (
        <div className="p-4 bg-gray-100">
            <div className='flex items-center gap-3'>

                <label className="block mb-2">Start Date:</label>
                <input className="border rounded py-1 px-2 mb-2" type="date" name="startDate" value={startDate} onChange={handleChange} />
            </div>
            <br />
            <div className='flex items-center gap-3'>

                <label className="block mb-2">End Date:</label>
                <input className="border rounded py-1 px-2 mb-2" type="date" name="endDate" value={endDate} onChange={handleChange} />
            </div>
            <br />

            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2" onClick={generateReport}>Generate Report</button>
            {/* {reportData.length > 0 && (
                <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" onClick={exportToExcel}>Download Report</button>
            )} */}
        </div>
    );
};

export default DownloadReport;

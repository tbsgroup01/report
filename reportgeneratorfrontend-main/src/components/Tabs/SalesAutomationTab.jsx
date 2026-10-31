// import { setTitle } from "@/app/features/medicalslice";
// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// const form1 = [
//   {
//     label: "File No",
//     inputType: "text",
//     name: "File No",
//   },
//   {
//     label: "Ref No",
//     inputType: "text",
//     name: "Ref No",
//   },
//   {
//     label: "Con No",
//     inputType: "text",
//     name: "Con No",
//   },
//   {
//     label: "Sales Date",
//     inputType: "text",
//     name: "Sales Date",
//   },
//   {
//     label: "mail Address",
//     inputType: "email",
//     name: "mail Address",
//   },
//   {
//     label: "City",
//     inputType: "text",
//     name: "City",
//   },
//   {
//     label: "Customer Phone",
//     inputType: "text",
//     name: "Customer Phone",
//   },
// ];
// const form2 = [
//   {
//     label: "Record No",
//     inputType: "text",
//     name: "Record No",
//   },
//   {
//     label: "Invoice No",
//     inputType: "text",
//     name: "Invoice No",
//   },
//   {
//     label: "Dispatch Date",
//     inputType: "text",
//     name: "Dispatch Date",
//   },
//   {
//     label: "Sales Time",
//     inputType: "text",
//     name: "Sales Time",
//   },
//   {
//     label: "Agent Name",
//     inputType: "text",
//     name: "Agent Name",
//   },
//   {
//     label: "State",
//     inputType: "text",
//     name: "State",
//   },
//   {
//     label: "Credit card type",
//     inputType: "text",
//     name: "Credit card type",
//   },

// ];
// const form3 = [
//   {
//     label: "Entry Date",
//     inputType: "text",
//     name: "Entry Date",
//   },
//   {
//     label: "courier name",
//     inputType: "text",
//     name: "courier name",
//   },
//   {
//     label: "Dispatch By",
//     inputType: "text",
//     name: "Dispatch By",
//   },
//   {
//     label: "customer name",
//     inputType: "text",
//     name: "customer name",
//   },
//   {
//     label: "Address",
//     inputType: "text",
//     name: "Address",
//   },

//   {
//     label: "zip",
//     inputType: "text",
//     name: "zip",
//   },
//   {
//     label: "credit card no",
//     inputType: "text",
//     name: "credit card no",
//   },
// ];

// // const SalesAutomationTab = () => {
// //   const [formData, setFormData] = useState({});
// //   const dispatch = useDispatch();
// //   const { imageName } = useSelector((state) => state.image);

// //   const handleChange = (e) => {
// //     setFormData({
// //       ...formData,
// //       [e.target.name]: e.target.value,
// //     });

// //     dispatch(setTitle(formData));
// //     console.log(formData);
// //   };

// //   const handleSubmit = (e) => {
// //     e.preventDefault();
// //     // Access form data from formData state
// //     console.log(formData);
// //     // Reset form data
// //     // setFormData({});
// //   };

// //   return (
// //     <form
// //       className="grid bg-blue-50 md:grid-cols-3 gap-5 p-4 "
// //       onSubmit={handleSubmit}
// //     >
// //       <div className="">
// //         {form1.map((entry) => (
// //           <div key={entry.label} className="flex justify-between my-2">
// //             <label className="uppercase" htmlFor={entry.label}>
// //               {entry.label}:
// //             </label>
// //             <input
// //               type={entry.inputType}
// //               id={entry.name}
// //               name={entry.name}
// //               onChange={handleChange}
// //             />
// //           </div>
// //         ))}
// //       </div>
// //       <div>
// //         {form2.map((entry) => (
// //           <div key={entry.label} className="flex justify-between my-2">
// //             <label className="uppercase" htmlFor={entry.label}>
// //               {entry.label}:
// //             </label>
// //             <input
// //               type={entry.inputType}
// //               id={entry.name}
// //               name={entry.name}
// //               onChange={handleChange}
// //             />
// //           </div>
// //         ))}
// //       </div>
// //       <div>
// //         {form3.map((entry) => (
// //           <div key={entry.label} className="flex justify-between my-2">
// //             <label className="uppercase" htmlFor={entry.label}>
// //               {entry.label}:
// //             </label>
// //             <input
// //               type={entry.inputType}
// //               id={entry.name}
// //               name={entry.name}
// //               onChange={handleChange}
// //             />
// //           </div>
// //         ))}
// //       </div>
// //       {/* <button type="submit">Submit</button> */}
// //     </form>
// //   );
// // };

// // export default SalesAutomationTab;

// // const SalesAutomationTab = () => {
// //   const { imageName } = useSelector((state) => state.image);
// //   const { recordNumber } = useSelector((state) => state.job);
// //   const [formData, setFormData] = useState({
// //     "File No": imageName,
// //     "Record No": recordNumber,
// //     "Ref No": "Mb_Sales-Med-Np#-l44604#1I @as-PUC1a#- 00000",
// //     "Entry Date": new Date().toISOString().slice(0, 10), // Prefill with current date
// //     "Invoice No": "SP-l7700IOOI", // Prefill with the specified invoice number
// //   });

// //   const dispatch = useDispatch();

// //   const handleChange = (e) => {
// //     setFormData({
// //       ...formData,
// //       [e.target.name]: e.target.value,
// //     });

// //     dispatch(setTitle(formData));
// //     // console.log(formData);
// //   };

// //   const handleSubmit = (e) => {
// //     e.preventDefault();
// //     // Access form data from formData state
// //     // console.log(formData);
// //     // Reset form data
// //     // setFormData({});
// //   };

// //   // Update the File No field when imageName changes
// //   useEffect(() => {
// //     setFormData((prevFormData) => ({
// //       ...prevFormData,
// //       "File No": imageName,
// //       "Record No": recordNumber,
// //     }));
// //   }, [imageName, recordNumber]);

// //   return (
// //     <form
// //       className="grid bg-blue-50 md:grid-cols-3 gap-5 p-4 "
// //       onSubmit={handleSubmit}
// //     >
// //       <div className="">
// //         {form1.map((entry) => (
// //           <div key={entry.label} className="flex justify-between my-2">
// //             <label className="uppercase" htmlFor={entry.label}>
// //               {entry.label}:
// //             </label>
// //             <input
// //               type={entry.inputType}
// //               id={entry.name}
// //               name={entry.name}
// //               onChange={handleChange}
// //               value={formData[entry.name]} // Set value from formData state
// //             />
// //           </div>
// //         ))}
// //       </div>
// //       <div>
// //         {form2.map((entry) => (
// //           <div key={entry.label} className="flex justify-between my-2">
// //             <label className="uppercase" htmlFor={entry.label}>
// //               {entry.label}:
// //             </label>
// //             <input
// //               type={entry.inputType}
// //               id={entry.name}
// //               name={entry.name}
// //               onChange={handleChange}
// //               value={formData[entry.name]} // Set value from formData state
// //             />
// //           </div>
// //         ))}
// //       </div>
// //       <div>
// //         {form3.map((entry) => (
// //           <div key={entry.label} className="flex justify-between my-2">
// //             <label className="uppercase" htmlFor={entry.label}>
// //               {entry.label}:
// //             </label>
// //             <input
// //               type={entry.inputType}
// //               id={entry.name}
// //               name={entry.name}
// //               onChange={handleChange}
// //               value={formData[entry.name]} // Set value from formData state
// //             />
// //           </div>
// //         ))}
// //       </div>
// //       {/* <button type="submit">Submit</button> */}
// //     </form>
// //   );
// // };

// // export default SalesAutomationTab;



// // import React, { useState } from "react";

// const combinedForm = [
//   {
//     label: "File No",
//     inputType: "text",
//     name: "File No",
//   },
//   {
//     label: "Record No",
//     inputType: "text",
//     name: "Record No",
//   },
//   {
//     label: "Entry Date",
//     inputType: "text",
//     name: "Entry Date",
//   },
//   {
//     label: "Ref No",
//     inputType: "text",
//     name: "Ref No",
//   },
//   {
//     label: "Invoice No",
//     inputType: "text",
//     name: "Invoice No",
//   },
//   {
//     label: "courier name",
//     inputType: "text",
//     name: "courier name",
//   },
//   {
//     label: "Con No",
//     inputType: "text",
//     name: "Con No",
//   },
//   {
//     label: "Dispatch Date",
//     inputType: "text",
//     name: "Dispatch Date",
//   },
//   {
//     label: "Dispatch By",
//     inputType: "text",
//     name: "Dispatch By",
//   },
//   {
//     label: "Sales Date",
//     inputType: "text",
//     name: "Sales Date",
//   },
//   {
//     label: "Sales Time",
//     inputType: "text",
//     name: "Sales Time",
//   },
//   {
//     label: "customer name",
//     inputType: "text",
//     name: "customer name",
//   },
//   {
//     label: "mail Address",
//     inputType: "email",
//     name: "mail Address",
//   },
//   {
//     label: "Agent Name",
//     inputType: "text",
//     name: "Agent Name",
//   },
  
//   {
//     label: "Address",
//     inputType: "text",
//     name: "Address",
//   },
//   {
//     label: "City",
//     inputType: "text",
//     name: "City",
//   },
  
//   {
//     label: "State",
//     inputType: "text",
//     name: "State",
//   },
   
//   {
//     label: "zip",
//     inputType: "text",
//     name: "zip",
//   },
//   {
//     label: "Customer Phone",
//     inputType: "text",
//     name: "Customer Phone",
//   },
 

 

//   {
//     label: "Credit card type",
//     inputType: "text",
//     name: "Credit card type",
//   },

  

//   {
//     label: "credit card no",
//     inputType: "text",
//     name: "credit card no",
//   },
// ];

// const SalesAutomationTab = () => {
//   // const [formData, setFormData] = useState({});
//     const { imageName } = useSelector((state) => state.image);
//   const { recordNumber } = useSelector((state) => state.job);
//     const [formData, setFormData] = useState({
//     "File No": imageName,
//     "Record No": recordNumber,
//     "Ref No": "Mb_Sales-Med-Np#-l44604#1I @as-PUC1a#- 00000",
//     "Entry Date": new Date().toISOString().slice(0, 10), // Prefill with current date
//     "Invoice No": "SP-l7700IOOI", // Prefill with the specified invoice number
//   });

//   const dispatch = useDispatch();

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });

//     dispatch(setTitle(formData));
//     // console.log(formData);
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // Access form data from formData state
//     // console.log(formData);
//     // Reset form data
//     // setFormData({});
//   };

//   // Update the File No field when imageName changes
//   useEffect(() => {
//     setFormData((prevFormData) => ({
//       ...prevFormData,
//       "File No": imageName,
//       "Record No": recordNumber,
//     }));
//   }, [imageName, recordNumber]);

  

//   return (
//     <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-4">
//       {combinedForm.map((field) => (
//         <div key={field.name} className="flex justify-between">
//           <label htmlFor={field.name} className="block">
//             {field.label}:
//           </label>
//           <input
//             type={field.inputType}
//             id={field.name}
//             name={field.name}
//             onChange={handleChange}
//             value={formData[field.name] || ""}
//             className=" border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
//           />
//         </div>
//       ))}
//       {/* <button
//         type="submit"
//         className="col-span-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md"
//       >
//         Submit
//       </button> */}
//     </form>
//   );
// };

// export default SalesAutomationTab;



import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTitle } from "@/app/features/medicalslice";

const combinedForm = [
  { label: "File No", inputType: "text", name: "File No" },
  { label: "Record No", inputType: "text", name: "Record No" },
  { label: "Entry Date", inputType: "text", name: "Entry Date" },
  { label: "Ref No", inputType: "text", name: "Ref No" },
  { label: "Invoice No", inputType: "text", name: "Invoice No" },
  { label: "courier name", inputType: "text", name: "courier name" },
  { label: "Con No", inputType: "text", name: "Con No" },
  { label: "Dispatch Date", inputType: "text", name: "Dispatch Date" },
  { label: "Dispatch By", inputType: "text", name: "Dispatch By" },
  { label: "Sales Date", inputType: "text", name: "Sales Date" },
  { label: "Sales Time", inputType: "text", name: "Sales Time" },
  { label: "customer name", inputType: "text", name: "customer name" },
  { label: "mail Address", inputType: "email", name: "mail Address" },
  { label: "Agent Name", inputType: "text", name: "Agent Name" },
  { label: "Address", inputType: "text", name: "Address" },
  { label: "City", inputType: "text", name: "City" },
  { label: "State", inputType: "text", name: "State" },
  { label: "zip", inputType: "text", name: "zip" },
  { label: "Customer Phone", inputType: "text", name: "Customer Phone" },
  { label: "Credit card type", inputType: "text", name: "Credit card type" },
  { label: "credit card no", inputType: "text", name: "credit card no" },
];

const SalesAutomationTab = ({ formData, handleChange, resetForm }) => {
  const { imageName } = useSelector((state) => state.image);
  const { recordNumber } = useSelector((state) => state.job);

  const dispatch = useDispatch();

  useEffect(() => {
    handleChange({
      target: { name: "File No", value: imageName },
    });
    handleChange({
      target: { name: "Record No", value: recordNumber },
    });
  }, [imageName, recordNumber]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData,'formDataformDataformDataformData')
    console.log(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-4">
      {combinedForm.map((field) => (
        <div key={field.name} className="flex justify-between">
          <label htmlFor={field.name} className="block uppercase">
            {field.label}:
          </label>
          <input
            type={field.inputType}
            id={field.name}
            name={field.name}
            onChange={handleChange}
            value={formData[field.name] || ""}
            className="border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
          />
        </div>
      ))}
      {/* <div className="col-span-3 flex justify-end gap-4">
       
      </div> */}
    </form>
  );
};

export default SalesAutomationTab;

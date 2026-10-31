import { EditTitle } from '@/app/features/MedicalEditSlice';
import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
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

const EditSalesAutomationTab = () => {
    const { Edittitle } = useSelector(state => state.EditMedicalSlice)
    console.log(Edittitle);
    const dispatch = useDispatch()
    const handleChange = (e) => {
        let { name, value } = e.target;
        console.log(name, value);
       let data = { ...Edittitle, [name]: value };
        dispatch(EditTitle(data));
    }
    
    return (
       <>
        <form className="grid grid-cols-3 gap-4  ">
            {combinedForm.map((field) => (
                <div key={field.name} className="flex justify-between">
                    <label htmlFor={field.name} className="block uppercase">
                        {field.label}:
                    </label>
                    <input
                        type={field.inputType}
                        id={field.name}
                        name={field.name}
                        onChange={(e) => handleChange(e)}
                        value={Edittitle[field.name] || ""}
                        className="border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                    />
                </div>
            ))}
            <div className="col-span-3 flex justify-end gap-4">
                {/* <button
          type="button"
          onClick={resetForm}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md"
        >
          Reset
        </button> */}
                {/* <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md"
        >
          Submit
        </button> */}
            </div>
        </form>
       </>
    )
}

export default EditSalesAutomationTab
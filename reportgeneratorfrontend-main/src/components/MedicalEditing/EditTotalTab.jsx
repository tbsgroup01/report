import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { EditFormTotalTabData } from '@/app/features/MedicalEditSlice';
import { calculateNetAmount, calculateTotalAmount, numberToWords } from '@/Utils/product';
const form1 = [
    {
        label: "discount",
        inputType: "text",
        name: "discount",
    },
    {
        label: "Total",
        inputType: "text",
        name: "Total",
    },
    {
        label: "netAmount",
        inputType: "text",
        name: "netAmount",
    },
    {
        label: "amount in words",
        inputType: "text",
        name: "amountInWords",
    },
    {
        label: "remark",
        name: "remark",
    },
];

const selectValues = [
    "N.A.",
    "FORM DETAILS ARE NOT FOUND",
    "FIELD NAME IS MISSING",
];
const EditTotalTab = () => {
    const { EditformTotalTabData,Editproducts } = useSelector(state => state.EditMedicalSlice)
    console.log(EditformTotalTabData,Editproducts)
    const dispatch = useDispatch();
    const handleSubmit = () => { }
    const handleFocus = () => {
        const totalAmount = calculateTotalAmount(Editproducts);
        const netAmount = calculateNetAmount(totalAmount, EditformTotalTabData?.discount);
        const amountInWords = numberToWords(netAmount);
        console.log(totalAmount,netAmount,amountInWords)
    
        // Update formData in Redux
        dispatch(EditFormTotalTabData({
          ...EditformTotalTabData,
          Total: totalAmount,
          netAmount: netAmount,
          amountInWords: amountInWords,
        }));
      };
    
      const handleChange = (e) => {
        const { name, value } = e.target;
        // Update local formData
        console.log(name,value)
        dispatch(EditFormTotalTabData({
          ...EditformTotalTabData,
          [name]: value,
        }));
      };
    
      const handleSelectChange = (value) => {
        // Update formData with selected remark
        dispatch(EditFormTotalTabData({
          ...EditformTotalTabData,
          remark: value,
        }));
    
        console.log(EditformTotalTabData);
    
        // Dispatch setRemark action immediately
        // dispatch(setRemark(value));
      };
    return (
        <form className="grid bg-blue-50 grid-cols-1 p-4" onSubmit={handleSubmit}>
            <div className="md:w-[40%]">
                {form1.map((entry) => (
                    <div className="flex justify-between my-2" key={entry.label}>
                        <label className="uppercase" htmlFor={entry.label}>
                            {entry.label}:
                        </label>
                        {entry.label !== "remark" ? (
                            <input
                                className="w-[200px] uppercase"
                                type={entry.inputType}
                                id={entry.name}
                                name={entry.name}
                                onChange={handleChange}
                                onFocus={handleFocus}
                                value={EditformTotalTabData[entry.name] || ""}
                            />
                        ) : (
                            <div className="w-[200px]">
                                <Select name="remark" onValueChange={handleSelectChange} value={EditformTotalTabData?.remark}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="SELECT REMARK" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {selectValues.map((value) => (
                                            <SelectItem
                                                className="uppercase"
                                                key={value}
                                                value={value}
                                            >
                                                {value}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </form>
    )
}

export default EditTotalTab
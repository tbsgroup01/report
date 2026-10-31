// TotalTab.jsx

import React, { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useDispatch, useSelector } from "react-redux";
import {  setformTotalTabData } from "../../app/features/medicalslice";
import {
  calculateNetAmount,
  calculateTotalAmount,
  numberToWords,
} from "@/Utils/product";

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
    label: "Net Amount",
    inputType: "text",
    name: "netAmount",
  },
  {
    label: "amount in words",
    inputType: "text",
    name: "amount in words",
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

const TotalTab = () => {
  const { formTotalTabData,products } = useSelector((state) => state.medical);
  const dispatch = useDispatch();

  // Initialize formData on component mount
  useEffect(() => {
    // Only initialize formData if it's not already populated
    console.log(formTotalTabData)
    if (Object.keys(formTotalTabData).length === 0) {
      handleFocus(); // Perform initial calculations
    }
  }, []);

  const handleFocus = () => {
    const totalAmount = calculateTotalAmount(products);
    const netAmount = calculateNetAmount(totalAmount, formTotalTabData?.discount);
    const amountInWords = numberToWords(netAmount);

    // Update formData in Redux
    dispatch(setformTotalTabData({
      ...formTotalTabData,
      Total: totalAmount,
      netAmount: netAmount,
      'amount in words': amountInWords,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Update local formData
    dispatch(setformTotalTabData({
      ...formTotalTabData,
      [name]: value,
    }));
  };

  const handleSelectChange = (value) => {
    // Update formData with selected remark
    dispatch(setformTotalTabData({
      ...formTotalTabData,
      remark: value,
    }));

    console.log(formTotalTabData);

    // Dispatch setRemark action immediately
    // dispatch(setRemark(value));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic if needed
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
                value={formTotalTabData[entry.name] || ""}
              />
            ) : (
              <div className="w-[200px]">
                <Select name="remark" onValueChange={handleSelectChange} value={formTotalTabData?.remark}>
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
  );
};

export default TotalTab;

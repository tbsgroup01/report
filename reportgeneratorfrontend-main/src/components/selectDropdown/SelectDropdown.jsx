import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDispatch, useSelector } from "react-redux";
import { selectJob } from "@/app/features/jobSlice";

const SelectDropdown = () => {
  // const { job } = useSelector((state) => state.job);
  const job = sessionStorage.getItem('job');

  console.log(job, "New Job")
  // const job=localStorage.getItem('reportModel')
  const dispatch = useDispatch();

  return (
    <form className="flex justify-center items-center gap-2">
      <label htmlFor="jobs"> Jobs : </label>
      <div className="w-[300px] ">
        <Select
          name="jobs"
          onValueChange={(e) => {
            // console.log(e);
            // dispatch(selectJob(e));
          }}
          value={job}
          disabled={true} // Disable the Select dropdown

        >
          <SelectTrigger>
            <SelectValue placeholder="Select a job" />
          </SelectTrigger>
          <SelectContent value={localStorage.getItem('reportModel')}>
            <SelectItem value="telecom">telecom</SelectItem>
            <SelectItem value="medical">medical</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </form>
  );
};

export default SelectDropdown;

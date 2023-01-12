import { forwardRef, useState } from "react";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css"


export default function DateButton({onDateChange, startDate}) {
    
    const ExampleCustomInput = forwardRef(({ value, onClick }, ref) => (
      <button className="example-custom-input" onClick={onClick} ref={ref}>
        {value}
      </button>

    ));

    const changeDateMovs = (date) => {
        // console.log(date.toISOString().slice(0, 10));
        setStartDate(date);
        //reload grid
    }

    return (
      <DatePicker
        selected={startDate}
        onChange={(date) => onDateChange(date)}
        customInput={<ExampleCustomInput />}
      />
    );
  }

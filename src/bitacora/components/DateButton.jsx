import { Button, Tooltip } from "@mui/material";
import { forwardRef } from "react";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css"


export default function DateButton({onDateChange, startDate}) {
    
    const CustomInput = forwardRef(({ value, onClick }, ref) => (
      <Tooltip title="Cambiar fecha">
        <Button variant="contained" color="primary" onClick={onClick}><i className="fa-solid fa-calendar-days"></i> &nbsp; {value}</Button>
      </Tooltip>
    ));

    return (
    <div>
      <DatePicker
        selected={startDate}
        onChange={(date) => onDateChange(date)}
        customInput={<CustomInput />}
      />
    </div>
    );
  }

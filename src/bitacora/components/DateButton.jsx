import { Button, Tooltip } from "@mui/material";
import { forwardRef } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css"


export default function DateButton({onDateChange, startDate}) {
    
    const CustomInput = forwardRef(({ value, onClick }, ref) => (
      <Tooltip title="Cambiar fecha">
        <Button variant="contained" color="primary" onClick={onClick}>
          <FontAwesomeIcon icon={faCalendarAlt} /> &nbsp; {value}</Button>
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

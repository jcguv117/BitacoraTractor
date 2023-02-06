import { Button, Tooltip } from "@mui/material";
import { forwardRef, useRef } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css"


export default function DateButton({onDateChange, startDate}) {

  const ref = useRef(null);
    
    const CustomInput = forwardRef(({ value, onClick }, ref) => (
      <Tooltip title="Cambiar fecha">
        <Button id='datePicker'  variant="contained" color="primary" onClick={onClick} className="d-block" value={value}>
          <FontAwesomeIcon icon={faCalendarAlt} /> &nbsp; {value}</Button>
      </Tooltip>
    ));

    return (
    <div>
      <DatePicker
        ref={ref}
        selected={startDate}
        dateFormat="dd/MM/yyyy"
        onChange={(date) => onDateChange(date)}
        customInput={<CustomInput />}
      />
    </div>
    );
  }

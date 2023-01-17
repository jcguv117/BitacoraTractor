
import React, {
    forwardRef,
    memo,
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
  } from 'react';

const TimeEditor = memo(
    forwardRef((props, ref) => {
      const [value, setValue] = useState(props.value);
      const refInput = useRef(null);
  
      useEffect(() => {
        // focus on the input
        refInput.current.focus();
      }, []);
  
      /* Component Editor Lifecycle methods */
      useImperativeHandle(ref, () => {
        return {
          // the final value to send to the grid, on completion of editing
          getValue() {
            console.log(props);
            return value;
          },
  
          // Gets called once before editing starts, to give editor a chance to
          // cancel the editing before it even starts.
          isCancelBeforeStart() {
            return false;
          },
  
          // Gets called once when editing is finished (eg if Enter is pressed).
          // If you return true, then the result of the edit will be ignored.
          // isCancelAfterEnd() {
          //   return value + ':00';
          // },
        };
      });
  
      return (
        <input
          type='time'
          ref={refInput}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          className="form-control timeCell-input"
         />
      );
    })
  );

  export default TimeEditor;
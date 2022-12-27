import React, { useCallback, useMemo, useRef, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import getData from '../data';
  
  const GridTable = () => {
    const gridRef = useRef();
    const containerStyle = useMemo(() => ({ width: '100%', height: '100%' }), []);
    const gridStyle = useMemo(() => ({ height: '100%', width: '100%' }), []);
    const [rowData, setRowData] = useState(getData());
    const [columnDefs, setColumnDefs] = useState([
      { field: 'firstName' },
      { field: 'lastName' },
      { field: 'gender' },
      { field: 'age' },
      { field: 'mood' },
      { field: 'country' },
      { field: 'address', minWidth: 550 },
    ]);
    const defaultColDef = useMemo(() => {
      return {
        flex: 1,
        minWidth: 110,
        editable: false,
        resizable: true,
      };
    }, []);
    
  
    return (
      <div style={containerStyle}>
        <div className="example-wrapper">
          <div className="grid-wrapper">
            <div style={gridStyle} className="ag-theme-alpine">
              <AgGridReact
                ref={gridRef}
                rowData={rowData}
                columnDefs={columnDefs}
                defaultColDef={defaultColDef}
              ></AgGridReact>
            </div>
          </div>
        </div>
      </div>
    );
  };

export default GridTable;
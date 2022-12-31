import React, { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { Grid, Button } from '@mui/material';
import FormDialog from './DialogForm';

  const initialValue = { tractor: "", operador: "", caja: "", cliente: "", origen: "", destino: "", tipo: "", aduana: "", no_sello: "", hra_llegada: "" }
  const GridTable = () => {
    //FormDialog 
    const [gridApi, setGridApi] = useState(null)
    const [tableData, setTableData] = useState(null)
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState(initialValue)
    const handleClickOpen = () => {
      setOpen(true);
    };

    const url = `http://localhost:4000/bitacora`;
    // calling getBitacora function for first time 
    useEffect(() => {
      getBitacora()
    }, [])
    //fetching user data from server
    const getBitacora = () => {
      fetch(url).then(resp => resp.json()).then(resp => setTableData(resp))
    }

    const handleClose = () => {
      setOpen(false);
      setFormData(initialValue)
    };
    const onChange = (e) => {
      const { value, id } = e.target
      setFormData({ ...formData, [id]: value.toUpperCase() })
    }
    const onGridReady = (params) => {
      setGridApi(params)
    }
    
  // setting update row data to form data and opening pop up window
  const handleUpdate = (oldData) => {
    setFormData(oldData)
    handleClickOpen()
  }
  //deleting a user
  const handleDelete = (id) => {
    const confirm = window.confirm("Are you sure, you want to delete this row", id)
    if (confirm) {
      fetch(url + `/${id}`, { method: "DELETE" }).then(resp => resp.json()).then(resp => getBitacora())

    }
  }
  const handleFormSubmit = () => {
    if (formData.id) {
      //updating a user 
      const confirm = window.confirm("Are you sure, you want to update this row ?")
      confirm && fetch(url + `/${formData.id}`, {
        method: "PUT", body: JSON.stringify(formData), headers: {
          'content-type': "application/json"
        }
      }).then(resp => resp.json())
        .then(resp => {
          handleClose()
          getBitacora()

        })
    } else {
      // adding new user
      fetch(url, {
        method: "POST", body: JSON.stringify(formData), headers: {
          'content-type': "application/json"
        }
      }).then(resp => resp.json())
        .then(resp => {
          handleClose()
          getBitacora()
        })
    }
  }

    //Example Ag-grid
    const gridRef = useRef();
    const containerStyle = useMemo(() => ({ width: '100%', height: '100%' }), []);
    const gridStyle = useMemo(() => ({ height: '100%', width: '100%' }), []);
    const [columnDefs, setColumnDefs] = useState([
      {
        headerName: "Actions", field: "id", sortable: false, filter: false, minWidth: 170, cellRendererFramework: (params) => <div>
          <Button variant="outlined" color="primary" onClick={() => handleUpdate(params.data)}><i className="fa-solid fa-pen-to-square"></i></Button>
          <Button variant="outlined" color="secondary" onClick={() => handleDelete(params.value)}><i className="fa-solid fa-trash-can"></i></Button>
        </div>
      },
      { field: "id", headerName:"#", sort: 'desc' },
      { field: "tractor"},
      { field: "operador" },
      { field: "caja" },
      { field: "cliente" },
      { field: "origen" },
      { field: "destino" },
      { field: "tipo" },
      { field: "aduana" },
      { field: "no_sello" },
      { field: "hra_llegada" },
      { field: "hra_salida" },
      { field: "hra_rojo_mex" },
      { field: "hra_verde_mex" },
      { field: "hra_rojo_ame" },
      { field: "ent_insp" },
      { field: "sello_nuevo" },
      { field: "imporlot" },
      { field: "hra_entrega" },
      { field: "placas"},
      { field: "observacion", minWidth: 250 },
      { field: "sistema" }
    ]);

    const defaultColDef = useMemo(() => {
      return {
        flex: 1,
        minWidth: 110,
        editable: true,
        resizable: true,
        sortable: true,
        filter: true,
      };
    }, []);

    const onBtnExport = useCallback(() => {
      gridRef.current.api.exportDataAsCsv();
    }, []);
    
    const onCellEditingStarted = useCallback((event) => {
      console.log('cellEditingStarted');
      // console.log(event);
    }, []);

    const onCellEditingStopped = useCallback((event) => {
      console.log('cellEditingStopped');
      // setFormData(event.data);
      setFormData({...formData, hra_llegada: '10.30' });
      console.log(formData);
      // console.log({ ...event.data, hra_llegada: event.value.toUpperCase() });
      // handleFormSubmit();
    }, []);
  
    return (
      <div style={containerStyle}>
        <div className="example-wrapper">
          <div className="grid-wrapper">
          <Grid align="right">
              <Button variant="contained" color="primary" onClick={onBtnExport}><i className="fa-solid fa-file-export"></i> Exportar a CSV</Button>
              <Button variant="contained" color="primary" onClick={handleClickOpen}><i className="fa-solid fa-plus"></i> Agregar</Button>
          </Grid>
            <div style={gridStyle} className="ag-theme-alpine">
              <AgGridReact
                ref={gridRef}
                rowData={tableData}
                columnDefs={columnDefs}
                defaultColDef={defaultColDef}
                pagination={true}
                onCellEditingStarted={onCellEditingStarted}
                onCellEditingStopped={onCellEditingStopped}
              ></AgGridReact>
            </div>
            <FormDialog open={open} handleClose={handleClose}
              data={formData} onChange={onChange} handleFormSubmit={handleFormSubmit} />
          </div>
        </div>
      </div>
    );
  };

export default GridTable;
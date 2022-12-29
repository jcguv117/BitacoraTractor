import React, { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { Grid, Button } from '@mui/material';
import FormDialog from './DialogForm';
import getData from '../datos';

  // const initialValue = { name: "", email: "", phone: "", dob: "" }
  const initialValue = { tractor: "", operador: "", caja: "", cliente: "", origen: "", destino: "", tipo: "", aduana: "", no_sello: "" }
  const GridTable = () => {
    //FormDialog 
    const [gridApi, setGridApi] = useState(null)
    const [tableData, setTableData] = useState(null)
    const [open, setOpen] = React.useState(false);
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
      // console.log(value,id)
      setFormData({ ...formData, [id]: value })
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
    // const [rowData, setRowData] = useState(getData());
    const [rowData, setRowData] = useState(getData());
    const [columnDefs, setColumnDefs] = useState([
      { field: "id" },
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
      { field: "observacion" },
      { field: "placas"},
      { field: "sistema", minWidth: 550  },
      {
        headerName: "Actions", field: "id", minWidth: 250, cellRendererFramework: (params) => <div>
          <Button variant="outlined" color="primary" onClick={() => handleUpdate(params.data)}>Actualizar</Button>
          <Button variant="outlined" color="secondary" onClick={() => handleDelete(params.value)}>Eliminar</Button>
        </div>
      }
    ]);
    const defaultColDef = useMemo(() => {
      return {
        flex: 1,
        minWidth: 110,
        editable: false,
        resizable: true,
        sortable: true,
        filter: true,
      };
    }, []);

    const onBtnExport = useCallback(() => {
      gridRef.current.api.exportDataAsCsv();
    }, []);
    
  
    return (
      <div style={containerStyle}>
        <div className="example-wrapper">
        <div style={{ margin: '10px 0' }}>
          <button onClick={onBtnExport}>Download CSV export file</button>
        </div>
          <div className="grid-wrapper">
          <Grid align="right">
              <Button variant="contained" color="primary" onClick={handleClickOpen}>Agregar</Button>
          </Grid>
            <div style={gridStyle} className="ag-theme-alpine">
              <AgGridReact
                ref={gridRef}
                rowData={tableData}
                columnDefs={columnDefs}
                defaultColDef={defaultColDef}
                pagination={true}
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
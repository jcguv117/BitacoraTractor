import React, { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { Grid, Button } from '@mui/material';
import { appApi } from '../../api';
import FormDialog from './DialogForm';

  const initialValue = { tractor: "", operador: "", caja: "", cliente: "", origen: "", destino: "", tipo: "", aduana: "", no_sello: "", hra_llegada: "" }
  const PanelTable = () => {
    //FormDialog 
    const [gridApi, setGridApi] = useState(null)
    const [tableData, setTableData] = useState(null)
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState(initialValue)
    const handleClickOpen = () => {
      setOpen(true);
    };

    const url = `http://localhost:8000/api/usuarios`;

    // calling getUsuarios function for first time 
    useEffect(() => {
      getUsuarios()
    }, [])

    //fetching user data from server
    const getUsuarios = async() => {
        const { data } = await appApi.get('/usuarios');
        setTableData(data.usuarios);
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
    const confirm = window.confirm("¿Está seguro/a de borrar el registro?", id)
    if (confirm) {
      fetch(url + `/${id}`, { method: "DELETE" }).then(resp => resp.json()).then(resp => getUsuarios())

    }
  }

  const handleFormSubmit = () => {
    if (formData.id) {
      //updating a user 
      const confirm = window.confirm("¿Está seguro/a de actualizar el registro?")
      confirm && fetch(url + `/${formData.id}`, {
        method: "PUT", body: JSON.stringify(formData), headers: {
          'content-type': "application/json"
        }
      }).then(resp => resp.json())
        .then(resp => {
          handleClose()
          getUsuarios()

        })
    } else {
      // adding new user
      fetch(url+'/new', {
        method: "POST", body: JSON.stringify(formData), headers: {
          'content-type': "application/json"
        }
      }).then(resp => resp.json())
        .then(resp => {
          handleClose()
          getUsuarios()
        })
    }
  }

    //Example Ag-grid
    const gridRef = useRef();
    const containerStyle = useMemo(() => ({ width: '100%', height: '100%' }), []);
    const gridStyle = useMemo(() => ({ height: '100%', width: '100%' }), []);
    const [columnDefs, setColumnDefs] = useState([
      {
        headerName: "Acciones", field: "id", sortable: false, filter: false, minWidth: 170, 
        cellRenderer: (params) => <div>
          <Button variant="outlined" color="primary" onClick={() => handleUpdate(params.data)}><i className="fa-solid fa-pen-to-square"></i></Button>
          <Button variant="outlined" color="secondary" onClick={() => handleDelete(params.value)}><i className="fa-solid fa-trash-can"></i></Button>
        </div>
      },
      { field: "id", headerName:"#", sort: 'desc'},
      { headerName:"Usuario", field: "user"},
      { headerName:"Nombre", field: "name" },
      { headerName:"Contraseña", field: "password" },
      { headerName: "Estado", field: "my_status" },
    ]);

    const defaultColDef = useMemo(() => {
      return {
        flex: 1,
        minWidth: 110,
        resizable: true,
        sortable: true,
        filter: true,
      };
    }, []);


    return (
      <div style={containerStyle}>
        <div className="example-wrapper">
          <div className="grid-wrapper">
          <Grid align="right">
              <Button variant="contained" color="primary" onClick={handleClickOpen}><i className="fa-solid fa-plus"></i> Agregar</Button>
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

export default PanelTable;
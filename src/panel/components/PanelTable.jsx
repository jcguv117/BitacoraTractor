import React, { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faPen, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { Grid, Button, Tooltip } from '@mui/material';
import { appApi } from '../../api';
import FormDialog from './DialogForm';
import Swal from 'sweetalert2';

  const customCellPermiso = (params) => {
      const {value} = params;
      if(value == 1 ) return 'Capturista';
      if(value == 2 ) return 'Ejecutivo';
      if(value == 3 ) return 'Gerencial';
      if(value == 9 ) return 'Administrador';
      return "";
   }

   const customSwal = (msg) =>{
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: msg,
      showConfirmButton: false,
      timer: 1500
    })
  }

  const confirmCustomSwal = (msg) =>{
    return Swal.fire({
      title: msg,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar'
    });
  }

  const initialValue = { user: "" , name: "", password: "", passRepeat: "", permiso: 0 }
  const PanelTable = () => {
    //FormDialog 
    const [tableData, setTableData] = useState(null)
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState(initialValue)
    const handleClickOpen = () => {
      setOpen(true);
    };

    const handleChange = (event) => {
      setFormData({...formData, permiso: event.target.value});
    };

    // calling getUsuarios function for first time 
    useEffect(() => {
      getUsuarios()
    }, [formData])

    //fetching user data from server
    const getUsuarios = async() => {
        const { data } = await appApi.get('/usuarios');
        setTableData(data.usuarios);
    }

    const handleClose = () => {
      setOpen(false);
      setFormData(initialValue)
    };

    const onChange = (e, upper = true) => {
      const { value, id } = e.target
      setFormData({ ...formData, [id]: (upper) ? value.toUpperCase() : value })
    }
   
  // setting update row data to form data and opening pop up window
  const handleUpdate = (oldData) => {
    setFormData({...oldData, passRepeat: ""});
    handleClickOpen()
  }

  //deleting a user
  const handleDelete = async(data) => {
    const {id} = data;
    const confirm = confirmCustomSwal("¿Está seguro/a de borrar el registro?")
      .then(async (result) => {
        if (result.isConfirmed) {
          await appApi.delete('/usuarios'+ `/${id}`)
            .then(resp => {
              getUsuarios()
              customSwal('Registro Eliminado...');
            });
        }
      });
  }

  const handleFormSubmit = async() => {
    if (formData.id) {
      //updating a user 
      const confirm = confirmCustomSwal("¿Está seguro/a de actualizar el registro?")
      .then(async (result) => {
        if (result.isConfirmed) {
          await appApi.put('/usuarios' + `/${formData.id}`, formData)
            .then(resp => {
              handleClose()
              getUsuarios()
              customSwal('Registro Actualizado...')
            });
        }
      });
    } else {
      // adding new user
      await appApi.post('/usuarios/new', formData)
        .then(resp => {
          handleClose()
          getUsuarios()
          customSwal('Registro Guardado...')
        })
    }
  }

    //Example Ag-grid
    const gridRef = useRef();
    const containerStyle = useMemo(() => ({ width: '100%', height: '100%' }), []);
    const gridStyle = useMemo(() => ({ height: '100%', width: '100%' }), []);
    const [columnDefs, setColumnDefs] = useState([
      {
        headerName: "Acciones", sortable: false, filter: false, minWidth: 170, 
        cellRenderer: (params) => <div>
          <Button variant="outlined" color="primary" onClick={() => handleUpdate(params.data)}><FontAwesomeIcon icon={faPen}/></Button>
          <Button variant="outlined" color="secondary" onClick={() => handleDelete(params.data)}><FontAwesomeIcon icon={faTrashAlt}/></Button>
        </div>
      },
      { field: "id", headerName:"#", sort: 'desc' , maxWidth: 70},
      { headerName:"Usuario", field: "user"},
      { headerName:"Nombre", field: "name" },
      { headerName:"Contraseña", field: "password", hide: true },
      { headerName: "Permiso", field: "permiso" , maxWidth: 150,
        cellRenderer: customCellPermiso}
    ]);

    const defaultColDef = useMemo(() => {
      return {
        flex: 1,
        minWidth: 110,
        resizable: true,
        sortable: true,
      };
    }, []);

    //fix navbar show up, overflow hidden
    document.querySelector("body").style.overflow = "auto";
    document.querySelector("body").style.paddingRight = "0px";

    return (
      <div style={containerStyle}>
        <div className="example-wrapper">
          <div className="grid-wrapper">
          <Grid align="right" className='d-flex justify-content-end gap-3 p-2'>
            <Tooltip title="Agregar Usuario">
              <Button variant="contained" color="primary" onClick={handleClickOpen}><FontAwesomeIcon icon={faUserPlus}/></Button>
            </Tooltip>
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
              data={formData} onChange={onChange} handleFormSubmit={handleFormSubmit} handleChange={handleChange} />
          </div>
        </div>
      </div>
    );
  };

export default PanelTable;
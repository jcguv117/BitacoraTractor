import React, { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faPen, faPlus, faFileExport } from '@fortawesome/free-solid-svg-icons';
import { Grid, Button, Tooltip } from '@mui/material';
import FormDialog from './DialogForm';
import DateButton from './DateButton';
import OptionCapturas from './OptionCapturas';
import { appApi } from '../../api';
import TimeEditor from './TimeEditor';
import Swal from 'sweetalert2';
import { useAuthStore } from '../../hooks';

  const cellEditorSelector = (params) => {
    return {
      component: TimeEditor,
      popup: true,
      popupPosition: 'under',
    };
  };

  const validarPermiso = (permiso, accion="") => {
    switch(accion){
      case 'add':
          if(permiso == 9 || permiso == 1 || permiso == 2 || permiso == 3) return true;
          else Swal.fire('Permiso Denegado', 'No tiene permiso para agregar', 'error');
        break;
      case 'update':
          if(permiso == 9 || permiso == 2 || permiso == 3) return true;
          else Swal.fire('Permiso Denegado', 'No tiene permiso para actualizar', 'error');
        break;
      case 'remove':
          if(permiso == 9 || permiso == 3) return true;
          else Swal.fire('Permiso Denegado', 'No tiene permiso para eliminar', 'error');
        break;
    }
    return false;
  }

  
  const initialValue = {
    tractor: "", operador: "", caja: "", cliente: "", origen: "", destino: "", tipo: "", aduana: "", no_sello: "", 
    hra_llegada: "", hra_salida: "", hra_rojo_mex: "", hra_verde_mex: "", hra_rojo_ame: "", ent_insp: "", sello_nuevo: "",
    imporlot: "", hra_entrega: "", placas: "" }
    
    const GridTable = () => {
    const { user } = useAuthStore();
    const [gridApi, setGridApi] = useState(null);
    const [tableData, setTableData] = useState(null);
    const [open, setOpen] = useState(false);
    const [editGridCell, setEditGridCell] = useState(false);
    const [formData, setFormData] = useState({...initialValue, idcaptura: "", fecha: ""});

    const [startDate, setStartDate] = useState(new Date());
    const [dataCaptura, setDataCaptura] = useState(1);
    const [optCaptura, setOptCaptura] = useState([{idcaptura: "", nombre: " - "}]);


    const handleClickOpen = () => {
      setOpen(true);
    };

    const handleClose = () => {
      setOpen(false);
      setFormData(initialValue)
    };

    useEffect(() => {
        getCapturas();
    }, [])

    // calling function for first time 
    useEffect(() => {
        getMovimientos()
    }, [dataCaptura, startDate])

    useEffect(() => {
      setInterval(() => {
        console.log("redraw")
        gridRef.current.api.redrawRows();
      }, 600000);
    }, [])

    useEffect(() => {
      editGridCell && handleUpdateMov();
    }, [formData])


    //get data from server
    const getMovimientos = async(date = "", idcaptura = 0) => {
      const fecha   = (date) ? date : startDate;
      const captura = (idcaptura) ? idcaptura : dataCaptura;
      console.log("getMovimientos ", fecha, captura);
        const { data } = await appApi.post('/movimientos', {captura, fecha});
        setTableData(data);
    }

    const getCapturas = async() => {
      const { data } = await appApi.get('/capturas');
      setOptCaptura(data.captura);
      setDataCaptura(data.captura[0].idcaptura);
  }    
    
    const onChange = (e) => {
      const { value, id } = e.target
      setFormData({ ...formData, [id]: value.toUpperCase() })
    }

    const onDateChange = (date) => {
      setStartDate(date);
    }

    const onOptionChange = (e) => {
      const { value } = e.target
      setDataCaptura(value);
    }

    const onGridReady = (params) => {
      setGridApi(params)
    }

  // setting update row data to form data and opening pop up window
  const handleUpdate = (oldData) => {
    setFormData(oldData)
    handleClickOpen()
  }

  const handleDeleteMov = async(data) => {
    const {idcaptura, fecha, id} = data;
    // if(!validarPermiso(user.permiso, "remove")) return;
    const confirm = window.confirm("¿Está seguro/a de borrar el registro?", id)
    if (confirm) {
      await appApi.delete('/movimientos', { params: { captura: idcaptura, fecha: fecha, id: id } })
        .then(resp => getMovimientos(fecha, idcaptura));
    }
  }

  const handleFormSubmitMov = async() => {
    const {tractor, operador, caja, cliente, origen, destino, tipo, aduana, no_sello } = formData;
    if (formData.id) {
      //updating movimiento
      // if(!validarPermiso(user.permiso, "update")) return;
      const confirm = window.confirm("¿Está seguro/a de actualizar el registro?");
      confirm && await appApi.put('/movimientos', {...formData, idcaptura: dataCaptura, fecha: startDate})
        .then(resp => {
          handleClose()
          getMovimientos()
        })
    } 
    else {
      // adding new movimiento
      // if(!validarPermiso(user.permiso, "add")) return;
      // if(formData.tipo != "EXPO" || formData.tipo != "IMPO")
      //       setFormData({...formData, hra_llegada: formData.tipo, hra_salida: formData.tipo, hra_rojo_mex: formData.tipo, hra_verde_mex: formData.tipo, hra_rojo_ame: formData.tipo, ent_insp: formData.tipo, sello_nuevo: formData.tipo,
      //       imporlot: formData.tipo, hra_entrega: formData.tipo, placas: formData.tipo})
      // else
      //       setFormData(tractor, operador, caja, cliente, origen, destino, tipo, aduana, no_sello);
      await appApi.post('/movimientos/new', {...formData, idcaptura: dataCaptura, fecha: startDate})
        .then(resp => {
          handleClose()
          getMovimientos()
        })
    }

  }

  const handleUpdateMov = async() => {
    if (formData.id) {
      //updating 
      // if(!validarPermiso(user.permiso, "update")) return;
      const confirm = window.confirm("¿Está seguro/a de actualizar el registro?");
      if(confirm) 
        await appApi.put('/movimientos', {...formData, idcaptura: dataCaptura, fecha: startDate})
        .then(resp => {
          handleClose()
          getMovimientos()
        })
      else setEditGridCell(false);
    } 
  }

    //Example Ag-grid
    const gridRef = useRef();


    const [columnDefs, setColumnDefs] = useState([
      {
        headerName: "Acciones", sortable: false, editable:false, filter: false, minWidth: 170, 
        cellRenderer: (params) => <div>
          <Button variant="outlined" color="primary" onClick={() => handleUpdate(params.data)}><FontAwesomeIcon icon={faPen}/></Button>
          <Button variant="outlined" color="secondary" onClick={() => handleDeleteMov(params.data)}><FontAwesomeIcon icon={faTrashAlt}/></Button>
        </div>
      },
      { field: "id", headerName:"#", sort: 'desc', editable:false },
      { field: "tractor", editable:false },
      { field: "operador", editable:false  },
      { field: "caja", editable:false  },
      { field: "cliente", editable:false  },
      { field: "origen", editable:false  },
      { field: "destino", editable:false  },
      { field: "tipo", editable:false  },
      { field: "aduana", editable:false  },
      { field: "no_sello",  headerName:"# Sello", editable:false  },
      { field: "hra_llegada"  , headerName:"Hora Llegada"   , cellEditorSelector: cellEditorSelector },
      { field: "hra_salida"   , headerName:"Hora Salida"    , cellEditorSelector: cellEditorSelector },
      { field: "hra_rojo_mex" , headerName:"Hora Rojo Mex"  , cellEditorSelector: cellEditorSelector },
      { field: "hra_verde_mex", headerName:"Hora Verde Mex" , cellEditorSelector: cellEditorSelector },
      { field: "hra_rojo_ame" , headerName:"Hora Rojo Ame"  , cellEditorSelector: cellEditorSelector },
      { field: "ent_insp" , cellEditorSelector: cellEditorSelector },
      { field: "sello_nuevo", headerName:"Sello Nuevo" },
      { field: "imporlot" , cellEditorSelector: cellEditorSelector },
      { field: "hra_entrega"  , headerName:"Hora Entrega"   , cellEditorSelector: cellEditorSelector },
      { field: "placas"},
      { field: "observacion", minWidth: 250 },
      { field: "sistema" }
    ]);

    const defaultColDef = useMemo(() => {
      return {
        flex: 1,
        minWidth: 210,
        editable: true,
        resizable: true,
        sortable: true,
        filter: true,
        suppressMenu: true,
        floatingFilter: true,
        floatingFilterComponentParams: {
          suppressFilterButton: true,
        },

      };
    }, []);


    const onBtnExport = useCallback(() => {
      gridRef.current.api.exportDataAsCsv(
        {
          fileName: "exportacion_"+startDate.toLocaleDateString('es-MX', {year: 'numeric', month: '2-digit', day: '2-digit'}),
          columnKeys: ['id', 'tractor', 'operador', 'caja', 'cliente', 'origen', 'destino', 'tipo', 'aduana', 'no_sello', 'hra_llegada', 
                        'hra_salida', 'hra_rojo_mex', 'hra_verde_mex', 'hra_rojo_ame', 'ent_insp', 'sello_nuevo', 'imporlot', 'hra_entrega', 'placas', 'observacion', 'sistema']
        }
      );
    }, []);

    const getRowStyle = params => {
      const { data } = params;
      const isEmpty = (key) => data[key] === null || data[key] === '' || data[key] == undefined;

      if(Object.keys(initialValue).some(isEmpty))
        return { background: '#ffc107' }//warning-color
      else
        return { background: '#198754de'} //success-color
    };
    
    const onCellEditingStarted = useCallback((event) => {
      console.log('cellEditingStarted');
      // console.log(event);
    }, []);

    const onCellValueChanged= useCallback((event) => {
      const {newValue, oldValue, data} = event;
      console.log('onCellValueChanged');
      console.log(event);
      (newValue != oldValue) && setFormData({...data, [event.column.userProvidedColDef.field]: newValue.toUpperCase() });
      (newValue != oldValue) && setEditGridCell(true);
      console.log({...data, [event.column.userProvidedColDef.field]: newValue });
    }, []);

    const onCellEditingStopped = useCallback((event) => {
      console.log('cellEditingStopped');
      const {data, value, valueChanged} = event;
      valueChanged && setFormData({...data, [event.column.userProvidedColDef.field]: value });
      valueChanged && setEditGridCell(true);
      //  handleEditCell(event.data);
      // handleFormSubmit();
    }, []);
  
    return (
      <div style={{ height: '100%', width: '100%' }}>
        <div className="example-wrapper table">
          <div className="grid-wrapper">
          <Grid align="right" className='d-flex justify-content-between flex-fill gap-3 p-2'>
              <DateButton onDateChange={onDateChange} startDate={startDate}/>
              <OptionCapturas onOptionChange={onOptionChange} dataCaptura={optCaptura}/>
              <div className='d-flex gap-2'>
                <Tooltip title="Expotar a csv">
                  <Button variant="contained" color="primary" onClick={onBtnExport}><FontAwesomeIcon icon={faFileExport}/></Button>
                </Tooltip>
                <Tooltip title="Agregar movimiento">
                  <Button variant="contained" color="primary" onClick={handleClickOpen}><FontAwesomeIcon icon={faPlus}/></Button>
                </Tooltip>
              </div>
          </Grid>
            <div style={{ height: '100%', width: '100%' }} className="ag-theme-alpine">
              <AgGridReact
                ref={gridRef}
                rowData={tableData}
                columnDefs={columnDefs}
                defaultColDef={defaultColDef}
                pagination={true}
                getRowStyle={getRowStyle}
                // onCellEditingStarted={onCellEditingStarted}
                onCellValueChanged={onCellValueChanged}
                // onCellEditingStopped={onCellEditingStopped}
              ></AgGridReact>
            </div>
            <FormDialog open={open} handleClose={handleClose}
              data={formData} onChange={onChange} handleFormSubmit={handleFormSubmitMov} />
          </div>
        </div>
      </div>
    );
  };

export default GridTable;
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

  const cellEditorSelector = (params) => {
    return {
      component: TimeEditor,
      popup: true,
      popupPosition: 'under',
    };
  };

  const initialValue = {idcaptura: "", fecha: "", tractor: "", operador: "", caja: "", cliente: "", origen: "", destino: "", tipo: "", aduana: "", no_sello: "", hra_llegada: "" }
  
  const GridTable = () => {
    //FormDialog 
    const [gridApi, setGridApi] = useState(null);
    const [tableData, setTableData] = useState(null);
    const [open, setOpen] = useState(false);
    const [editGridCell, setEditGridCell] = useState(false);
    const [formData, setFormData] = useState(initialValue);

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
      editGridCell && handleUpdateMov();
    }, [formData])


    //get data from server
    const getMovimientos = async() => {
        const fecha = startDate; //.toLocaleDateString('es-MX', {year: 'numeric', month: '2-digit', day: '2-digit'});
        const captura = dataCaptura;
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
        getMovimientos();
    }

    const onOptionChange = (e) => {
      const { value } = e.target
      setDataCaptura(value);
      getMovimientos();
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
    const confirm = window.confirm("¿Está seguro/a de borrar el registro?", id)
    if (confirm) {
      await appApi.delete('/movimientos', { params: { captura: idcaptura, fecha: fecha, id: id } })
        .then(resp => getMovimientos());
    }
  }

  const handleFormSubmitMov = async() => {

    console.log("submit", {...formData, idcaptura: dataCaptura, fecha: startDate});
    if (formData.id) {
      //updating movimiento
      const confirm = window.confirm("¿Está seguro/a de actualizar el registro?");
      confirm && await appApi.put('/movimientos', {...formData, idcaptura: dataCaptura, fecha: startDate})
        .then(resp => {
          handleClose()
          getMovimientos()
        })
    } 
    else {
      // adding new movimiento
      await appApi.post('/movimientos/new', {...formData, idcaptura: dataCaptura, fecha: startDate})
        .then(resp => {
          handleClose()
          getMovimientos()
        })
    }

  }

  const handleUpdateMov = async() => {
    console.log("formData ID:",formData.id);
    if (formData.id) {
      //updating 
      const confirm = window.confirm("¿Está seguro/a de actualizar el registro?");
      confirm && await appApi.put('/movimientos', {...formData, idcaptura: dataCaptura, fecha: startDate})
        .then(resp => {
          handleClose()
          getMovimientos()
        })
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
      { field: "tractor"},
      { field: "operador" },
      { field: "caja" },
      { field: "cliente" },
      { field: "origen" },
      { field: "destino" },
      { field: "tipo" },
      { field: "aduana" },
      { field: "no_sello",  headerName:"# Sello" },
      { field: "hra_llegada"  , headerName:"Hora Llegada"   , cellEditorSelector: cellEditorSelector },
      { field: "hra_salida"   , headerName:"Hora Salida"    , cellEditorSelector: cellEditorSelector },
      { field: "hra_rojo_mex" , headerName:"Hora Rojo Mex"  , cellEditorSelector: cellEditorSelector },
      { field: "hra_verde_mex", headerName:"Hora Verde Mex" , cellEditorSelector: cellEditorSelector },
      { field: "hra_rojo_ame" , headerName:"Hora Rojo Ame"  , cellEditorSelector: cellEditorSelector },
      { field: "ent_insp" },
      { field: "sello_nuevo", headerName:"Sello Nuevo" },
      { field: "imporlot" },
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
      console.log(data.hra_entrega);
      if (data.hra_llegada == null || data.hra_salida == null || data.hra_rojo_mex == null || data.hra_verde_mex == null || data.hra_rojo_ame == null || data.hra_entrega == null ||
        data.ent_insp == null || data.sello_nuevo == null || data. sello_nuevo == '' || data.imporlot == null || data.placas == null ) 
        return { background: '#f9d005' }
      else
        return { background: '#32bd32eb'}
    };

    const rowStyle = { background: 'yellow' };
    
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
                // rowStyle={rowStyle}
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
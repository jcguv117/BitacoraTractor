import React, { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { Grid, Button } from '@mui/material';
import FormDialog from './DialogForm';
import DateButton from './DateButton';
import OptionCapturas from './OptionCapturas';
import { appApi } from '../../api';

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
    const containerStyle = useMemo(() => ({ width: '100%', height: '100%' }), []);
    const gridStyle = useMemo(() => ({ height: '100%', width: '100%' }), []);
    const [columnDefs, setColumnDefs] = useState([
      {
        headerName: "Acciones", field: "id", sortable: false, editable:false, filter: false, minWidth: 170, 
        cellRenderer: (params) => <div>
          <Button variant="outlined" color="primary" onClick={() => handleUpdate(params.data)}><i className="fa-solid fa-pen-to-square"></i></Button>
          <Button variant="outlined" color="secondary" onClick={() => handleDeleteMov(params.data)}><i className="fa-solid fa-trash-can"></i></Button>
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

    const getRowStyle = params => {
      const { data } = params; 
      console.log(data.hra_entrega);
      if (data.hra_entrega === null) 
        return { background: 'yellow' }
      else
        return { background: 'green'}
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
      <div style={containerStyle}>
        <div className="example-wrapper">
          <div className="grid-wrapper">
          <Grid align="right">
                <DateButton onDateChange={onDateChange} startDate={startDate}/>
                <OptionCapturas onOptionChange={onOptionChange} dataCaptura={optCaptura}/>
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
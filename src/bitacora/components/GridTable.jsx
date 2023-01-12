import React, { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { Grid, Button } from '@mui/material';
import FormDialog from './DialogForm';
import DateButton from './DateButton';
import OptionCapturas from './OptionCapturas';
import { appApi } from '../../api';

  const initialValue = { tractor: "", operador: "", caja: "", cliente: "", origen: "", destino: "", tipo: "", aduana: "", no_sello: "", hra_llegada: "" }
  const GridTable = () => {
    //FormDialog 
    const [gridApi, setGridApi] = useState(null)
    const [tableData, setTableData] = useState(null)
    const [open, setOpen] = useState(false);
    const [editGridCell, setEditGridCell] = useState(false);
    const [formData, setFormData] = useState(initialValue)
    const [startDate, setStartDate] = useState(new Date());
    const [dataCaptura, setDataCaptura] = useState(1);


    const handleClickOpen = () => {
      setOpen(true);
    };

    const url = `http://localhost:4000/bitacora`;
    // calling getBitacora function for first time 
    useEffect(() => {
      getBitacora()
    }, [])

    useEffect(() => {
      console.log("useEffect")
      editGridCell && handleTest();
    }, [formData])

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

    const onDateChange = (date) => {
        setStartDate(date);
        getMovimientos(dataCaptura, date);
    }

    const onOptionChange = (e) => {
      const { value } = e.target
      setDataCaptura(value);
      getMovimientos(value, startDate);
    }

    const getMovimientos = async(idcaptura, date) => {
        const fecha = date.toISOString().slice(0, 10);
        const captura = idcaptura;
        console.log(idcaptura, fecha);
        const { data } = await appApi.get('/movimientos', {captura, fecha});
        console.log(data);
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
      fetch(url + `/${id}`, { method: "DELETE" }).then(resp => resp.json()).then(resp => getBitacora())

    }
  }
  const handleTest = () => {
    console.log("formData ID:",formData.id);
    if (formData.id) {
      //updating a user 
      const confirm = window.confirm("¿Está seguro/a de actualizar el registro?")
      confirm && fetch(url + `/${formData.id}`, {
        method: "PUT", body: JSON.stringify(formData), headers: {
          'content-type': "application/json"
        }
      }).then(resp => resp.json())
        .then(resp => {
          getBitacora()

        })
    } 
  }

  const handleFormSubmit = () => {
    console.log("formData ID:",formData.id);
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
        headerName: "Acciones", field: "id", sortable: false, editable:false, filter: false, minWidth: 170, 
        cellRenderer: (params) => <div>
          <Button variant="outlined" color="primary" onClick={() => handleUpdate(params.data)}><i className="fa-solid fa-pen-to-square"></i></Button>
          <Button variant="outlined" color="secondary" onClick={() => handleDelete(params.value)}><i className="fa-solid fa-trash-can"></i></Button>
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
                <OptionCapturas onOptionChange={onOptionChange}/>
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
                // onCellEditingStarted={onCellEditingStarted}
                onCellValueChanged={onCellValueChanged}
                // onCellEditingStopped={onCellEditingStopped}
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

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Autocomplete, TextField } from '@mui/material';
import Swal from 'sweetalert2';
import { useState } from 'react';

 const FormDialog = ({open,handleClose,data,onChange,handleFormSubmit}) => {

 const {
    id,
    tractor ,
    operador,
    caja,
    cliente,
    origen,
    destino,
    tipo,
    aduana,
    no_sello,
 } = data;

 const formSubmit = () => {
  const datos = {tractor,operador,caja,cliente,origen,destino,tipo,aduana,no_sello}
  const isEmpty = (key) => data[key] === null || data[key] === '' || data[key] == undefined;
  console.log(datos);
  if(Object.keys(datos).some(isEmpty))
    Swal.fire({
      title: 'Se deben llenar todos los datos.',
      icon: 'info',
    });
  else
    handleFormSubmit();
 }

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{id?"Actualizar":"Agregar Movimiento"}</DialogTitle>
        <DialogContent>
         <form>
            <TextField id="tractor"    value={tractor}  onChange={e=>onChange(e)} label="Tractor"   variant="outlined" margin="dense" fullWidth required type="number"/>
            <TextField id="operador"   value={operador} onChange={e=>onChange(e)} label="Operador"  variant="outlined" margin="dense" fullWidth required/>
            <TextField id="caja"       value={caja}     onChange={e=>onChange(e)} label="Caja"      variant="outlined" margin="dense" fullWidth required />
            <TextField id="cliente"    value={cliente}  onChange={e=>onChange(e)} label="Cliente"   variant="outlined" margin="dense" fullWidth required />
            <TextField id="origen"     value={origen}   onChange={e=>onChange(e)} label="Origen"    variant="outlined" margin="dense" fullWidth required />
            <TextField id="destino"    value={destino}  onChange={e=>onChange(e)} label="Destino"   variant="outlined" margin="dense" fullWidth required />
            <Autocomplete
              id="tipo" 
              onChange={(event, newValue) => { onChange({target: {value: newValue, id: "tipo"}}); }}
              onInputChange={(event, newInputValue) => { onChange({target: {value: newInputValue, id: "tipo"}}); }}
              inputValue={tipo}
              value={tipo}
              options={['EXPO', 'IMPO']}
              renderInput={(params) => <TextField {...params} label="Tipo" variant="outlined" margin="dense" fullWidth required />}
            />
            <TextField id="aduana"     value={aduana}   onChange={e=>onChange(e)} label="Aduana"    variant="outlined" margin="dense" fullWidth required type="number" />
            <TextField id="no_sello"   value={no_sello} onChange={e=>onChange(e)} label="No Sello"  variant="outlined" margin="dense" fullWidth required />
         </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary" variant="outlined">
            Cancelar
          </Button>
          <Button  color="primary" onClick={()=>formSubmit()} variant="contained">
            {id?"Actualizar":"Aceptar"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default FormDialog;
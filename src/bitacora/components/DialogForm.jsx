
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { TextField } from '@mui/material';

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
            <TextField id="tractor"    value={tractor} onChange={e=>onChange(e)} label="Tractor" variant="outlined" margin="dense" fullWidth />
            <TextField id="operador"   value={operador} onChange={e=>onChange(e)} label="Operador" variant="outlined" margin="dense" fullWidth />
            <TextField id="caja"       value={caja} onChange={e=>onChange(e)} label="Caja" variant="outlined" margin="dense" fullWidth />
            <TextField id="cliente"    value={cliente} onChange={e=>onChange(e)} label="Cliente" variant="outlined" margin="dense" fullWidth />
            <TextField id="origen"     value={origen} onChange={e=>onChange(e)} label="Origen" variant="outlined" margin="dense" fullWidth />
            <TextField id="destino"    value={destino} onChange={e=>onChange(e)} label="Destino" variant="outlined" margin="dense" fullWidth />
            <TextField id="tipo"       value={tipo} onChange={e=>onChange(e)} label="Tipo" variant="outlined" margin="dense" fullWidth />
            <TextField id="aduana"     value={aduana} onChange={e=>onChange(e)} label="Aduana" variant="outlined" margin="dense" fullWidth />
            <TextField id="no_sello"   value={no_sello} onChange={e=>onChange(e)} label="No Sello" variant="outlined" margin="dense" fullWidth />
         </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary" variant="outlined">
            Cancelar
          </Button>
          <Button  color="primary" onClick={()=>handleFormSubmit()} variant="contained">
            {id?"Actualizar":"Aceptar"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default FormDialog;

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
    user ,
    name,
    password
 } = data;

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{id?"Actualizar":"Agregar Usuario"}</DialogTitle>
        <DialogContent>
         <form>
            <TextField id="user"    value={user} onChange={e=>onChange(e)} label="Usuario" variant="outlined" margin="dense" fullWidth />
            <TextField id="name"   value={name} onChange={e=>onChange(e)} label="Nombre" variant="outlined" margin="dense" fullWidth />
            <TextField id="password"       value={password} onChange={e=>onChange(e)} label="Contraseña" variant="outlined" margin="dense" fullWidth />
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
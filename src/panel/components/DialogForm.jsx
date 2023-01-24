
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Box, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';

 const FormDialog = ({open,handleClose,data,onChange,handleFormSubmit, handleChange}) => {
  const {
      id,
      user ,
      name,
      password,
      permiso
  } = data;

  const popInfo = () => {
    Swal.fire('Información',
    `<div>
      <strong>Capturista:</strong> altas de registros.<br/>
      <strong>Ejecutivo:</strong> altas y modificaciones de registros.<br/>
      <strong>Gerencial:</strong> altas, modificaciones y eliminar registros.<br/>
      <strong>Administrador:</strong>	altas, modificaciones y eliminar + panel.<br/>
    </div>`, 
    'info');
  }


  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{id?"Actualizar Usuario":"Agregar Usuario"}</DialogTitle>
        <DialogContent>
         <form>
            <TextField id="user"      value={user} onChange={e=>onChange(e)} label="Usuario" variant="outlined" margin="dense" fullWidth required />
            <TextField id="name"      value={name} onChange={e=>onChange(e)} label="Nombre" variant="outlined" margin="dense" fullWidth required/>
            <TextField id="password"  value={password} onChange={e=>onChange(e)} label="Contraseña" variant="outlined" margin="dense" fullWidth required/>
            <Box sx={{ minWidth: 120 }}>
              <FormControl fullWidth>
                <InputLabel id="select-permiso-user-label">Permiso</InputLabel>
                <Select
                  labelId="select-permiso-user-label"
                  id="permiso" 
                  value={permiso}
                  onChange={handleChange}
                  label="Permiso"
                >
                  <MenuItem value={1}>Capturista    </MenuItem>
                  <MenuItem value={2}>Ejecutivo     </MenuItem>
                  <MenuItem value={3}>Gerencial     </MenuItem>
                  <MenuItem value={9}>Administrador </MenuItem>
                </Select>
              </FormControl>
            </Box>

        </form>
        </DialogContent>
        <DialogActions>
          <Button color="primary" variant="contained" onClick={popInfo}><FontAwesomeIcon icon={faInfoCircle}/></Button>
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
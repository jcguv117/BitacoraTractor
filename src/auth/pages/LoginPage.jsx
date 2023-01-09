import { useEffect } from 'react';
import Swal from 'sweetalert2';
import { useAuthStore, useForm } from '../../hooks';
import './login.css';

const loginFormFields = {
    loginUser:    '',
    loginPassword: '',
}

const registerFormFields = {
    registerName:      '',
    registerUser:     '',
    registerPassword:  '',
    registerPassword2: '',
}



export const LoginPage = () => {

    const { startLogin, errorMessage, startRegister } = useAuthStore();

    const { loginUser, loginPassword, onInputChange:onLoginInputChange } = useForm( loginFormFields );
    const { registerUser, registerName, registerPassword, registerPassword2, onInputChange:onRegisterInputChange } = useForm( registerFormFields );

    const loginSubmit = ( event ) => {
        event.preventDefault();
        console.log({loginUser, loginPassword });
        startLogin({ user: loginUser, password: loginPassword });
    }

    const registerSubmit = ( event ) => {
        event.preventDefault();
        if ( registerPassword !== registerPassword2 ) {
            Swal.fire('Error en registro', 'Contraseñas no son iguales', 'error');
            return;
        }

        startRegister({ name: registerName, user: registerUser, password: registerPassword });
    }


    useEffect(() => {
      if ( errorMessage !== undefined ) {
        Swal.fire('Error en la autenticación', errorMessage, 'error');
      }    
    }, [errorMessage])
    



    return (
        <div className="container login-container">
            <div className="row">
                <div className="col-md-12 login-form-1">
                    <h3>Ingreso</h3>
                    <form onSubmit={ loginSubmit }>
                        <div className="form-group mb-2">
                            <input 
                                type="text"
                                className="form-control"
                                placeholder="Usuario"
                                name="loginUser"
                                value={ loginUser }
                                onChange={ onLoginInputChange }
                            />
                        </div>
                        <div className="form-group mb-2">
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Contraseña"
                                name="loginPassword"
                                value={ loginPassword }
                                onChange={ onLoginInputChange }
                            />
                        </div>
                        <div className="d-grid gap-2">
                            <input 
                                type="submit"
                                className="btnSubmit"
                                value="Ingresar" 
                            />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
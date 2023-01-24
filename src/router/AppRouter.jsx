import { useEffect } from 'react';
import { Route, Routes, Navigate } from "react-router-dom"
import {LoginPage} from '../auth'
import {BitacoraPage} from "../bitacora";
import PanelPage from '../panel/pages/PanelPage';
import { useAuthStore } from '../hooks';

export const AppRouter = () => {
  const { status, checkAuthToken, user } = useAuthStore();
  useEffect(() => {
      checkAuthToken();
  }, [])


  if ( status === 'checking' ) {
    return (
        <h3>Cargando...</h3>
    )
  }

  return (
    <Routes>
      {
        ( status === 'not-authenticated') 
        ? (
          <>
              <Route path="/auth/*" element={ <LoginPage /> } />
              <Route path="/*" element={ <Navigate to="/auth/login" /> } />
          </>
        )
        : (user.permiso == 9) 
          ? (
          <>
              <Route path="/" element={ <BitacoraPage/>} />
              <Route path="/panel" element={ <PanelPage/>} />
              <Route path="/*" element={ <Navigate to="/" /> } />
          </>
          )
          :(
            <>
                <Route path="/" element={ <BitacoraPage/>} />
                <Route path="/*" element={ <Navigate to="/" /> } />
            </>
          )
 
      }
    </Routes>
  )
}

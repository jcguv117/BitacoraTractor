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
        : (
          <>
              <Route path="/" element={ <BitacoraPage/>} />
              <Route path="/*" element={ <Navigate to="/" /> } />
          </>
        )

        
      }
      {
        (status === 'authenticated' && user.permiso == 9) && 
        <>
              <Route path="/panel" element={ <PanelPage/>} />
              <Route path="/*" element={ <Navigate to="/" /> } />
        </>
      }
    </Routes>
  )
}

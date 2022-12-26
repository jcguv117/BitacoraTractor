import { Route, Routes, Navigate } from "react-router-dom"
import {LoginPage} from '../auth'
import {BitacoraPage} from "../bitacora";

const authStatus = 'authenticated';

export const AppRouter = () => {
  return (
    <Routes>
      {
        (authStatus === 'non-authenticated') 
        ? <Route path="/auth/*" element={ <LoginPage/>} />
        : <Route path="/*" element={ <BitacoraPage/>} />
      }
        {/* fail safe */}
        <Route path="/*" element={ <Navigate to="/auth/login" />} />
    </Routes>
  )
}

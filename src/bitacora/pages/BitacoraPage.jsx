import { createContext, useContext } from "react";
import { Navbar } from "../../components/Navbar"
import GridTable from "../components/GridTable"
import { useAuthStore } from "../../hooks";

export const BitacoraPage = () => {

  const { user } = useAuthStore();
  const Permission = createContext(user.permiso);

  return (
    <div className='container-fluid mb-4 p-2'>
        <Navbar/>
        <Permission.Provider value={user.permiso}>
          <GridTable Permission={Permission}/>
        </Permission.Provider>
    </div>
  )
}

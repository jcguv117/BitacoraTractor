import { Navbar } from "../../components/Navbar";
import PanelTable from "../components/PanelTable";

export default function PanelPage() {
  return (
    <div className='container mb-4 p-2'>
      <Navbar/>
      <PanelTable/>
    </div>
  )
}

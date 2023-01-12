import { useState, useEffect } from 'react';
import { appApi } from '../../api';

export default function OptionCapturas({onOptionChange}) {

    const [dataCaptura, setDataCaptura] = useState([{idcaptura: "", nombre: " - "}]);

    const getCapturas = async() => {
        const { data } = await appApi.get('/capturas');
        setDataCaptura(data.captura);
    }

    useEffect(() => {        
        getCapturas()
      }, [])

    return(
        <select className="form-select" aria-label="Default select example" onChange={(e) => onOptionChange(e)}>
            { dataCaptura.map((d) => <option key={d.idcaptura} value={d.idcaptura}>{d.nombre}</option>)}
        </select>
    );

}

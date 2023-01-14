import { useState, useEffect } from 'react';
import { appApi } from '../../api';

export default function OptionCapturas({onOptionChange, dataCaptura}) {


    return(
        <select className="form-select" aria-label="Default select example" onChange={(e) => onOptionChange(e)}>
            { dataCaptura.map((d) => <option key={d.idcaptura} value={d.idcaptura}>{d.nombre}</option>)}
        </select>
    );

}

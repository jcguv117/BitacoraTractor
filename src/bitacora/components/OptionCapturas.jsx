
export default function OptionCapturas({onOptionChange, dataCaptura}) {
    return(
        <div className="w-50">
            <select id="capturaSelect" className="form-select" aria-label="Default select" onChange={(e) => onOptionChange(e)}>
                { dataCaptura.map((d) => <option key={d.idcaptura} value={d.idcaptura}>{d.nombre}</option>)}
            </select>
        </div>
    );

}

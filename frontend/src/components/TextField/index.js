import { TextField } from 'office-ui-fabric-react'
import './TextFIeld.css'

const CampoTexto = (props) => {
    return (
        <div className='text-field'>  
        <label>{props.label}</label>          
            <input placeholder={props.placeholder}/>
        </div>
    )
}

export default TextField
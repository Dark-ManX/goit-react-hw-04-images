import { useState } from "react";
import SvgSearch from "../additional/SvgSearch/SvgSearch";
import {Backdrop, Form, SearchBtn, Search} from './Searchbar.styled';

const Searchbar = ({onSearch}) => {
    
    const [state, setState] = useState('');

    const handleSearch = (e) => {
        const {value} = e.currentTarget;

        setState(value.trim());
    }

    const reset = () => {
        setState('');
    }

    const handleSubmit = (e) => {

        if (state === '') {
            return;
        }
        
        e.preventDefault();

        onSearch(state);
        
        reset();
    }



    return(
        <Backdrop>
            <Form onSubmit={handleSubmit}>             
                <SearchBtn>
                    <SvgSearch/>
                </SearchBtn>
                
                <Search 
                    onChange={handleSearch} 
                    className="input"
                    type="text" 
                    autoComplete="off" 
                    autoFocus
                    placeholder="search images and photos">
                </Search>
            </Form>
        </Backdrop>
    ) 
    
}

export default Searchbar;

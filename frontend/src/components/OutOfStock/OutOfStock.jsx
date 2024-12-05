import React, { useContext } from 'react'
import './OutOfStock.css'
import { AuthContext } from '../../context/AuthContext'
import { assets } from '../../assets/assets'

const OutOfStock = () => {
    const {setshowOut, showOut} = useContext(AuthContext)

    if(!showOut){
        return null;
    }

    return (
        <div className="out-popup">
        <form className="out-popup-container">
            <div className="out-popup-title">
                <h2>Product is out of stock</h2>
                <img
                    onClick={() => setshowOut(false)}
                    src={assets.cross_icon}
                    alt="Close"
                    style={{ cursor: 'pointer' }}
                />
                <div className='out-popup-text'>
                    <p>Please choose our other product or wait for us to update more quantity! </p>
                </div>
                
            </div>

        </form>
        </div>
    )
    }
    

export default OutOfStock

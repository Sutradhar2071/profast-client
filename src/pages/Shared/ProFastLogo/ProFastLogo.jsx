import React from 'react';
import logo from '../../../assets/logo.png'

const ProFastLogo = () => {
    return (
        <div className='flex justify-center gap-0 items-center'>
            <img src={logo} alt="" />
            <p className='mt-6 font-extrabold -ml-4 text-3xl'>ProFast</p>
        </div>
    );
};

export default ProFastLogo;
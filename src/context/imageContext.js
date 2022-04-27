import React , {useState,createContext,useEffect, useContext} from 'react';

export const Image = createContext();

export const ImageProvider = props =>{
    const [image,setImage] = useState('none');
    

    const value = [image,setImage]
    return (
      <Image.Provider value={value}>
        {props.children}
      </Image.Provider>
    )
  }
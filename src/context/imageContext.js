import React , {useState,createContext,useEffect, useContext} from 'react';

export const ImageContext = createContext();

export const ImageProvider = props =>{
    const [image,setImage] = useState('none');
    

    const value = [image,setImage]
    return (
      <ImageContext.Provider value={value}>
        {props.children}
      </ImageContext.Provider>
    )
  }
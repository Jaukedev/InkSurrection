import React, { useContext } from 'react';
import "./Image.css";
import { ImageContext } from '../context/imageContext';

function Image(props) {
  const [image, setImage] = useContext(ImageContext);
  //require('../assets/images/1.jpeg')
    return (
      <div className="imageContainer">
        <img
          className="guitar"
          src={image}
          style={{
            filter: ` contrast(${props.settings[0].value}) hue-rotate(${props.settings[1].value}) brightness(${props.settings[2].value}) saturate(${props.settings[3].value}) sepia(${props.settings[4].value})
            invert(${props.settings[5].value})`,
          }}
        />{" "}
      </div>
    );

}


export default Image;

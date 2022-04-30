import React, { useState, useEffect } from "react";
import { IonButton, IonCol, IonRow } from "@ionic/react";
import "./Settings.scss";

const Setting = (props) => {
  const [showList, setShowList] = useState({
    contrast: false,
    hue: false,
    brightness: false,
    saturate: false,
    sepia: false,
    invert: false,
  });
  //   useEffect(() => {
  //   });
  var onchange = props.onChange;
  var showAll = props.showAll;

  function setVal(setting, onChange) {
    console.log(showList);

    if (showAll) {
      console.log("dentro del loop");
      for (let key in showList) {
        showList[key] = true;
      }
    }
    console.log(showList);
    switch (setting.name) {
      case "contrast":
        return (
          <input
            className="e-range"
            key={setting.name}
            type="range"
            step="1"
            min="0"
            max="200"
            id={setting.name}
            onChange={onChange}
            defaultValue={setting.value}
            disabled={showList[setting.name]}
          />
        );
        break;
      case "hue":
        return (
          <input
            className="e-range"
            key={setting.name}
            type="range"
            step="1"
            min="0"
            max="360"
            id={setting.name}
            onChange={onChange}
            defaultValue={setting.value}
            disabled={showList[setting.name]}
          />
        );
        break;
      case "brightness":
        return (
          <input
            className="e-range"
            key={setting.name}
            type="range"
            step="1"
            min="0"
            max="200"
            id={setting.name}
            onChange={onChange}
            defaultValue={setting.value}
            disabled={showList[setting.name]}
          />
        );
        break;
      case "saturate":
        return (
          <input
            className="e-range"
            key={setting.name}
            type="range"
            step="1"
            min="0"
            max="100"
            id={setting.name}
            onChange={onChange}
            defaultValue={setting.value}
            disabled={showList[setting.name]}
          />
        );
        break;
      case "sepia":
        return (
          <input
            className="e-range"
            key={setting.name}
            type="range"
            step="1"
            min="0"
            max="100"
            id={setting.name}
            onChange={onChange}
            defaultValue={setting.value}
            disabled={showList[setting.name]}
          />
        );
        break;

      case "invert":
        return (
          <input
            className="e-range"
            key={setting.name}
            type="range"
            step="1"
            min="0"
            max="100"
            id={setting.name}
            onChange={onChange}
            defaultValue={setting.value}
            disabled={showList[setting.name]}
          />
        );
        break;

      case "grayscale":
        return (
          <input
            className="e-range"
            key={setting.name}
            type="range"
            step="1"
            min="0"
            max="100"
            id={setting.name}
            onChange={onChange}
            value={setting.value}
            defaultValue={setting.value}
            disabled={showList[setting.name]}
          />
        );
        break;
      default:
        return <input className="e-range" key={setting.name} type="range" />;
    }
  }
  return (
    <IonRow className="setting" key={props.filterSelected.name}>
      <div className="filterValues">
        <span className="filterName">
          {props.filterSelected.name}
        </span>
        <span className="filterValue">{props.filterSelected.value}</span>
      </div>
      {setVal(props.filterSelected, onchange)}
    </IonRow>
  );
};

export default Setting;

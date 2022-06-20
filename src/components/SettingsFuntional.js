import { IonButton, IonRow, IonIcon, IonRange } from "@ionic/react";
import React, { useState } from "react";
import Image from "./Image";
import Setting from "./Setting";
import "./Settings.scss";
import { barcode, save, refresh, close, arrowBack,colorFilter } from "ionicons/icons";

function SettingsFuntional(props) {
  const [openModal, setOpenModal] = useState(false);
  const [filterSelected, setFilterSelected] = useState();
  var onchange = props.onChange;
  const defaultSettings = [
    {
      name: "Contraste",
      value: "100%",
    },
    {
      name: "Colores",
      value: "0deg",
    },
    {
      name: "Brillo",
      value: "100%",
    },
    {
      name: "Saturación",
      value: "100%",
    },
    {
      name: "Sepia",
      value: "0%",
    },
    {
      name: "Invertir colores",
      value: "0%",
    },
  ];
  function setVal(setting, onChange) {
    switch (setting.name) {
      case "contrast":
        return (
          <IonRange
            className="slider"
            key={setting.name}
            step="1"
            min="0"
            max="200"
          
            onChange={onChange}
            value={setting.value}
            disabled
          />
        );
        break;
      case "hue":
        return (
          <IonRange
            className="slider"
            key={setting.name}
            step="1"
            min="0"
            max="360"
            id={setting.name}
            onChange={onChange}
            value={setting.value}
            disabled
          />
        );
        break;
      case "brightness":
        return (
          <IonRange
            className="slider"
            key={setting.name}
            step="1"
            min="0"
            max="200"
            id={setting.name}
            onChange={onChange}
            value={setting.value}
            disabled
          />
        );
        break;
      case "saturate":
        return (
          <IonRange
            className="slider"
            key={setting.name}
            step="1"
            min="0"
            max="100"
            id={setting.name}
            onChange={onChange}
            value={setting.value}
            disabled
          />
        );
        break;
      case "sepia":
        return (
          <IonRange
            className="slider"
            key={setting.name}
            step="1"
            min="0"
            max="100"
            id={setting.name}
            onChange={onChange}
            value={setting.value}
            disabled
          />
        );
        break;

      case "invert":
        return (
          <IonRange
            className="slider"
            key={setting.name}
            step="1"
            min="0"
            max="100"
            id={setting.name}
            onChange={onChange}
            value={setting.value}
            disabled
          />
        );
        break;

      case "grayscale":
        return (
          <IonRange
            className="slider"
            key={setting.name}
            step="1"
            min="0"
            max="100"
            id={setting.name}
            onChange={onChange}
            value={setting.value}
            disabled
          />
        );
        break;
      default:
        return <IonRange className="slider" key={setting.name} />;
    }
  }
  function settingFilter(filter, value) {
    setFilterSelected({ name: filter, value: value });
    setOpenModal(false);
  }
  function reset() {
    // recorrer el setings default y correr el onchange 
  }
  return (
    <div className="containeer">
      <div className="header">
        <IonButton className="button" fill="clear" color="#6A6B6D" routerLink="/tab1">
          <IonIcon className="icon" icon={arrowBack} size="large" ></IonIcon>
        </IonButton>

        <label className="tittle">Editar Imagen</label>
        <IonButton className="button" fill="clear" color="#6A6B6D" routerLink="/tab1">
          <IonIcon className="icon" icon={save} size="medium" ></IonIcon>
        </IonButton>
      </div>
      <div className="image-container">
        <Image url={props.url} settings={props.settings} />
      </div>

      {filterSelected ? (
        <Setting
          settings={props.settings}
          url={props.image}
          onChange={onchange}
          filterSelected={filterSelected}
        ></Setting>
      ) : (
        <div className="selectFilterPlease">
          <span>Selecciona un filtro <br></br> para comenzar a editar</span>
        </div>
      )}
      <div className={`filter ${openModal ? "opened" : "closed"}`}>
        {openModal ? <div></div> :
          <div className="buttonBox">
            <IonButton className="buttonFilter" fill="clear" onClick={() => setOpenModal(true)}>
              <IonIcon icon={colorFilter} size="large" style={{ color: '#F4C53A' }}></IonIcon>
            </IonButton>
          </div>
        }

        <div className="modalContainer" >
          <div className="modal">
            <div className="modalHeader">
              <div>
                <IonIcon
                  icon={refresh}
                  size="large"
                  onClick={() => reset()}
                ></IonIcon>
              </div>
              <label className="filterName">Filtros</label>
              <div>
                <IonIcon
                  icon={close}
                  size="large"
                  onClick={() => setOpenModal(false)}
                ></IonIcon>
              </div>
            </div>

            {props.settings.map(function (setting, index) {
              return (
                <IonRow className="filter-container" key={setting.name}>
                  <div className="caption">
                    <div className="texts">
                      <label className="tittle">
                        {setting.name}
                      </label>
                      <span className="value">{setting.value}</span>
                    </div>

                    <IonButton
                      className="button-fil buttonSelect"
                      shape="round"
                      color="#dca301"
                      fill="outline"
                      size="small"
                      onClick={() =>
                        settingFilter(setting.name, setting.value)
                      }
                    >
                      Usar
                    </IonButton>
                  </div>
                  <div className="range">
                    {setVal(setting, onchange)}
                  </div>

                </IonRow>
              );
            })}

          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsFuntional;

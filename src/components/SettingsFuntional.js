import { IonButton, IonRow, IonIcon, IonRange } from "@ionic/react";
import React, { useState } from "react";
import Image from "./Image";
import Setting from "./Setting";
import "./Settings.scss";
import { menu, save, refresh, close } from "ionicons/icons";

function SettingsFuntional(props) {
  const [openModal, setOpenModal] = useState(false);
  const [filterSelected, setFilterSelected] = useState();
  var onchange = props.onChange;
  const defaultSettings = [
    {
      name: "contrast",
      value: "100%",
    },
    {
      name: "hue",
      value: "0deg",
    },
    {
      name: "brightness",
      value: "100%",
    },
    {
      name: "saturate",
      value: "100%",
    },
    {
      name: "sepia",
      value: "0%",
    },
    {
      name: "invert",
      value: "0%",
    },
  ];
  function setVal(setting, onChange) {
    switch (setting.name) {
      case "contrast":
        return (
          <IonRange
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
      case "hue":
        return (
          <IonRange
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
        return <IonRange key={setting.name} />;
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
    <>
      <div className="containeer">
        <div className="header">
          <IonButton className="button" fill="clear" color="#161718" routerLink="/tab1">
            <IonIcon className="icon" icon={close} size="large" ></IonIcon>
          </IonButton>

          <label className="tittle">Insurrection</label>
          <IonButton className="button" fill="clear" color="#161718" routerLink="/tab1">
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
          <div></div>
        )}
        <div className={`filter ${openModal ? "opened" : "closed"}`}>
          {openModal ? <div></div> :
            <div className="buttonBox">
              <IonButton color="dark" fill="clear" onClick={() => setOpenModal(true)}>
                <IonIcon icon={menu} size="large"></IonIcon>
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
              <div className="sidebar">
                {props.settings.map(function (setting, index) {
                  return (
                    <div key={setting.name}>
                      <div className="caption">
                        <label className="tittle">
                          <div>{setting.name}</div>
                        </label>
                        <IonButton
                          className="button buttonSelect"
                          shape="round"
                          color="#dca301"
                          fill="outline"
                          onClick={() =>
                            settingFilter(setting.name, setting.value)
                          }
                        >
                          Seleccionar
                        </IonButton>
                      </div>
                      {setVal(setting, onchange)}
                      <div>{setting.value}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SettingsFuntional;

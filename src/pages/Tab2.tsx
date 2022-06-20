import { IonButton, IonPage, IonContent, IonRow, IonRange, IonLoading, IonIcon } from '@ionic/react';
import React, { useState, createContext, useEffect, useContext, useRef } from 'react';
import ExploreContainer from '../components/ExploreContainer';
import './Tab2.scss';
import OpenCv from '../components/openCV/OpenCv';
import { barcode, save, refresh, close, arrowBack, colorFilter } from "ionicons/icons";
import { ImageContext } from '../context/imageContext';

const Tab2: React.FC = () => {
  const filterRef = useRef<any>();
  const [openModal, setOpenModal] = useState(false);
  const [settings, setSettings] = useState<any>([{
    name: "Exposición",
    filterName: "expose",
    amount: 0,
    index: 0,

  },
  {
    name: "Contraste",
    filterName: "contrast",
    amount: 0,
    index: 1,
  },
  {
    name: "Negros",
    filterName: "black",
    amount: 0,
    index: 2,
  },
  {
    name: "Blancos",
    filterName: "white",
    amount: 0,
    index: 3,
  },
  {
    name: "Saturación",
    filterName: "saturation",
    amount: 0,
    index: 4,
  },
  {
    name: "Textura",
    filterName: "texture",
    amount: 0,
    index: 5,
  },])
  const [filterSelected, setFilterSelected] = useState({
    name: "Exposición",
    filterName: "expose",
    amount: 0,
    index: 0,
  });
  const [editionData, setEditionData] = useState<any>({ filterSelected: 0, filterArray: [{ filter: 0, filterAmount: 0 }] });
  function settingFilter(filter: any) {
    let found:any;
    let settingsAux:any;
    filter.preventDefault()
    found = settings.find((element: any) => element.filterName == filter.target.name);
    console.log(filter.target.name);
    settingsAux = settings;
    settingsAux[found.index].amount = filter.target.value;
    console.log(settingsAux);
    setSettings(settingsAux)
    filter.preventDefault()
    setFilterSelected(filter)
    if(filterRef.current){
      console.log(filterRef.current.saluda(filter))

    }
  }
  return (
    <IonPage>
      <IonContent className="container">
        <div >
          <IonButton className="button" fill="clear" color="#6A6B6D" routerLink="/tab1">
            <IonIcon className="icon" icon={arrowBack} size="large" ></IonIcon>
          </IonButton>

          <label className="tittle">Editar Imagen</label>
          <IonButton className="button" fill="clear" color="#6A6B6D" routerLink="/tab1">
            <IonIcon className="icon" icon={save} size="medium" ></IonIcon>
          </IonButton>
        </div>

        <OpenCv ref={filterRef}></OpenCv> 

        {filterSelected.name !== "none" ? (

          settings.map(function (setting: any, index: number) {
            return (
              <IonRow className="filter-container" key={setting.name}>
                <div className="caption">
                  <div className="texts">
                    <label className="tittle">
                      {setting.name}
                    </label>
                    <span className="value">{ }</span>
                  </div>
                </div>
                <div className="range">
                  <input type='range' step={1}
                    min={0}
                    name={setting.filterName}
                    value={setting.amount}
                    onChange={settingFilter}
                    max={100} ></input>
                </div>

              </IonRow>
            );
          })


        ) : (
          <div className="selectFilterPlease">
            <span>Selecciona un filtro <br></br> para comenzar a editar</span>
          </div>
        )}
        <div className='footer'>
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
                      defaultValue={'black'}
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

                {settings.map(function (setting: any, index: number) {
                  return (
                    <IonRow className="filter-container" key={setting.name}>
                      <div className="caption">
                        <div className="texts">
                          <label className="tittle">
                            {setting.name}
                          </label>
                          <span className="value">{ }</span>
                        </div>

                        <IonButton
                          className="button-fil buttonSelect"
                          shape="round"
                          color="#dca301"
                          fill="outline"
                          size="small"
                          onClick={() =>
                            settingFilter(setting)
                          }
                        >
                          Usar
                        </IonButton>
                      </div>
                      <div className="range">
                        <input type='range' step={1}
                          min={0}
                          disabled
                          value={setting.amount}
                          max={100} onChange={settingFilter}></input>
                      </div>

                    </IonRow>
                  );
                })}

              </div>
            </div>
          </div>
        </div>

      </IonContent>

    </IonPage>
  );
};

export default Tab2;

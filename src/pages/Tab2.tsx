import { IonButton, IonPage, IonContent, IonRow, IonRange, IonLoading, IonIcon } from '@ionic/react';
import React, { useState, createContext, useEffect, useContext, useRef } from 'react';
import ExploreContainer from '../components/ExploreContainer';
import './Tab2.scss';
import AndroideCV from '../components/androideCV/AndroideCV';
import OpenCv from '../components/openCV/OpenCv';
import { barcode, save, refresh, close, arrowBack, colorFilter } from "ionicons/icons";
import { ImageContext } from '../context/imageContext';


const Tab2: React.FC = () => {
  const timerRef = useRef<any>();
  const filterRef = useRef<any>();
  const expoRef = useRef<any>(null);
  const contRef = useRef<any>(null);
  const blackRef = useRef<any>(null);
  const whiteRef = useRef<any>(null);
  const satuRef = useRef<any>(null);
  const texRef = useRef<any>(null);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<any>([{
    name: "Exposición",
    filterName: "expose",
    reference: expoRef,
    amount: 0,
    index: 0,
    min: 0,
    max: 100

  },
  {
    name: "Contraste",
    filterName: "contrast",
    reference: contRef,
    amount: 0,
    index: 1,
    min: 0,
    max: 100
  },
  {
    name: "Negros",
    filterName: "black",
    reference: blackRef,
    amount: 0,
    index: 2,
    min: 0,
    max: 100
  },
  {
    name: "Blancos",
    filterName: "white",
    reference: whiteRef,
    amount: 0,
    index: 3,
    min: 0,
    max: 100
  },
  {
    name: "Saturación",
    filterName: "saturation",
    reference: satuRef,
    amount: 0,
    index: 4,
    min: 0,
    max: 100
  },
  {
    name: "Textura",
    filterName: "texture",
    reference: texRef,
    amount: 0,
    index: 5,
    min: 0,
    max: 100
  },])
  const [filterSelected, setFilterSelected] = useState<any>();
  const [editionData, setEditionData] = useState<any>({ filterSelected: 0, filterArray: [{ filter: 0, filterAmount: 0 }] });

  function settingFilter(filter: any) {
    clearTimeout(timerRef.current);

    let found: any;
    let settingsAux: any;
    timerRef.current = setTimeout(() => {
      setLoading(true);
    }, 500);
    timerRef.current = setTimeout(() => {
      console.log(filterSelected.name, filter.target.value, filter.target.name)
      found = settings.find((element: any) => element.filterName == filter.target.name);
      settingsAux = settings;
      settingsAux[found.index].amount = filter.target.value;
      setSettings(settingsAux)
      // setFilterSelected(filter)
      if (filterRef.current) {
        filterRef.current.saluda(filter)
      }
      setLoading(false);
    }, 500);

  }
  function selectFilter(filter: any, value: any, filterName: any, min:any    ) {
    console.log(filter, value);
    setFilterSelected({ name: filter, value: value, filterName: filterName ,min: min});
    setOpenModal(false);
  }
  const disableRange = () => {
    expoRef.current.disebled = true;
    contRef.current.disebled = true;
    blackRef.current.disebled = true;
    whiteRef.current.disebled = true;
    satuRef.current.disebled = true;
    texRef.current.disebled = true;
  }
  return (
    <IonPage>
      <IonLoading
        isOpen={loading}
        message={'Loading...'}
      />
      <IonContent className="container">
        <div className="header">
          <IonButton className="button" fill="clear" color="#6A6B6D" routerLink="/tab1">
            <IonIcon className="icon" icon={arrowBack} size="large" ></IonIcon>
          </IonButton>

          <label className="tittle">Editar Imagen</label>
          <IonButton className="button" fill="clear" color="#6A6B6D" routerLink="/tab1">
            <IonIcon className="icon" icon={save} size="medium" ></IonIcon>
          </IonButton>
        </div>

        {/* <OpenCv ref={filterRef} disbleRange={disableRange}></OpenCv>  */}
        <AndroideCV ref={filterRef} disbleRange={disableRange} ></AndroideCV>

        {filterSelected ? (
          <IonRow className="filter-container" key={filterSelected.name}>
            <div className="caption">
              <div className="texts">
                <label className="tittle">
                  {filterSelected.name}
                </label>
                <span className="value">{ }</span>
              </div>
            </div>
            <div className="range">
              <input type='range' step={1}
                min={filterSelected.min}
                defaultValue={0}
                name={filterSelected.filterName}
                onChange={settingFilter}
                disabled={loading}
                max={100} ></input>
            </div>

          </IonRow>
          // settings.map(function (setting: any, index: number) {
          //   return (
          //     <IonRow className="filter-container" key={setting.name}>
          //       <div className="caption">
          //         <div className="texts">
          //           <label className="tittle">
          //             {setting.name}
          //           </label>
          //           <span className="value">{ }</span>
          //         </div>
          //       </div>
          //       <div className="range">
          //         <input type='range' step={1}
          //           min={0}
          //           ref={setting.reference}
          //           name={setting.filterName}
          //           onChange={settingFilter}
          //           disabled ={loading}
          //           max={100} ></input>
          //       </div>

          //     </IonRow>

          //   );

          // })


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
                  if (!loading) {
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
                              selectFilter(setting.name, setting.amount, setting.filterName, setting.min)
                            }
                          >
                            Usar
                          </IonButton>
                        </div>
                        <div className="range">
                          <input type='range' step={1}
                            min={setting.min}
                            disabled
                            value={setting.amount}
                            max={setting.max} onChange={settingFilter}></input>
                        </div>

                      </IonRow>
                    );
                  } else {
                    return 'cargando'
                  }
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

import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React, { useState, createContext, useEffect, useContext } from 'react';
import ExploreContainer from '../components/ExploreContainer';
import './Tab2.css';
import { Image } from '../context/imageContext';
import OpenCv from '../components/openCV/OpenCv';


const Tab2: React.FC = () => {
  const [image, setImage] = useContext(Image);
  return (
    <IonPage>
      < img
        src={image} alt="InkImage"
      />
      <OpenCv></OpenCv>
    </IonPage>
  );
};

export default Tab2;

import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonRow, IonCol, IonIcon, IonButton, IonBackdrop } from '@ionic/react';
import React, { useState, createContext, useEffect, useContext } from 'react';
import { brush, trash, close, add } from 'ionicons/icons';
import logo from "../assets/icon/INK.png"
import ExploreContainer from '../components/ExploreContainer';
import { useDropzone } from 'react-dropzone';
import './Tab1.scss';
import { ImageContext } from '../context/imageContext';

const Tab1: React.FC = () => {
  const imagePull = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
  const [selectedFile, setSelectedFile] = useState('none');
  const [openModal, setOpenModal] = useState(false);
  const [file, setFile] = useState("none");
  const [image, setImage] = useContext(ImageContext);

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    maxFiles: 1, accept: '.jpeg, .jpg, .png', onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      const reader = new FileReader();
      reader.onload = e => {
        console.log(reader.result);
        if (reader.result != null){
          setFile(reader.result.toString());
        }
        
      };
      reader.readAsDataURL(file);
      console.log(file);
    }
  });

  function onSelectFile(event: File) {

  }

  function onSelect(event: string,scr: string) {
    console.log(event);
    setSelectedFile(event)
    setOpenModal(true);
    setImage(scr);
  }
  function closeModal() {
    setSelectedFile('none');
    setOpenModal(false);
  }

  function onRemove() {
    /*console.log(event);
    this.files.splice(this.files.indexOf(event), 1);*/
  }

  return (

    <IonContent fullscreen className="content">
      {openModal ? <IonBackdrop className='backdrop'></IonBackdrop> : <div></div>}
      <IonRow>
        <IonCol className="header">
          <img className="title" src={logo} alt="ink" />
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol class="container">
          <div {...getRootProps({ className: 'drop' })}>
            <input {...getInputProps()} />
            <IonIcon icon={add}></IonIcon>
          </div>
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol class="container">
          <div className="images">
            <div className="images-container">
              {file != "none" ? <div className="one-image" >
                < img className={`${selectedFile === 'subida' ? "selected" : "none"}`}
                  src={file} alt="InkImage"
                  onClick={() => onSelect('subida',file)} />
              </div> : <div></div>}
              {imagePull.map((image, i) => {
                return <div className="one-image" >
                  <img className={`${selectedFile === image ? "selected" : "none"}`}
                    src={require('../assets/images/' + image + '.jpeg')} key={i} alt="InkImage"
                    onClick={() => onSelect(image,require('../assets/images/' + image + '.jpeg'))} />
                </div>
              }
              )}
            </div>
          </div>
        </IonCol>
      </IonRow>

      <IonRow className="container">
        <IonCol className={`modal ${openModal ? "opened" : "closed"}`} >
          <div className="modal-header">
            <IonIcon icon={close} className="icon" onClick={() => closeModal()} ></IonIcon>
          </div>
          <div className="modal-container">
            <IonButton fill="outline" shape="round" color="#dca301" className="button" routerLink="/tab3">
              <div className="button-container">
                <span className="text">Editar</span>
                <IonIcon className="icon" icon={brush}></IonIcon>
              </div>
            </IonButton>
            <IonButton fill="outline" shape="round" color="#dca301" className="button">
              <div className="button-container">
                <span className="text">Eliminar</span>
                <IonIcon className="icon" icon={trash}></IonIcon>
              </div>
            </IonButton>
          </div>
        </IonCol>
      </IonRow>
    </IonContent>

  );
};

export default Tab1;

import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonRow, IonCol } from '@ionic/react';
import { image } from 'ionicons/icons';
import logo from "../assets/icon/INK.png"
import ExploreContainer from '../components/ExploreContainer';
// import { NgxDropzoneComponent, NgxDropzonePreviewComponent } from 'ngx-dropzone';
import './Tab1.scss';

const Tab1: React.FC = () => {
  const imagePull = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tab 1</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonRow>
          <IonCol className="header">
            <img src={logo} alt="ink" />
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol class="container">
            dropzone
            {/* <ngx-dropzone class="drop" (change)="onSelect($event)" accept="image/jpeg,image/jpg,image/png" [multiple]="false">
            <ion-icon name="add"></ion-icon>
            <NgxDropzonePreviewComponent *ngFor="let f of files" [removable]="true" (removed)="onRemove(f)" class="drop-prev">
            <ngx-dropzone-label class="drop-prev-text">Archivo ({{ f.type }})</ngx-dropzone-label>
          </NgxDropzonePreviewComponent>
        </ngx-dropzone> */}
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol class="container">
            <div className="images">
              <div className="images-container">
                <div className="one-image" >
                  {imagePull.map((image, i) => {
                    return <img src={require('../assets/images/' + image + '.jpg')} key={i} alt="InkImage" />
                  }
                  )}
                </div>
              </div>
            </div>
          </IonCol>
        </IonRow>
      </IonContent>
    </IonPage>
  );
};

export default Tab1;

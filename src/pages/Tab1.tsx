import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonRow, IonCol } from '@ionic/react';
import { render } from '@testing-library/react';
import { image } from 'ionicons/icons';
import React from 'react';
import logo from "../assets/icon/INK.png"
import ExploreContainer from '../components/ExploreContainer';
import './Tab1.scss';

class Tab1 extends React.Component {
  selectedFile = '';
  openModal = false;
  imagesCode = ['1','2','3','4','5','6','7','8','9','10']

   onSelectFile(event:any) {
    console.log(event);
    this.selectedFile = event;
    this.openModal = true;
    console.log(this.openModal);
  }
  getSelected(e:any){
    console.log(e,this.selectedFile)
    return (this.selectedFile == e)
  }
render(){
  return (
    <IonPage >
      <IonContent fullscreen className='content'>
        <IonRow>
          <IonCol className="header">
            <img src={logo} alt="InkSurrectionLogo" className='title'/>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol className="containeer">
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
          <IonCol className="containeer">
            <div className="images">
              <div className="images-container">
                <div className="one-image" >
                  {this.imagesCode.map((image, i) => {
                    return <div className='one-image' key={i}>
                      <img src={require('../assets/images/' + image + '.jpg')} onClick={() => this.onSelectFile(image)} key={i} alt="InkImage" className={`${(image == this.selectedFile ? " selected" : "none")}`}/>
                    </div>
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
}
};

export default Tab1;

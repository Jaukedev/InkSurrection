import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonRow, IonCol } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import Canvas from '../components/Canvas'

import './Tab3.css';
const data = {
    image: 'https://www.w3schools.com/w3images/sound.jpg',
    settings: [
        {
            name: 'contrast',
            value: '100%',
        },
        {
            name: 'hue',
            value: '0deg'
        },
        {
            name: 'brightness',
            value: '100%'
        },
        {
            name: 'saturate',
            value: '100%'
        },
        {
            name: 'sepia',
            value: '0%'
        },
        {
            name: 'invert',
            value: '0%'
        }
    ]
}

const Tab3: React.FC = () => {

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Tab 3</IonTitle>
                </IonToolbar>
            </IonHeader>
            <Canvas></Canvas>
        </IonPage>
    );
};

export default Tab3;

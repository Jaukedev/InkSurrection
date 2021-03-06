import { IonContent } from '@ionic/react';
import React from 'react'
import SettingsFuntional from '../components/SettingsFuntional';

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

class ImageEditor extends React.Component {

    handleChange(e) {
        var name = e.target.id;
        var value = e.target.value;
        switch (name) {
            case 'contrast':
                data.settings[0].value = value + '%';
                break;
            case 'hue':
                data.settings[1].value = value + 'deg';
                break;
            case 'brightness':
                data.settings[2].value = value + '%';
                break;
            case 'saturate':
                data.settings[3].value = value + '%';
                break;
            case 'sepia':
                data.settings[4].value = value + '%';
                break;
            case 'invert':
                data.settings[5].value = value + '%';
                break;
        }
        this.forceUpdate();
    }

    render() {
        return (
            <div className="settings" style={{ height: '100%'}}>
                <SettingsFuntional settings={data.settings} url={data.image} onChange={this.handleChange.bind(this)} />
            </div>
        )
    }
}
export default ImageEditor

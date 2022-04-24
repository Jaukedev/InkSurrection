import React from 'react'
import Image from './Image';

class Settings extends React.Component {
    constructor(props) {
        super(props);
        this.setVal = this.setVal.bind(this);
    }


    setVal(setting, onChange) {
        switch (setting.name) {
            case 'contrast': return (<input type="range" step="1" min="0" max="200" id={setting.name} onChange={onChange} defaultValue={setting.value} />)
                break;
            case 'hue': return (<input type="range" step="1" min="0" max="360" id={setting.name} onChange={onChange} defaultValue={setting.value} />)
                break;
            case 'brightness': return (<input type="range" step="1" min="0" max="200" id={setting.name} onChange={onChange} defaultValue={setting.value} />)
                break;
            case 'saturate': return (<input type="range" step="1" min="0" max="100" id={setting.name} onChange={onChange} defaultValue={setting.value} />)
                break;
            case 'sepia': return (<input type="range" step="1" min="0" max="100" id={setting.name} onChange={onChange} defaultValue={setting.value} />)
                break;

            case 'invert': return (<input type="range" step="1" min="0" max="100" id={setting.name} onChange={onChange} defaultValue={setting.value} />)
                break;

            case 'grayscale': return (<input type="range" step="1" min="0" max="100" id={setting.name} onChange={onChange} defaultValue={setting.value} />)
                break;
            default: return (<input type="range" />)

        }
    }
    render() {
        var onchange = this.props.onChange;
        return (
          <div className="contentWrap">
            <Image url={this.props.url} settings={this.props.settings} />
            <div className="sidebar">
              <div className="title">Filters</div>
              {this.props.settings.map(function (setting, index) {
                return (
                  <div className="setting">
                    <label className="filterName">
                      <div>{setting.name}</div>
                      <div>{setting.value}</div>
                    </label>
                    {Settings.prototype.setVal(setting, onchange)}
                  </div>
                );
              })}
            </div>
            Ola
          </div>
        );
    }
}
export default Settings;
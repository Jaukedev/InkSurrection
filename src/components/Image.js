import React from "react";
class Image extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    var imgStyle = {
      filter: ` contrast(${this.props.settings[0].value}) hue-rotate(${this.props.settings[1].value}) brightness(${this.props.settings[2].value}) saturate(${this.props.settings[3].value}) sepia(${this.props.settings[4].value})
invert(${this.props.settings[5].value})`,
      backgroundImage: `url(${this.props.url})`,
    };
    return (
      <div className="imageContainer">
        <img className="guitar" style={imgStyle} />{" "}
      </div>
    );
  }
}


export default Image;

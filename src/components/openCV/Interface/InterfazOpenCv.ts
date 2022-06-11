export interface imageSettings {
  image: any;
  imageData: any;
  imageWidth: number;
  imageHeight: number;
  convertedToGrayScale: boolean;

  previewImageElement: any;

  redPixelMatrix: any[];
  greenPixelMatrix: any[];
  bluePixelMatrix: any[];
  alphaPixelMatrix: any[];

  pickedR: any;
  pickedG: any;
  pickedB: any;

  selectedFileName: any;
  selectStart: boolean;
  startX: any;
  startY: any;
  endX: any;
  endY: any;
  excludeArea: boolean;

  relativeStartX: any;
  relativeStartY: any;
  relativeEndX: any;
  relativeEndY: any;
}

export class imageSettingsClass {
  settings: imageSettings;
  constructor() {
    this.settings = {
      image: null,
      imageData: null,
      imageWidth: 0,
      imageHeight: 0,
      convertedToGrayScale: false,

      previewImageElement: null,

      redPixelMatrix: [],
      greenPixelMatrix: [],
      bluePixelMatrix: [],
      alphaPixelMatrix: [],

      pickedR: "",
      pickedG: "",
      pickedB: "",

      selectedFileName: "",
      selectStart: false,
      startX: "",
      startY: "",
      endX: "",
      endY: "",
      excludeArea: false,

      relativeStartX: "",
      relativeStartY: "",
      relativeEndX: "",
      relativeEndY: "",
    };
  }
}

import { IonButton, IonCol, IonContent, IonRow, IonRange, IonLoading, IonIcon } from '@ionic/react';
import { count } from 'console';
import { truncate } from 'fs';
import React, { forwardRef, useImperativeHandle, useEffect, useRef, useState } from 'react'

import { imageSettingsClass } from './Interface/InterfazOpenCv'
import "./OpenCv.scss";
import { barcode, save, refresh, close, arrowBack, colorFilter } from "ionicons/icons";
import { cursorTo } from 'readline';

const OpenCv = forwardRef((props: any, ref) => {
  const { disbleRange } = props;
  useImperativeHandle(ref, () => ({
    saluda: (e: any) => {
      filterSelected.filterName = e.target.name;
      filterHandler(e);
    }
  }));
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const expoRef = useRef<any>(null);
  const contRef = useRef<any>(null);
  const blackRef = useRef<any>(null);
  const whiteRef = useRef<any>(null);
  const satuRef = useRef<any>(null);
  const texRef = useRef<any>(null);
  const [imageSettings, setImageSettings] = useState(new imageSettingsClass().settings);
  const [imageAux, setImageAux] = useState<any>(0);
  const [operationOrgCtx, setOperationOrgCtx] = useState<null | CanvasRenderingContext2D>(null);
  const [editionData, setEditionData] = useState<any>({ filterSelected: 0, filterArray: [{ filter: 0, filterAmount: 0 }] });
  const [alpha, setalpha] = useState<number>(0);
  const [showLoading, setShowLoading] = useState(false);
  const [filterSelected, setFilterSelected] = useState({ name: "none", function: undefined, reference: undefined, filterName: 0 });
  const [filtersValues, setFiltersValues] = useState<any>([0, 0, 0, 0, 0, 0, 0])


  enum filters {
    none = 0,
    expose,
    contrast,
    black,
    white,
    saturationG,
    saturation,
    texture
  }
  const filterHandler = (e: any, current: any = 0) => {
    // aca se tiene que validar si el filtro ya esta puesto, si esta puesto no haces nada
    //luego recorro todo y le pongo una funcion que se encargue del switch 
    let curFil;
    let changeFlag = true;
    current ? curFil = current : curFil = parseInt(filters[filterSelected.filterName]);
    current ? changeFlag = false : changeFlag = true;
    let filVals = filtersValues
    filVals[curFil - 1] = e.target.value
    switch (curFil) {
      case 1:
        console.log(e.target.name, 'expose')
        expose(e, true);
        break;
      case 2:
        console.log(e.target.name, 'contrast')
        contrast(e, true);
        break;
      case 3:
      case 4:
        console.log(e.target.name, 'blackwhite')
        blackwhite(e);
        break;
      case 6:
        console.log(e.target.name, 'saturation')
        saturation(e);
        break;
      case 7:
        console.log(e.target.name, 'Sharp')
        Sharp(e);
        break;
      default:
        break;
    }
  }
  // const before = async () => {
  //   let e: any = {}
  //   setShowLoading(true);
  //   let index = editionData.filterArray.length - 1
  //   if (index > 0) {
  //     console.log(editionData.filterArray)
  //     let currentFilter = editionData.filterArray.pop();
  //     if (index == 1) {
  //       reset()
  //     } else {
  //       let fils = { ...filtersValues}
  //       fils[currentFilter.filter + 1] = currentFilter.filterAmount
  //       setFiltersValues(fils)
  //       console.log(filtersValues[currentFilter.filter] )
  //       switch (currentFilter.filter) {
  //         case 1:

  //           editionData.filterSelected == currentFilter.filter ? e = { target: { value: 0 } } : e = { target: { value: -currentFilter.filterAmount / 2 } };
  //           expose(e, false);
  //           e = { target: { value: 5 } }
  //           saturation(e, false)
  //           expoRef.current.value = 0;
  //           break;

  //         case 2:
  //           editionData.filterSelected == currentFilter.filter ? e = { target: { value: 0 } } : e = { target: { value: -currentFilter.filterAmount / 4 } };
  //           contrast(e, false)
  //           contRef.current.value = 0;
  //           break;

  //         case 3:
  //           e = { target: { value: 0, name: 'black' } }
  //           blackwhite(e, false)
  //           blackRef.current.value = 0;
  //           break;

  //         case 4:
  //           e = { target: { value: 0, name: 'white' } }
  //           blackwhite(e, false)
  //           whiteRef.current.value = 0;
  //           break;

  //         case 6:
  //           console.log('reseteando el sat')
  //           editionData.filterSelected == currentFilter.filter ? e = { target: { value: 0 } } : e = { target: { value: -currentFilter.filterAmount / 2 } };
  //           saturation(e, false)
  //           satuRef.current.value = 0;
  //           break;

  //         case 7:
  //           editionData.filterSelected == currentFilter.filter ? e = { target: { value: 0 } } : e = { target: { value: -currentFilter.filterAmount / 2 } };
  //           Sharp(e, false)
  //           texRef.current.value = 0;
  //           break;

  //         default:
  //           break;
  //       }
  //     }
  //   }
  //   setShowLoading(false);
  //   return 0;
  // }
  const reset = (UpdateFilterArray: any = true) => {
    console.log('reseteando');
    operationOrgCtx?.putImageData(imageAux, 0, 0);
    editionData.filterSelected = 0;
    setalpha(alpha + 1);
    putImage()
    generatePixelMatrix();
    UpdateFilterArray ? editionData.filterArray = [{ filter: 0, filterAmount: 0 }] : editionData.filterArray = [...editionData.filterArray];
  }
  const changeFilter = (filter: number, filterAmount: number, update: any) => {
    const callBack = (element: any) => element.filter == filter;

    let indexFounnd = editionData.filterArray.findIndex(callBack);
    console.log(filter, editionData.filterSelected)

    if (filter != editionData.filterSelected) {
      update ? editionData.filterSelected = filter : editionData.filterSelected = editionData.filterSelected;
      update ? editionData.filterArray = [...editionData.filterArray, { filter, filterAmount }] : editionData.filterArray = [...editionData.filterArray];
      generatePixelMatrix();
      if (indexFounnd == -1) {
        console.log('no lo encoentre -------------------')
        operationOrgCtx?.putImageData(imageAux, 0, 0);

      } else {
        // recorro todo y aplico el filtro modificando solo el arreglo seleccionado en el mismo orden
        console.log('first')
        return false
      }
      return true
    } else {


    }
    return true
  }
  const putImage = () => {

    let aux = canvasRef.current?.getContext('2d');
    if (aux) {
      setOperationOrgCtx(aux);
    }

    imageSettings.image = new Image();
    imageSettings.image.onload = () => {
      if (canvasRef.current && operationOrgCtx) {

        canvasRef.current.width = imageSettings.image.width;
        canvasRef.current.height = imageSettings.image.height;

        imageSettings.imageWidth = imageSettings.image.width;
        imageSettings.imageHeight = imageSettings.image.height;

        operationOrgCtx.drawImage(imageSettings.image, 0, 0, imageSettings.image.width, imageSettings.image.height);
        let imageData = operationOrgCtx.getImageData(0, 0, imageSettings.image.width, imageSettings.image.height);
        if (!imageAux) {
          aux?.drawImage(imageSettings.image, 0, 0, imageSettings.image.width, imageSettings.image.height);
          let imageDataAux = aux?.getImageData(0, 0, imageSettings.image.width, imageSettings.image.height);
          setImageAux(imageDataAux);
        }
        imageSettings.imageData = imageData;

        generatePixelMatrix()
      }
    }
    imageSettings.image.src = require('../../assets/images/maxresdefault.jpg')

  }
  const generatePixelMatrix = () => {
    var r = [], g = [], b = [], a = [];
    let redPixelMatrix = [];
    let greenPixelMatrix = [];
    let bluePixelMatrix = [];
    let alphaPixelMatrix = [];

    for (var i = 0; i < imageSettings.imageData.data.length; i = i + 4) {

      if ((i / 4) % imageSettings.imageWidth == 0) {
        if (i != 0) {
          redPixelMatrix.push(r);
          greenPixelMatrix.push(g);
          bluePixelMatrix.push(b);
          alphaPixelMatrix.push(a);
        }
        r = [];
        g = [];
        b = [];
        a = [];
      }
      r.push(imageSettings.imageData.data[i]);
      g.push(imageSettings.imageData.data[i + 1]);
      b.push(imageSettings.imageData.data[i + 2]);
      a.push(imageSettings.imageData.data[i + 3]);

    }
    imageSettings.redPixelMatrix = redPixelMatrix;
    imageSettings.greenPixelMatrix = greenPixelMatrix;
    imageSettings.bluePixelMatrix = bluePixelMatrix;
    imageSettings.alphaPixelMatrix = alphaPixelMatrix;

  }
  const expose = (e: any, update: any = true) => {
    if (changeFilter(filters.expose, e.target.value, update)) {

      let value = parseInt(e.target.value) / 100;

      applyFilterII([
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1]
      ], value);
    }

  }
  const contrast = (e: any, update: any = true) => {

    changeFilter(filters.contrast, e.target.value, update);

    let beta;
    e.target.value > 0 ? (beta = 20) : beta = -100;
    let sum = imageSettings.imageData.data.reduce((previous: any, current: any) => current += previous);
    let u = sum / imageSettings.imageData.data.length;
    let alpha: number;
    beta == 255 ? alpha = 2 : alpha = (255 + beta) / (255 - beta);
    let pos = 0;
    let factor: any;
    e.target.value > 0 ? factor = parseInt(e.target.value) / 100 : factor = parseInt(e.target.value) / -100;

    imageSettings.redPixelMatrix.map((rowValue: any, i: number) => {
      rowValue.map((colValue: any, j: number) => {
        let newRed = 0, newGreen = 0, newBlue = 0, newAlpha = 0;

        newRed = Math.round(alpha * (imageSettings.redPixelMatrix[i][j] - u) + u);
        newGreen = Math.round(alpha * (imageSettings.greenPixelMatrix[i][j] - u) + u);
        newBlue = Math.round(alpha * (imageSettings.bluePixelMatrix[i][j] - u) + u);
        newAlpha = imageSettings.alphaPixelMatrix[i][j];

        pos = i * imageSettings.imageWidth + j;

        let R = newRed * factor + (1 - factor) * imageSettings.redPixelMatrix[i][j];

        let G = newGreen * factor + (1 - factor) * imageSettings.greenPixelMatrix[i][j];

        let B = newBlue * factor + (1 - factor) * imageSettings.bluePixelMatrix[i][j];


        imageSettings.imageData.data[pos * 4] = Math.round(R);
        imageSettings.imageData.data[pos * 4 + 1] = Math.round(G);
        imageSettings.imageData.data[pos * 4 + 2] = Math.round(B);
        imageSettings.imageData.data[pos * 4 + 3] = newAlpha;
      })
    })
    operationOrgCtx?.putImageData(imageSettings.imageData, 0, 0);


  }
  const Sharp = (e: any, update: any = true) => {

    changeFilter(filters.texture, e.target.value, update);
    let value = parseInt(e.target.value) / 100

    applyFilterII([
      [-1, -1, -1],
      [-1, 9, -1],
      [-1, -1, -1]
    ], value);

  }

  const applyFilterII = (filter: any, factor: any = 1) => {
    let pos = 0;


    imageSettings.redPixelMatrix.map((rowValue: any, i: number) => {
      rowValue.map((colValue: any, j: number) => {
        let newRed = 0;
        let newGreen = 0;
        let newBlue = 0;
        let newAlpha = 0;
        filter.map((ejeX: any, x: number) => {
          ejeX.map((ejeY: any, y: number) => {
            if (imageSettings.redPixelMatrix[i + (x - 1)] == undefined) { return; }
            if (imageSettings.redPixelMatrix[i + (x - 1)][j + (y - 1)] == undefined) { return; }
            newRed += filter[x][y] * imageSettings.redPixelMatrix[i + (x - 1)][j + (y - 1)];
            newGreen += filter[x][y] * imageSettings.greenPixelMatrix[i + (x - 1)][j + (y - 1)];
            newBlue += filter[x][y] * imageSettings.bluePixelMatrix[i + (x - 1)][j + (y - 1)];
          })

        })
        newAlpha = imageSettings.alphaPixelMatrix[i][j];

        pos = i * imageSettings.imageWidth + j; // esta se invierte para rotar


        //TODO agrega a los r g b como arreglos
        imageSettings.imageData.data[pos * 4] = Math.round(newRed * factor + (1 - factor) * imageSettings.redPixelMatrix[i][j]);
        imageSettings.imageData.data[pos * 4 + 1] = Math.round(newGreen * factor + (1 - factor) * imageSettings.greenPixelMatrix[i][j]);
        imageSettings.imageData.data[pos * 4 + 2] = Math.round(newBlue * factor + (1 - factor) * imageSettings.bluePixelMatrix[i][j]);
        imageSettings.imageData.data[pos * 4 + 3] = newAlpha;
      })
    })
    operationOrgCtx?.putImageData(imageSettings.imageData, 0, 0);
  }
  const grayScale = (e: any, update: any = true) => {

    changeFilter(filters.saturation, e.target.value, update);
    let factor = parseInt(e.target.value) / 100;
    let pos = 0;
    // hacerlo con map y con index
    imageSettings.redPixelMatrix.map((rowValue: any, i: number) => {
      rowValue.map((colValue: any, j: number) => {

        let newRed = 0;
        let newGreen = 0;
        let newBlue = 0;
        let newAlpha = 0;

        let meanColor = (imageSettings.redPixelMatrix[i][j] +
          imageSettings.greenPixelMatrix[i][j] +
          imageSettings.bluePixelMatrix[i][j]) / 3;


        newRed = meanColor;
        newGreen = meanColor;
        newBlue = meanColor;
        newAlpha = imageSettings.alphaPixelMatrix[i][j];

        pos = i * imageSettings.imageWidth + j;

        let R = newRed * factor + (1 - factor) * imageSettings.redPixelMatrix[i][j];

        let G = newGreen * factor + (1 - factor) * imageSettings.greenPixelMatrix[i][j];

        let B = newBlue * factor + (1 - factor) * imageSettings.bluePixelMatrix[i][j];


        imageSettings.imageData.data[pos * 4] = Math.round(R);
        imageSettings.imageData.data[pos * 4 + 1] = Math.round(G);
        imageSettings.imageData.data[pos * 4 + 2] = Math.round(B);
        imageSettings.imageData.data[pos * 4 + 3] = newAlpha;
      })
    })
    operationOrgCtx?.putImageData(imageSettings.imageData, 0, 0);

  }

  const saturationHandler = (e: any, update: any = true) => {
    let newE = { target: { value: 0 } };
    newE.target.value = Math.abs(e.target.value);
    e.target.value < 0 ? grayScale(newE, update) : saturation(newE, update);
  }
  const saturation = (e: any, update: any = true) => {

    changeFilter(filters.saturation, e.target.value, update);

    let beta = 150;
    let sum = imageSettings.imageData.data.reduce((previous: any, current: any) => current += previous);
    // let u = sum / imageSettings.imageData.data.length;
    let alpha: number;
    beta == 255 ? alpha = 0 : alpha = (255 + beta) / (255 - beta);
    let pos = 0;
    let factor: any = parseInt(e.target.value) / 100;;

    imageSettings.redPixelMatrix.map((rowValue: any, i: number) => {
      rowValue.map((colValue: any, j: number) => {
        let newRed = 0, newGreen = 0, newBlue = 0, newAlpha = 0;
        let u = (imageSettings.redPixelMatrix[i][j] + imageSettings.greenPixelMatrix[i][j] + imageSettings.bluePixelMatrix[i][j]) / 3;

        newRed = Math.round(alpha * (imageSettings.redPixelMatrix[i][j] - u) + u);
        newGreen = Math.round(alpha * (imageSettings.greenPixelMatrix[i][j] - u) + u);
        newBlue = Math.round(alpha * (imageSettings.bluePixelMatrix[i][j] - u) + u);
        newAlpha = imageSettings.alphaPixelMatrix[i][j];

        pos = i * imageSettings.imageWidth + j;

        let R = newRed * factor + (1 - factor) * imageSettings.redPixelMatrix[i][j];

        let G = newGreen * factor + (1 - factor) * imageSettings.greenPixelMatrix[i][j];

        let B = newBlue * factor + (1 - factor) * imageSettings.bluePixelMatrix[i][j];


        imageSettings.imageData.data[pos * 4] = Math.round(R);
        imageSettings.imageData.data[pos * 4 + 1] = Math.round(G);
        imageSettings.imageData.data[pos * 4 + 2] = Math.round(B);
        imageSettings.imageData.data[pos * 4 + 3] = newAlpha;
      })
    })
    operationOrgCtx?.putImageData(imageSettings.imageData, 0, 0);
  }

  const blackwhite = (e: any, update: any = true) => {

    e.target.name == 'black' ? changeFilter(filters.black, e.target.value, update) : changeFilter(filters.white, e.target.value, update);
    let factor = parseInt(e.target.value) / 100
    let pos = 0;
    imageSettings.redPixelMatrix.map((rowValue: any, i: number) => {
      rowValue.map((colValue: any, j: number) => {
        let newRed = 0, newGreen = 0, newBlue = 0, newAlpha = 0;
        let u = (imageSettings.redPixelMatrix[i][j] + imageSettings.greenPixelMatrix[i][j] + imageSettings.bluePixelMatrix[i][j]) / 3;
        let value;
        var sum = (imageSettings.redPixelMatrix[i][j] +
          imageSettings.greenPixelMatrix[i][j] +
          imageSettings.bluePixelMatrix[i][j] / 3);
        let condition;
        e.target.name == 'black' ? condition = sum < 60 : condition = sum > 200;
        e.target.name == 'black' ? value = -1 * factor : value = 1;
        if (condition) { //! esta condicion tiene que ser en base a la imagen original

          newRed = imageSettings.redPixelMatrix[i][j] + 30 * value;
          newGreen = imageSettings.greenPixelMatrix[i][j] + 30 * value;;
          newBlue = imageSettings.bluePixelMatrix[i][j] + 30 * value;;
          newAlpha = imageSettings.alphaPixelMatrix[i][j];

          pos = i * imageSettings.imageWidth + j;

          let R = newRed * factor + (1 - factor) * imageSettings.redPixelMatrix[i][j];

          let G = newGreen * factor + (1 - factor) * imageSettings.greenPixelMatrix[i][j];

          let B = newBlue * factor + (1 - factor) * imageSettings.bluePixelMatrix[i][j];


          imageSettings.imageData.data[pos * 4] = Math.round(R);
          imageSettings.imageData.data[pos * 4 + 1] = Math.round(G);
          imageSettings.imageData.data[pos * 4 + 2] = Math.round(B);
          imageSettings.imageData.data[pos * 4 + 3] = newAlpha;
        }
      })
    })

    operationOrgCtx?.putImageData(imageSettings.imageData, 0, 0);

  }
  const gamma = () => { //Este formato me va a servir para hacer el gamma correction que es el valor elevado a pow(R, 1/Gamma) recive el gamma como factor
    for (var i = 0; i < imageSettings.imageData.data.length; i = i + 4) {
      var pixel = [];
      var red = imageSettings.imageData.data[i];
      var green = imageSettings.imageData.data[i + 1];
      var blue = imageSettings.imageData.data[i + 2];
      var a = imageSettings.imageData.data[i + 3];


      imageSettings.imageData.data[i] = red ** 1 / 0.5;
      imageSettings.imageData.data[i + 1] = green ** 1 / 0.5;
      imageSettings.imageData.data[i + 2] = blue ** 1 / 0.5;
      imageSettings.imageData.data[i + 3] = a;
    }
    console.log(imageSettings.imageData);

    operationOrgCtx?.putImageData(imageSettings.imageData, 0, 0);

  }


  useEffect(() => {
    putImage();
  }, [operationOrgCtx])

  const settings = [
    {
      name: "Exposición",
      filterName: "expose",
      reference: expoRef,
      function: expose,

    },
    {
      name: "Contraste",
      filterName: "contrast",
      reference: contRef,
      function: contrast,
    },
    {
      name: "Negros",
      filterName: "black",
      reference: blackRef,
      function: blackwhite,
    },
    {
      name: "Blancos",
      filterName: "white",
      reference: whiteRef,
      function: blackwhite,
    },
    {
      name: "Saturación",
      filterName: "saturation",
      reference: satuRef,
      function: saturationHandler,
    },
    {
      name: "Textura",
      filterName: "texture",
      reference: texRef,
      function: Sharp,
    },
  ];

  return (<>       <div className="canvas-container">
    <canvas ref={canvasRef}>
    </canvas>
    <IonLoading
      isOpen={showLoading}
      onDidDismiss={() => setShowLoading(false)}
      message={'Cargando...'}
    />
  </div> </>
  )
})

export default OpenCv
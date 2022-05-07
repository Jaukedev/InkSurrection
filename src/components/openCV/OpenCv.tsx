import { IonButton, IonCol, IonContent, IonRow, IonRange } from '@ionic/react';
import React, { useEffect, useRef, useState } from 'react'
import { imageSettingsClass } from './Interface/InterfazOpenCv'
import "./OpenCv.scss";
const OpenCv = () => {

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imageSettings, setImageSettings] = useState(new imageSettingsClass().settings);
  const [operationOrgCtx, setOperationOrgCtx] = useState<null | CanvasRenderingContext2D>(null);
  const [alpha, setalpha] = useState<number>(0)

  const putImage = () => {

    let aux = canvasRef.current?.getContext('2d');
    if (aux) {
      console.log(aux);
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
        console.log(imageSettings.image.width, imageSettings.image.height)
        let imageData = operationOrgCtx.getImageData(0, 0, imageSettings.image.width, imageSettings.image.height);


        imageSettings.imageData = imageData;
        console.log(imageData);
        generatePixelMatrix()
      }
    }
    imageSettings.image.src = require('../../assets/images/pichuleitor.jpg')

  }
  const sharp = (e: any) => {
    let value = parseInt(e.target.value) / 100
    
    applyFilter([
      [0, 0, 0],
      [0, value, 0],
      [0, 0, 0]
    ]);

  }
  const applyFilter = (filter: any) => {
    for (var i = 0; i < imageSettings.imageData.data.length; i = i + 4) {

      var finalR, finalG, finalB;
      var row: any = Math.round((i / 4) / imageSettings.imageWidth);
      var col = (i / 4) % imageSettings.imageWidth;

      if (row == 0 || col == 0 ||
        row == imageSettings.imageHeight - 1 || col == imageSettings.imageWidth - 1)
        continue;

      var finalR: any = 0, finalG: any = 0, finalB: any = 0, finalA: any = 0;
      for (var x = 0; x < 3; x++) {
        for (var y = 0; y < 3; y++) {
          if (imageSettings.redPixelMatrix[row + (x - 1)] == undefined) { continue; }
          if (imageSettings.redPixelMatrix[row + (x - 1)][col + (y - 1)] == undefined) { continue; }
          finalR += filter[x][y] * imageSettings.redPixelMatrix[row + (x - 1)][col + (y - 1)];
          finalG += filter[x][y] * imageSettings.greenPixelMatrix[row + (x - 1)][col + (y - 1)];
          finalB += filter[x][y] * imageSettings.bluePixelMatrix[row + (x - 1)][col + (y - 1)];
          finalA += filter[x][y] * imageSettings.alphaPixelMatrix[row + (x - 1)][col + (y - 1)];
        }
      }

      if (imageSettings.convertedToGrayScale) {

        imageSettings.imageData.data[i] = (finalR + finalG + finalB) / 3;
        imageSettings.imageData.data[i + 1] = (finalR + finalG + finalB) / 3;
        imageSettings.imageData.data[i + 2] = (finalR + finalG + finalB) / 3;
        imageSettings.imageData.data[i + 3] = finalA;
      } else {
        imageSettings.imageData.data[i] = finalR;
        imageSettings.imageData.data[i + 1] = finalG;
        imageSettings.imageData.data[i + 2] = finalB;
        imageSettings.imageData.data[i + 3] = finalA;
      }

      // ! hay que remplazar la imagen con la verga filtrada 
      // * podria limitar los blancos para el brillo y que sea mas rapido
    }

    
    operationOrgCtx?.putImageData(imageSettings.imageData, 0, 0);
    // imageSettings.image.src = canvasRef.current?.toDataURL;
    
    // this.previewImage();
    // this.previewImage();
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
      // ! revisar las dimenciones (tiene que ser una matriz)
      r.push(imageSettings.imageData.data[i]);
      g.push(imageSettings.imageData.data[i + 1]);
      b.push(imageSettings.imageData.data[i + 2]);
      a.push(imageSettings.imageData.data[i + 3]);

    }
    console.log(redPixelMatrix);
    //!esta wea va en otro lado
    imageSettings.redPixelMatrix = redPixelMatrix;
    imageSettings.greenPixelMatrix = greenPixelMatrix;
    imageSettings.bluePixelMatrix = bluePixelMatrix;
    imageSettings.alphaPixelMatrix = alphaPixelMatrix;
  }
  useEffect(() => {

    putImage();
  }, [operationOrgCtx])

  return (
    <>
      <IonContent className='container' >
        <div>OpenCv</div>
        <IonRow className='canvas-container'>
          <canvas ref={canvasRef}>
          </canvas>
          <IonButton onClick={sharp}>
            dale tu col
          </IonButton>
          <input type='range'  step={1}
            min={0}
            max={100}  onChange={sharp}></input>
          {/* value={alpha} */}
        </IonRow>

      </IonContent>
    </>
  )
}

export default OpenCv
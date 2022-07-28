import React, { forwardRef, useImperativeHandle, useEffect, useRef, useState } from 'react'
import { evaluate, matrix, multiply, size, resize, add, MathArray } from 'mathjs'
import { cloudSharp } from 'ionicons/icons'
import { IonLoading, } from '@ionic/react';
import "./OpenCv.scss";

const AndroideCV = forwardRef((props: any, ref) => {
  const { disbleRange } = props;
  useImperativeHandle(ref, () => ({
    saluda: (e: any) => {
      filterHandler(e);
    }
  }));
  const [imageCurr, setImageCurr] = useState<HTMLImageElement>()
  const [imageCurrData, setImageCurrData] = useState<any>()
  const [imageR, setImageR] = useState<any[][]>([])
  const [imageG, setImageG] = useState<any[][]>([])
  const [imageB, setImageB] = useState<any[][]>([])
  const [imageA, setImageA] = useState<any[][]>([])
  // const [filtros, setfiltros] = useState(second)
  const [imageIni, setImageIni] = useState<HTMLImageElement | null>(null)
  const [imageArray, setImageArray] = useState<any>([{ key: 'inicial', value: [], factor: 0 }, { key: 'sharp', value: [], factor: 0 }, { key: 'expose', value: [], factor: 0 }, { key: 'constrast', value: [], factor: 0 }, { key: 'saturation', value: [], factor: 0 }, { key: 'white', value: [], factor: 0 }, { key: 'black', value: [], factor: 0 }])// podria ser un arreglo de el filtro, la cantidad y la imagen
  const [loading, setloading] = useState(false)

  const canvasRef = useRef<HTMLCanvasElement>(null)

  // ! ahora si le puedo poner el filtro en orden a la primera imagen y no tengo que wear con las posiciones

  useEffect(() => {
    setloading(true)
    const image = new Image();
    const imageIni = new Image();
    console.log('al inicio')
    image.src = require('../../assets/images/maxresdefault.jpg')
    imageIni.src = require('../../assets/images/maxresdefault.jpg')
    image.onload = () => {
      setImageCurr(image);
    }
    imageIni.onload = () => setImageIni(imageIni);

  }, [])

  useEffect(() => {

    let dataImage;
    let ctx: CanvasRenderingContext2D = canvasRef.current?.getContext('2d')!;

    if (imageCurr && canvasRef.current) {

      canvasRef.current.width = imageCurr.width;
      canvasRef.current.height = imageCurr.height;
      ctx.drawImage(imageCurr, 0, 0, imageCurr.width, imageCurr.height);
      dataImage = ctx.getImageData(0, 0, imageCurr.width, imageCurr.height);// aca se extrae el nuevo data de la imagen
      let copi = [...Array.from(dataImage.data)]
      let found = imageArray.find((element: any) => element.key == 'inicial');
      if (found) {
        imageArray[0].value = copi

      }

      setImageCurrData(dataImage);//data      
    }
  }, [canvasRef, imageCurr])

  useEffect(() => { // este imagen array se va a tener que guardar pero como custome filter
    console.log('💡 Se actualiza la data actual')
    console.log('🌈 Se obtienen los canales RGB')
    generatePixelMatrix();
  }, [imageCurrData])
  useEffect(() => {
    if (imageArray[imageArray.length - 1].value) {
      console.log('✔️ Se completa el image array')
      console.log(imageArray)
      //   //! aca tengo que cargar las matrices 
      //   // siempre que se cambie el slider se hace esto mismo
      //   let ctx: CanvasRenderingContext2D = canvasRef.current?.getContext('2d')!;
      //   let intResult: any = []

      //   let m1 = matrix(imageArray[0].value)
      //   let m2 = matrix(imageArray[1].value)

      //   let alpha = 0.8
      //   m1.resize(size(m2))
      //   let resultA = multiply(m1, 1 - alpha)
      //   let resultB = multiply(m2, alpha)
      //   let result = add(resultA, resultB)

      //   result.map((value, index) => {
      //     intResult.push(parseInt(value))
      //     imageCurrData.data[index] = parseInt(value)
      //   })

      //   console.log('filtros Cargados')
      //   setloading(false);
      //   ctx?.putImageData(imageCurrData, 0, 0);

    }
  }, [imageArray])

  useEffect(() => {
    if (imageR && imageCurr) {
      console.log('⚒️ se crean filtros');

      Sharp({ target: { value: 100 } });
      expose({ target: { value: 15 } });
      contrast({ target: { value: 50 } });
      saturation({ target: { value: 30 } });
      blackwhite({ target: { value: 30, name: 'black' } });
      blackwhite({ target: { value: 30, name: 'white' } });
      //TODO getFilterMatrix()
      setloading(false)
    }

  }, [imageR])

  const getFilterMatrix = () => {

  }
  const filterHandler = (e: any) => {
    console.log(e.target.name, e.target.value);
    filtering(e.target.value, e.target.name)
  }
  const Sharp = (e: any, update: any = true) => {

    // changeFilter(filters.texture, e.target.value, update);
    let value = parseInt(e.target.value) / 100

    applyFilterII([
      [-1, -1, -1],
      [-1, 9, -1],
      [-1, -1, -1]
    ], value, 0, 'sharp');

  }
  const expose = (e: any, update: any = true) => {


    let value = parseInt(e.target.value) / 100;

    applyFilterII([
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1]
    ], value, 0, 'expose');


  }
  const contrast = (e: any, update: any = true) => {

    // changeFilter(filters.contrast, e.target.value, update);

    let beta;
    e.target.value > 0 ? (beta = 20) : beta = -100;
    let sum = imageCurrData.data.reduce((previous: any, current: any) => current += previous);
    let u = sum / imageCurrData.data.length;
    let alpha: number;
    beta == 255 ? alpha = 2 : alpha = (255 + beta) / (255 - beta);
    // let pos = 0;
    // let factor: any;
    // e.target.value > 0 ? factor = parseInt(e.target.value) / 100 : factor = parseInt(e.target.value) / -100;
    let ctx: CanvasRenderingContext2D = canvasRef.current?.getContext('2d')!;
    let pos = 0;
    let newA: any = [];
    imageR.map((rowValue: any, i: number) => {
      if (imageCurrData && imageCurr) {

        rowValue.map((colValue: any, j: number) => {
          let newRed = 0, newGreen = 0, newBlue = 0, newAlpha = 0;

          newRed = Math.round(alpha * (imageR[i][j] - u) + u);
          newGreen = Math.round(alpha * (imageG[i][j] - u) + u);
          newBlue = Math.round(alpha * (imageB[i][j] - u) + u);
          newAlpha = imageA[i][j];

          pos = i * imageCurr.width + j;


          newA[pos * 4] = Math.round(newRed);
          newA[pos * 4 + 1] = Math.round(newGreen);
          newA[pos * 4 + 2] = Math.round(newBlue);
          newA[pos * 4 + 3] = newAlpha;
        })
      }
    })
    imageArray[3].value = newA
  }
  const saturation = (e: any, update: any = true) => {
    let beta = 150;
    let sum = imageCurrData.data.reduce((previous: any, current: any) => current += previous);
    // let u = sum / imageSettings.imageData.data.length;
    let alpha: number;
    beta == 255 ? alpha = 0 : alpha = (255 + beta) / (255 - beta);
    let pos = 0;
    // let factor: any = parseInt(e.target.value) / 100;;
    let newA: any = [];
    if (imageCurrData && imageCurr) {

      imageR.map((rowValue: any, i: number) => {
        rowValue.map((colValue: any, j: number) => {
          let newRed = 0, newGreen = 0, newBlue = 0, newAlpha = 0;
          let u = (imageR[i][j] + imageG[i][j] + imageB[i][j]) / 3;

          newRed = Math.round(alpha * (imageR[i][j] - u) + u);
          newGreen = Math.round(alpha * (imageB[i][j] - u) + u);
          newBlue = Math.round(alpha * (imageB[i][j] - u) + u);
          newAlpha = imageA[i][j];

          pos = i * imageCurr.width + j;


          newA[pos * 4] = Math.round(newRed);
          newA[pos * 4 + 1] = Math.round(newGreen);
          newA[pos * 4 + 2] = Math.round(newBlue);
          newA[pos * 4 + 3] = newAlpha;
        })
      })
    }
    imageArray[4].value = newA
  }
  const blackwhite = (e: any, update: any = true) => {

    let newA: any = [];
    // let factor = parseInt(e.target.value) / 100
    let pos = 0;
    let condition;
    let fact;

    if (imageCurrData && imageCurr) {
      imageR.map((rowValue: any, i: number) => {
        rowValue.map((colValue: any, j: number) => {
          let newRed = 0, newGreen = 0, newBlue = 0, newAlpha = 0;
          let u = (imageR[i][j] + imageG[i][j] + imageB[i][j]) / 3;
          let value;
          var sum = (imageR[i][j] +
            imageG[i][j] +
            imageB[i][j] / 3);
          pos = i * imageCurr.width + j;

          e.target.name == 'black' ? condition = sum < 99 : condition = sum > 200;
          e.target.name == 'black' ? fact = -1 : fact = 1;
          newRed = imageR[i][j];
          newGreen = imageG[i][j];
          newBlue = imageB[i][j];
          newAlpha = imageA[i][j];

          if (condition) { //! esta condicion tiene que ser en base a la imagen original

            newRed = imageR[i][j] + 30 * fact;
            newGreen = imageG[i][j] + 30 * fact;
            newBlue = imageB[i][j] + 30 * fact;
            newAlpha = imageA[i][j];

          }
          newA[pos * 4] = Math.round(newRed);
          newA[pos * 4 + 1] = Math.round(newGreen);
          newA[pos * 4 + 2] = Math.round(newBlue);
          newA[pos * 4 + 3] = newAlpha;
        })
      })
      e.target.name == 'black' ? imageArray[6].value = newA : imageArray[5].value = newA

    }

  }
  const filtering = (value: any, name: any) => {
    //TODO ACA CAMBIAMOS EL FILTRO SILO QUE SE CAMBIA

    value = parseInt(value) / 100
    switch (name) {
      case 'texture':
        imageArray[1].factor = value;
        break;
      case 'expose':
        imageArray[2].factor = value;
        break;
      case 'contrast':
        imageArray[3].factor = value;
        break;
      case 'saturation':
        imageArray[4].factor = value;
        break;
      case 'black':
        imageArray[6].factor = value;
        break;
      case 'white':
        imageArray[5].factor = value;
        break;
      default:
        break;
    }
    putNewImage()

    // hacer asincrono con un efect
    // o intentar hacer asincrono

  }
  const putNewImage = () => {
    if (imageArray.length == 7) {
      let ctx: CanvasRenderingContext2D = canvasRef.current?.getContext('2d')!;

      let m1 = imageArray[0].value
      let m2 = imageArray[1].value
      // let m3 = imageArray[2].value
      // let m4 = imageArray[3].value
      // let m5 = imageArray[3].value

      m1 = resize(m1, size(m2))

      let filter1 = add(multiply(m1, 1 - imageArray[1].factor), multiply(imageArray[1].value, imageArray[1].factor));
      let filter2 = add(multiply(filter1, 1 - imageArray[2].factor), multiply(imageArray[2].value, imageArray[2].factor));
      let filter3 = add(multiply(filter2, 1 - imageArray[3].factor), multiply(imageArray[3].value, imageArray[3].factor));
      let filter4 = add(multiply(filter3, 1 - imageArray[4].factor), multiply(imageArray[4].value, imageArray[4].factor));
      let filter5 = add(multiply(filter4, 1 - imageArray[5].factor), multiply(imageArray[5].value, imageArray[5].factor));
      let filter6 = add(multiply(filter5, 1 - imageArray[6].factor), multiply(imageArray[6].value, imageArray[6].factor));
      filter6.map((value: any, index: any) => {
        imageCurrData.data[index] = parseInt(value);
      });
      // lo logre una vez lo puedo hacer otra vez
      // let aux2 ;
      // aux2 = new Uint8ClampedArray(filter4)
      // let objCopy = { ...imageCurrData }
      // objCopy.data = aux2;
      // objCopy = new ImageData(objCopy, filter4.width)
      // aux2 = new 
      // let aux = filter1.toArray()
      // let imageNew = new ImageData(filter4, filter4.width);
      // imageNew.data = filter1
      // console.log(aux2[0])
      setloading(false);
      ctx?.putImageData(imageCurrData, 0, 0);
    }
  }
  // ! poner el factor para mejorar el filtro
  const applyFilterII = (filter: any, factor: any = 1, key = 0, filteName: string) => {
    let ctx: CanvasRenderingContext2D = canvasRef.current?.getContext('2d')!;
    let pos = 0;
    let newA: any = [];
    if (imageCurrData && imageCurr) {

      imageR.map((rowValue: any, i: number) => {
        rowValue.map((colValue: any, j: number) => {
          let newRed = 0;
          let newGreen = 0;
          let newBlue = 0;
          let newAlpha = 0;
          filter.map((ejeX: any, x: number) => {
            ejeX.map((ejeY: any, y: number) => {
              if (imageR[i + (x - 1)] == undefined) { return; }
              if (imageR[i + (x - 1)][j + (y - 1)] == undefined) { return; }
              newRed += filter[x][y] * imageR[i + (x - 1)][j + (y - 1)];
              newGreen += filter[x][y] * imageG[i + (x - 1)][j + (y - 1)];
              newBlue += filter[x][y] * imageB[i + (x - 1)][j + (y - 1)];
            })

          })
          newAlpha = imageA[i][j];

          pos = i * imageCurr.width + j; // esta se invierte para rotar


          //TODO agrega a los r g b como arreglos

          newA[pos * 4] = Math.round(newRed);
          newA[pos * 4 + 1] = Math.round(newGreen);
          newA[pos * 4 + 2] = Math.round(newBlue);
          newA[pos * 4 + 3] = newAlpha;
        })
      })
      // ctx?.putImageData(imageCurrData, 0, 0);
      if (filteName == 'expose') {
        imageArray[2].value = newA
      } else {
        console.log('sharp')
        imageArray[1].value = newA
      }
      // if (!found) {
      //   setauxImageCurr({ key: filteName, value: newA })
      //   setImageArray([...imageArray, { key: filteName, value: newA }])
      //   console.log('no encuentro el filtro que se esta poniendo', { key: filteName, value: newA })
      // }

    }
  }
  const generatePixelMatrix = () => {
    if (imageIni) {

      var r = [], g = [], b = [], a = [];
      let redPixelMatrix = [];
      let greenPixelMatrix = [];
      let bluePixelMatrix = [];
      let alphaPixelMatrix = [];
      // la matriz se genera cuando queremos hacer el nuevo patron para agregar filtro custome
      for (var i = 0; i < imageCurrData.data.length; i = i + 4) {



        if ((i / 4) % imageIni.width == 0) {
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
        r.push(imageCurrData.data[i]);
        g.push(imageCurrData.data[i + 1]);
        b.push(imageCurrData.data[i + 2]);
        a.push(imageCurrData.data[i + 3]);

      }

      setImageR(redPixelMatrix);
      setImageG(greenPixelMatrix);
      setImageB(bluePixelMatrix);
      setImageA(alphaPixelMatrix);
    }

  }

  return (
    <>
      <div className="canvas-container">
        <canvas ref={canvasRef}></canvas>
        <IonLoading
          isOpen={loading}
          message={'Loading...'}
        />
      </div>
    </>
  )
})
export default AndroideCV
import React, { forwardRef, useImperativeHandle, useEffect, useRef, useState } from 'react'
import { evaluate, matrix, multiply, size, resize, add } from 'mathjs'
import { cloudSharp } from 'ionicons/icons'
import { IonLoading, } from '@ionic/react';

const AndroideCV = forwardRef((props: any, ref) => {
  const { disbleRange } = props;
  useImperativeHandle(ref, () => ({
    saluda: (e: any) => {
      filterHandler(e);
    }
  }));
  const [imageCurr, setImageCurr] = useState<HTMLImageElement>()
  const [imageCurrData, setImageCurrData] = useState<any>()
  const [filters, setFilters] = useState<any>([{ key: 'contrast', value: 100 }, { key: 'saturate', value: 100 }, { key: 'brightness', value: 100 }, { key: 'grayscale', value: 0 }])
  const [imageR, setImageR] = useState<any[][]>([])
  const [imageG, setImageG] = useState<any[][]>([])
  const [imageB, setImageB] = useState<any[][]>([])
  const [imageA, setImageA] = useState<any[][]>([])
  const [imageIni, setImageIni] = useState<HTMLImageElement | null>(null)
  const [imageArray, setImageArray] = useState<any>([{ key: 'inicial', value: [], factor:0 }, { key: 'sharp', value: [], factor:0 }, { key: 'expose', value: [], factor:0 }, { key: 'constrast', value: [], factor:0 }])// podria ser un arreglo de el filtro, la cantidad y la imagen
  const [loading, setloading] = useState(false)

  const canvasRef = useRef<HTMLCanvasElement>(null)

  // ! ahora si le puedo poner el filtro en orden a la primera imagen y no tengo que wear con las posiciones

  useEffect(() => {
    // setloading(true)
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
    if (imageArray[imageArray.length-1].value) {
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
    if(imageR && imageCurr){ 
      console.log('⚒️ se crean filtros');

      Sharp({ target: { value: 50 } });
      expose({ target: { value: 50 } });
    }
    
  }, [imageR])


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
    ], value, 0,'sharp');

  }
  const expose = (e: any, update: any = true) => {


      let value = parseInt(e.target.value) / 100;

      applyFilterII([
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1]
      ],value,0,'expose' );


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

    imageR.map((rowValue: any, i: number) => {
      if (imageCurrData && imageCurr) {
        let ctx: CanvasRenderingContext2D = canvasRef.current?.getContext('2d')!;
        let pos = 0;
        let newA: any = [];
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
    // operationOrgCtx?.putImageData(imageSettings.imageData, 0, 0);


  }
  const filtering = (value: any,name: any)=>{
    if (imageArray.length == 4) {
      console.log('✔️ filtering',name)
      let ctx: CanvasRenderingContext2D = canvasRef.current?.getContext('2d')!;
      let intResult: any = []

      let m1 = matrix(imageArray[0].value)
      let m2 = matrix(imageArray[1].value)
      let m3 = matrix(imageArray[2].value)
      let alpha = 0;
      let beta = 0;
      if(name == 'sharp'){
        alpha = value/100
      }else{
         beta = value/100
      }
      m1.resize(size(m2))
      let resultA = multiply(m1, 1 - alpha)
      let resultB = multiply(m2, alpha)
      let filter1 = add(multiply(m1, 1 - alpha), multiply(m2, alpha))
      let filter2 = add(multiply(filter1, 1 - beta), multiply(m3, beta))
      console.log(alpha,beta,filter2);
      filter2.map((value, index) => {
        imageCurrData.data[index] = parseInt(value)
      })
      // lo logre una vez lo puedo hacer otra vez
      // let aux = filter1.toArray()
      // let aux2 = new Array(aux)
      // let imageNew = new ImageData(aux2, imageCurr?.width, imageCurr);
      // imageNew.data = filter1
      console.log('filtros Cargados')
      setloading(false);
      ctx?.putImageData(imageCurrData, 0, 0);

    }
  }
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
          // imageCurrData.data[pos * 4] = Math.round(newRed);
          // imageCurrData.data[pos * 4 + 1] = Math.round(newGreen);
          // imageCurrData.data[pos * 4 + 2] = Math.round(newBlue);
          // imageCurrData.data[pos * 4 + 3] = newAlpha;
          newA[pos * 4] = Math.round(newRed);
          newA[pos * 4 + 1] = Math.round(newGreen);
          newA[pos * 4 + 2] = Math.round(newBlue);
          newA[pos * 4 + 3] = newAlpha;
        })
      })
      // ctx?.putImageData(imageCurrData, 0, 0);
      if(filteName == 'expose'){
        imageArray[2].value = newA
      }else{
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
    <>androideCV
      <canvas ref={canvasRef}></canvas>
      <IonLoading
        isOpen={loading}
        onDidDismiss={() => setloading(false)}
        message={'Loading...'}
      />
    </>
  )
})
export default AndroideCV
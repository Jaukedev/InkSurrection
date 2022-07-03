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
  const [customeFilters, setCustomeFilters] = useState([{ key: 'none', value: 0, originImage: [] }])
  const [imageR, setImageR] = useState<any[][]>([])
  const [imageG, setImageG] = useState<any[][]>([])
  const [imageB, setImageB] = useState<any[][]>([])
  const [imageA, setImageA] = useState<any[][]>([])
  const [imageIni, setImageIni] = useState<HTMLImageElement | null>(null)
  const [imageArray, setImageArray] = useState<any>([])// podria ser un arreglo de el filtro, la cantidad y la imagen
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
      if (!found) {
        setImageArray([...imageArray, { key: 'inicial', value: copi }]);
        console.log('no encuentro el filtro que se esta poniendo', found)
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

    if (imageArray.length == 2) {
      console.log('✔️ Se completa el image array')
      console.log(imageArray)
      //! aca tengo que cargar las matrices 
      // siempre que se cambie el slider se hace esto mismo
      let ctx: CanvasRenderingContext2D = canvasRef.current?.getContext('2d')!;
      let intResult: any = []

      let m1 = matrix(imageArray[0].value)
      let m2 = matrix(imageArray[1].value)

      let alpha = 0.8
      m1.resize(size(m2))
      let resultA = multiply(m1, 1 - alpha)
      let resultB = multiply(m2, alpha)
      let result = add(resultA, resultB)

      result.map((value, index) => {
        intResult.push(parseInt(value))
        imageCurrData.data[index] = parseInt(value)
      })

      console.log('filtros Cargados')
      setloading(false);
      ctx?.putImageData(imageCurrData, 0, 0);

    }
  }, [imageArray])

  useEffect(() => {
    console.log('⚒️ se crean filtros')
    Sharp({ target: { value: 50 } })
  }, [imageR])

  const filterHandler = (e: any) => {
    // console.log(e.target.name, e.target.value);
    filtering(e.target.value)
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
  const changeFilter = (filter: number, filterAmount: number, update: any) => {
    console.log('change filter')

    return true
  }
  const filtering = (value: any)=>{
    if (imageArray.length == 2) {
      console.log('✔️ filtering')
      //! aca tengo que cargar las matrices 
      // siempre que se cambie el slider se hace esto mismo
      let ctx: CanvasRenderingContext2D = canvasRef.current?.getContext('2d')!;
      let intResult: any = []

      let m1 = matrix(imageArray[0].value)
      let m2 = matrix(imageArray[1].value)

      let alpha = value/100
      m1.resize(size(m2))
      let resultA = multiply(m1, 1 - alpha)
      let resultB = multiply(m2, alpha)
      let result = add(resultA, resultB)

      result.map((value, index) => {
        imageCurrData.data[index] = parseInt(value)
      })

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
          imageCurrData.data[pos * 4] = Math.round(newRed);
          imageCurrData.data[pos * 4 + 1] = Math.round(newGreen);
          imageCurrData.data[pos * 4 + 2] = Math.round(newBlue);
          imageCurrData.data[pos * 4 + 3] = newAlpha;
          newA[pos * 4] = Math.round(newRed * factor + (1 - factor) * imageR[i][j]);
          newA[pos * 4 + 1] = Math.round(newGreen * factor + (1 - factor) * imageG[i][j]);
          newA[pos * 4 + 2] = Math.round(newBlue * factor + (1 - factor) * imageB[i][j]);
          newA[pos * 4 + 3] = newAlpha;
        })
      })
      // ctx?.putImageData(imageCurrData, 0, 0);
      let aux = imageCurrData.data
      let found = imageArray.find((element: any) => element.key == filteName);
      if (!found) {
        setImageArray([...imageArray, { key: filteName, value: newA }])
        console.log('no encuentro el filtro que se esta poniendo', found)
      }

    }
  }
  //
  const aplyfilter = (e: any) => {
    // si ya esta el filtro lo voy a solucionar con una resta y listo el resto va indicar el valor real del filtro original y a su vez la medida del filtro a aplicar y el filtro la cantidad que se guarde sera el valor del filtro
    let dataImage;
    let query: string = '';
    let ctx: CanvasRenderingContext2D = canvasRef.current?.getContext('2d')!;
    filters.map((filter: any) => {
      query = query + filter.key + '(' + filter.value + '%) '
    })
    console.log(query);
    ctx.filter = query
    if (imageCurr) {
      ctx.drawImage(imageCurr, 0, 0, imageCurr.width, imageCurr.height);
      dataImage = ctx.getImageData(0, 0, imageCurr.width, imageCurr.height);
      setImageArray([...imageArray, dataImage]);
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
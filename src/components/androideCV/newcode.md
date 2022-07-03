# KONDA
 Lo que hay que hacer es poner esta wea y usar los filtros diseñado

 ver tambien el life cicle  

 https://konvajs.org/docs/react/Filters.html

 https://stackoverflow.com/questions/57174144/equivalents-of-konvajs-filter-values#57265613
```jsx
import React, { Component } from 'react';
import Konva from 'konva';
import { createRoot } from 'react-dom/client';
import { Stage, Layer, Rect, Image } from 'react-konva';
import useImage from 'use-image';

const URL = './lion.png';

// example of functional component
const FilterImage = () => {
    const [image] = useImage(URL, 'Anonimus');
    const imageRef = React.useRef();

    // when image is loaded we need to cache the shape
    React.useEffect(() => {
        if (image) {
            // you many need to reapply cache on some props changes like shadow, stroke, etc.
            imageRef.current.cache();
            imageRef.current.filters([Konva.Filters.Contrast])
            imageRef.current.noise(0);
            imageRef.current.contrast(100);
        }
    }, [image]);

    return (
        <Image
            ref={imageRef}
            x={10}
            y={10}
            image={image}

        />
    );
};

// example of good old classes
// try to click on rect to see color updates
class FilterRect extends React.Component {
    state = {
        color: 'green',
    };
    componentDidMount() {
        this.applyCache();
    }
    handleClick = () => {
        this.setState(
            {
                color: Konva.Util.getRandomColor(),
            },
            () => {
                // recache shape when we updated it
                this.applyCache();
            }
        );
    };
    applyCache() {
        this.rect.cache();
    }
    render() {
        return (
            <Rect
                filters={[Konva.Filters.Noise]}
                x={200}
                y={10}
                width={50}
                height={50}
                fill={this.state.color}
                shadowBlur={10}
                ref={(node) => {
                    this.rect = node;
                }}
                onClick={this.handleClick}
            />
        );
    }
}

class App extends Component {
    render() {
        return (
            <Stage width={window.innerWidth} height={window.innerHeight}>
                <Layer>
                    <FilterImage />
                    <FilterRect />
                </Layer>
            </Stage>
        );
    }
}

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
```


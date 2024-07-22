import React, { useEffect, useState } from 'react';
import ComicCanvas from './ComicCanvas';
import { useLocation, useNavigate } from 'react-router-dom';

const useQuery = () => {
    return new URLSearchParams(useLocation().search);
}


const Home = () => {
    const numberOfComics = 2712;
    const generatorModes = [
        { name: "Complete Chaos!", description: "Generates a completely random Calvin and Hobbes comic, any panel from any comic can be placed in any panel of the generated comic." },
        { name: "Random Split", description: "Generates a Calvin and Hobbes comic that is two random comics combined. Preserves panel order." },
        { name: "Random Ordered", description: "Generates a Calvin and Hobbes comic that is multiple random comics, but panel order is preserved." },
        { name: "Normal Comic", description: "Generates a normal Calvin and Hobbes comic!" }
    ]
    const query = useQuery();
    const navigate = useNavigate();
    const [listOfFrames, setListOfFrames] = useState([]);
    const [generatorMode, setGeneratorMode] = useState(0);

    const handleGeneratorSwitch = (event) => {
        setGeneratorMode(event.target.value);
    };


    console.log(query);


    useEffect(() => {
        const returnArray = [];
        if (query.size > 3) {
            for (var i = 0; i < 4; i++) {
                const frameVal = query.get(`frame${i}`);

                const comicNum = frameVal.split(".")[0]
                const frameNum = frameVal.split(".")[1]

                returnArray.push([comicNum, frameNum]);
            }

            setListOfFrames(returnArray);
        }
        else {
            const newURLParams = {};


            if (generatorMode == 0) {
                for (let j = 0; j < 4; j++) {
                    newURLParams[`frame${j}`] = Math.floor(Math.random() * numberOfComics) + "." + (Math.floor(Math.random() * 4) + 1);
                }
            }
            else if (generatorMode == 1) {
                var comicOne = Math.floor(Math.random() * numberOfComics);
                var comicTwo = Math.floor(Math.random() * numberOfComics);
                var splitPoint = Math.floor(Math.random() * 3) + 1;


                for (let j = 0; j < 4; j++) {
                    if (j >= splitPoint)
                        newURLParams[`frame${j}`] = comicTwo + "." + (j + 1);
                    else
                        newURLParams[`frame${j}`] = comicOne + "." + (j + 1);
                }
            }


            const params = new URLSearchParams(newURLParams);
            navigate(`?${params.toString()}`);
        }

    }, [query, navigate])




    return (
        <div className="text-center font-permanent-marker">
            <h1 className="text-3xl font-bold">Home Page</h1>
            <p className="mt-4">Welcome to the home page!</p>
            <select
                value={generatorMode}
                onChange={handleGeneratorSwitch}
                className="p-2 border rounded mb-4"
            >
                {generatorModes.map((val, generatorIndex) => {
                    return (<option value={generatorIndex}>{val.name}</option>)
                })}
            </select>
            <ComicCanvas
                listOfFrames={listOfFrames}
            ></ComicCanvas>
        </div>
    );
}

export default Home;
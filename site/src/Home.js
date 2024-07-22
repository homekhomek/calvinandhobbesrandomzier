import React, { useEffect, useState } from 'react';
import ComicCanvas from './ComicCanvas';
import { useNavigate, useSearchParams } from 'react-router-dom';

const Home = () => {
    const numberOfComics = 2697;
    const [searchParams, setSearchParams] = useSearchParams();
    const generatorModes = [
        { name: "Random Split", description: "Generates a Calvin and Hobbes comic that is two random comics combined. Preserves panel order." },
        { name: "Complete Chaos!", description: "Generates a completely random Calvin and Hobbes comic, any panel from any comic can be placed in any panel of the generated comic." },
        { name: "Random Ordered", description: "Generates a Calvin and Hobbes comic that is multiple random comics, but panel order is preserved." },
        { name: "Normal Comic", description: "Generates a normal Calvin and Hobbes comic!" }
    ]
    const navigate = useNavigate();
    const [listOfFrames, setListOfFrames] = useState([]);
    const [generatorMode, setGeneratorMode] = useState(searchParams.get("gen") || 0);
    const [showHelp, setShowHelp] = useState(false);

    const handleGeneratorSwitch = (event) => {
        setGeneratorMode(event.target.value);
    };

    const toggleHelp = () => {
        setShowHelp(!showHelp)
    }

    useEffect(() => {
        generate();
    }, [generatorMode])

    const generate = () => {
        let newListOfImages = [];

        console.log(generatorMode);

        if (generatorMode == 1) {
            for (let j = 0; j < 4; j++) {
                newListOfImages.push([Math.floor(Math.random() * numberOfComics), (Math.floor(Math.random() * 4) + 1)]);
            }
        }
        else if (generatorMode == 0) {
            var comicOne = Math.floor(Math.random() * numberOfComics);
            var comicTwo = Math.floor(Math.random() * numberOfComics);
            var splitPoint = Math.floor(Math.random() * 3) + 1;


            for (let j = 0; j < 4; j++) {
                newListOfImages.push([j >= splitPoint ? comicTwo : comicOne, (j + 1)]);
            }
        }
        else if (generatorMode == 2) {
            for (let j = 0; j < 4; j++) {
                newListOfImages.push([Math.floor(Math.random() * numberOfComics), (j + 1)]);
            }
        }
        else if (generatorMode == 3) {
            var comic = Math.floor(Math.random() * numberOfComics);
            for (let j = 0; j < 4; j++) {
                newListOfImages.push([comic, (j + 1)]);
            }
        }

        console.log(newListOfImages);

        setListOfFrames(newListOfImages);
    }


    useEffect(() => {
        const newURLParams = {
            gen: generatorMode
        };

        if (!listOfFrames || listOfFrames.length == 0 || !listOfFrames[0])
            return;

        for (let j = 0; j < 4; j++) {
            if (!listOfFrames[j])
                continue;
            newURLParams[`frame${j}`] = listOfFrames[j][0] + "." + listOfFrames[j][1];
        }

        setSearchParams(newURLParams);
    }, [listOfFrames, generatorMode]);


    useEffect(() => {
        const returnArray = [];
        if (searchParams.size > 3) {
            for (var i = 0; i < 4; i++) {
                const frameVal = searchParams.get(`frame${i}`);

                const comicNum = frameVal.split(".")[0]
                const frameNum = frameVal.split(".")[1]

                returnArray.push([comicNum, frameNum]);
            }

            setListOfFrames(returnArray);
        }
        else if (!listOfFrames || listOfFrames.length == 0)
            generate();


    }, [])




    return (
        <div className="text-center font-permanent-marker">
            <div>
                <img src="logo.png" className='inline-block w-[150px]'></img>
            </div>
            <h1 className="text-3xl mt-3">RANDOMIZER</h1>
            <hr className='my-4'></hr>
            <div>
                <p>select mode: </p>
                <select
                    value={generatorMode}
                    onChange={handleGeneratorSwitch}
                    className="border-0 rounded bg-slate-100 p-2 inline-block mt-3"
                >
                    {generatorModes.map((val, generatorIndex) => {
                        return (<option key={generatorIndex} value={generatorIndex}>{val.name}</option>)
                    })}
                </select>
                <p className='mt-3'><span onClick={toggleHelp} className='text-red-500 underline text-sm'>(what does this mode do?)</span>  </p>

                {showHelp && (
                    <p className='text-slate-400 mx-auto text-sm'>{generatorModes[generatorMode].description}</p>
                )}
            </div>
            <div>
                <button className='border-2 border-black bg-[#f8745a] hover:bg-[#ffb0a0] inline-block p-2 my-4' onClick={generate}>generate new comic!</button>
            </div>
            <div className='overflow-y-hidden overflow-x-auto'>
                <ComicCanvas
                    listOfFrames={listOfFrames}
                ></ComicCanvas>
            </div>

            <div>
                <p className='text-sm mt-8 text-slate-400'>share this link to share your comic</p>
            </div>

            <hr className='my-10'></hr>
            <div className='mt-10'>comic by <a className='text-red-500 underline' href="https://www.simonandschuster.com/authors/Bill-Watterson/19962368">bill watterson</a></div>
            <div className='mt-2'>randomizer by <a className='text-red-500 underline' href="http://homek.org">homek</a></div>
        </div>
    );
}

export default Home;
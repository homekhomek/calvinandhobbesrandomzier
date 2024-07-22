import React, { useEffect, useRef, useState } from 'react';

const ComicCanvas = ({ listOfFrames }) => {
    const canvasRef = useRef(null);
    const [loading, setLoading] = useState(true);



    useEffect(() => {
        setLoading(true);
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');


        if (!listOfFrames)
            return;
        const images = listOfFrames.map((frame) => {
            return `individualFrames/${frame[0]}Frame${frame[1]}.gif`;
        });

        const loadImages = (srcArray, callback) => {
            let imagesToLoad = srcArray.length;
            const imageElements = [];

            const onImageLoad = () => {
                imagesToLoad--;
                if (imagesToLoad === 0) {
                    callback(imageElements);
                }
            };

            srcArray.forEach(src => {
                const img = new Image();
                img.src = src;
                img.onload = onImageLoad;
                imageElements.push(img);
            });
        };

        loadImages(images, (loadedImages) => {
            loadedImages.forEach((img, index) => {
                context.drawImage(img, index * 150, 0, 150, 200);
            });

            setLoading(false);
        });
    }, [listOfFrames]);

    if (!listOfFrames)
        return;

    return <div className='text-center items-center'>
        <canvas className={`${loading ? "hidden" : ""} mx-auto w-100`} ref={canvasRef} width={600} height={200} />
        <div className={`${!loading ? "hidden" : ""} h-[200px]`}>generating comic...</div>
    </div>;
};

export default ComicCanvas;
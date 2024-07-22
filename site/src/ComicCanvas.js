import React, { useEffect, useRef } from 'react';

const ComicCanvas = ({ listOfFrames }) => {
    const canvasRef = useRef(null);


    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        console.log(listOfFrames)

        if (!listOfFrames)
            return;
        const images = listOfFrames.map((frame) => {
            return `individualFrames/${frame[0]}Frame${frame[1]}.gif`;
        });

        console.log(images);

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
        });
    }, [listOfFrames]);

    if (!listOfFrames)
        return;

    return <canvas ref={canvasRef} width={600} height={200} />;
};

export default ComicCanvas;
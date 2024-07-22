
// BIg Frame: 580x414, 600x420
// Big Frame Comics: 3:2
// Small Frame: 600x190, 600x193
// Small Frame Comics: 3:1
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const sourceDir = path.join(__dirname, 'comicImages/rawComics');
const fourFrameDir = path.join(__dirname, 'comicImages/fourFrameComics');

// Function to check if the file is an image
function isImageFile(file) {
    const ext = path.extname(file).toLowerCase();
    return ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff', '.webp'].includes(ext);
}

// Function to move image files based on their dimensions
async function moveImages() {
    fs.readdir(sourceDir, async (err, files) => {
        if (err) {
            console.error('Error reading the directory', err);
            return;
        }

        for (const file of files) {
            const filePath = path.join(sourceDir, file);

            if (isImageFile(file)) {
                try {
                    const metadata = await sharp(filePath).metadata();

                    const width = metadata.width;
                    const height = metadata.height;
                    const ratio = width / height;

                    if (ratio > 2) {
                        const destinationPath = path.join(fourFrameDir, file);
                        fs.rename(filePath, destinationPath, (err) => {
                            if (err) {
                                console.error(`Error moving file ${file}`, err);
                            } else {
                                console.log(`Moved file ${file} to ${fourFrameDir}`);
                            }
                        });
                    }
                } catch (error) {
                    console.error(`Error processing file ${file}`, error);
                }
            }
        }
    });
}

const splitOutput = path.join(__dirname, 'comicImages/individualFrames');

// Function to split images into four equal parts
async function splitImages() {
    fs.readdir(fourFrameDir, async (err, files) => {
        if (err) {
            console.error('Error reading the directory', err);
            return;
        }

        var fileNum = 0;

        for (const file of files) {
            const filePath = path.join(fourFrameDir, file);

            if (isImageFile(file)) {
                try {
                    for (let i = 0; i < 4; i++) {
                        const image = sharp(filePath);
                        const metadata = await image.metadata();

                        const width = metadata.width;
                        const height = metadata.height;
                        const frameWidth = Math.floor(width / 4);
                        const framePath = path.join(splitOutput, `${fileNum}Frame${i + 1}${path.extname(file)}`);


                        await image
                            .extract({ left: i * frameWidth, top: 0, width: frameWidth, height: height })
                            .toFile(framePath);
                        console.log(`Saved ${framePath}`);


                    }

                    fileNum += 1;
                } catch (error) {
                    console.error(`Error processing file ${file}`, error);
                }
            }
        }
    });
}


splitImages();
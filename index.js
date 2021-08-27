const express = require("express");
const Canvas = require("canvas");
const axios = require("axios");
const fs = require("fs");

const app = express();
const port = 3000

app.get("/", (req, res) => {
    res.send("Online!");
});

app.get("/image", async (req, res) => {
    const { url, size } = req.query;

    const sampleSize = 100
    const s = sampleSize * size

    const canvas = Canvas.createCanvas(s, s);
    const ctx = canvas.getContext("2d");

    const response = await axios.get(url, { responseType: "arraybuffer" });
    await fs.promises.writeFile("./image.png", response.data);

    const image = await Canvas.loadImage("./image.png");
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    const pixelArray = ctx.getImageData(0, 0, s, s).data;

    const rgbArray = [];
    for(y = 0; y < s; y += sampleSize){
        for(let x = 0; x < s; x += sampleSize){
            let p = (x + y * s) * 4;
            rgbArray.push([ pixelArray[p], pixelArray[p + 1], pixelArray[p + 2] ]);

            if(rgbArray.length === size * size) res.send(rgbArray);
        }
    }
});

app.listen(port, () => {});
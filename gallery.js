let provider;

async function loadGallery() {
  provider = new ethers.providers.JsonRpcProvider("https://goerli.base.org/");
  let contractReadOnly = new ethers.Contract(contractAddress, contractABI, provider);
  
  const totalSupply = await contractReadOnly.totalSupply();
  const gallery = document.getElementById('gallery');

  for (let i = 0; i < totalSupply.toNumber(); i++) {
    const [dragonCurve, backgroundColor, baseColor] = await contractReadOnly.getArt(i);
    const canvas = await drawDragonCurveSmall(dragonCurve, 100);
    gallery.appendChild(canvas);
  }
}

function drawDragonCurveSmall(dragonCurve, size) {
  let x = 0,
    y = 0,
    direction = 0,
    directions = [
      [0, 1],
      [1, 0],
      [0, -1],
      [-1, 0]
    ];
  let minX = Infinity,
    maxX = -Infinity,
    minY = Infinity,
    maxY = -Infinity;

  for (let i = 0; i < dragonCurve.length; i++) {
    if (dragonCurve[i]) {
      direction = (direction + 1) % directions.length;
    } else {
      direction = (direction - 1 + directions.length) % directions.length;
    }
    x += directions[direction][0];
    y += directions[direction][1];
    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);
  }

  let width = maxX - minX + 1,
    height = maxY - minY + 1,
    scale = Math.min(size / width, size / height);

  x = -minX * scale + (size - width * scale) / 2;
  y = -minY * scale + (size - height * scale) / 2;
  direction = 0;

  let canvas = document.getElementById('canvas')
  canvas.width = size;
  canvas.height = size;

  let ctx = canvas.getContext("2d");

  // Set the background color to black
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, size, size);

  // Set the stroke color to a green tone
  ctx.strokeStyle = "rgb(0,128,0)";

  ctx.beginPath();
  ctx.moveTo(x, y);

  for (let i = 0; i < dragonCurve.length; i++) {
    if (dragonCurve[i]) {
      direction = (direction + 1) % directions.length;
    } else {
      direction = (direction - 1 + directions.length) % directions.length;
    }
    x += directions[direction][0] * scale;
    y += directions[direction][1] * scale;

    // Change the stroke color to a different green tone
    ctx.strokeStyle = `rgb(0, ${Math.floor(128 + Math.random() * 128)},0)`;

    ctx.lineTo(x, y);

    // Stroke the current segment
    ctx.stroke();

    // Begin a new path for the next segment
    ctx.beginPath();
    ctx.moveTo(x,y);
  }
}

window.addEventListener("load", async function() {
  await loadGallery();
});

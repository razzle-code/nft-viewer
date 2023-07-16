let provider;
const contractAddress = '0x0b6A4748FA815d8a7299Ec897919153CA579c4eB'; // replace with your contract's address
const contractABI = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"approved","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"approve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bool[]","name":"dragonCurve","type":"bool[]"},{"internalType":"uint256","name":"backgroundColor","type":"uint256"},{"internalType":"uint256","name":"baseColor","type":"uint256"}],"name":"createArt","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getAllArt","outputs":[{"components":[{"internalType":"bool[]","name":"dragonCurve","type":"bool[]"},{"internalType":"uint256","name":"backgroundColor","type":"uint256"},{"internalType":"uint256","name":"baseColor","type":"uint256"}],"internalType":"struct ArtNFT.Art[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getArt","outputs":[{"internalType":"bool[]","name":"","type":"bool[]"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"}] // replace with your contract's ABI


async function loadGallery() {
  provider = new ethers.providers.JsonRpcProvider("https://goerli.base.org/");
  let contractReadOnly = new ethers.Contract(contractAddress, contractABI, provider);
  
  const totalSupply = await contractReadOnly.totalSupply();
  const gallery = document.getElementById('gallery');
  
  const artList = await contract.getAllArt();
  
  artList.forEach(artData => {
	const canvas = drawDragonCurveSmall(artData.dragonCurve, 100);
    gallery.appendChild(canvas);
  });
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

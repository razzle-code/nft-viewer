const provider = new ethers.providers.Web3Provider(window.ethereum);
const contractAddress = '0x0C3A310991C6402a41bd61df1905f52D14b27e5e'; // replace with your contract's address
const contractABI = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[],"name":"canvasSize","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"createArt","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"uint256","name":"x","type":"uint256"},{"internalType":"uint256","name":"y","type":"uint256"}],"name":"getPixel","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"}]; // replace with your contract's ABI

const contract = new ethers.Contract(contractAddress, contractABI, provider);

async function viewArt() {
    const tokenId = document.getElementById('tokenId').value;
    const canvas = document.getElementById('canvas');

    // Clear the canvas
    while (canvas.firstChild) {
        canvas.firstChild.remove();
    }

    // Get the pixel data from the contract and display it on the canvas
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            const color = await contract.getPixel(tokenId, i, j);
            const pixel = document.createElement('div');
            pixel.className = 'pixel';
            pixel.style.backgroundColor = '#' + color.toString(16).padStart(6, '0');
            canvas.appendChild(pixel);
        }
        canvas.appendChild(document.createElement('br'));
    }
}

window.ethereum.enable();

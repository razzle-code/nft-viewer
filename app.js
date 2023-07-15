const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
const contractAddress = '0x0C3A310991C6402a41bd61df1905f52D14b27e5e';
const contractABI = [
    {
        "constant": true,
        "inputs": [],
        "name": "canvasSize",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [],
        "name": "createArt",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "x",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "y",
                "type": "uint256"
            }
        ],
        "name": "getPixel",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "ownerOf",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }
];


const contract = new ethers.Contract(contractAddress, contractABI, signer);

async function mintArt() {
    const tx = await contract.createArt();
    await tx.wait();

    alert('Art minted!');
}

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

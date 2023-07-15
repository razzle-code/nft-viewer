const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
const contractAddress = '0xYourContractAddress'; // replace with your contract's address
const contractABI = [...]; // replace with your contract's ABI

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

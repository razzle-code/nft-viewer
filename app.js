const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
const contractAddress = '0x6066e42a33e0535bdfe709E5Ba43ccA1300B12AE'; // replace with your contract's address
const contractABI = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"approved","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"approve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bool[]","name":"dragonCurve","type":"bool[]"},{"internalType":"uint256","name":"backgroundColor","type":"uint256"},{"internalType":"uint256","name":"baseColor","type":"uint256"}],"name":"createArt","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getArt","outputs":[{"internalType":"bool[]","name":"","type":"bool[]"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"}] // replace with your contract's ABI

const contract = new ethers.Contract(contractAddress, contractABI, signer);

async function mintArt() {
    try {
        // Get the number of iterations from the input field
        const iterations = document.getElementById('iterations').value;

        // Generate a Dragon Curve sequence
        const dragonCurve = generateDragonCurve(iterations);

        // Generate colors for demonstration
        const backgroundColor = Math.floor(Math.random() * 0xFFFFFF);
        const baseColor = Math.floor(Math.random() * 0xFFFFFF);

        const tx = await contract.createArt(dragonCurve, backgroundColor, baseColor);
        const receipt = await tx.wait();

        // Get the tokenId from the Transfer event
        const transferEvent = receipt.events.find(e => e.event === 'Transfer');
        const tokenId = transferEvent.args.tokenId.toString();

        // Display the newly minted NFT
        viewArt(tokenId);

        alert('Art minted!');
    } catch (error) {
        console.error(error);
        alert('An error occurred while trying to mint the art.');
    }
}

async function viewArt(tokenId) {
    try {
        // Get the art data from the contract
        const [dragonCurveBool, backgroundColor, baseColor] = await contract.getArt(tokenId);

        // Draw the Dragon Curve
        drawDragonCurve(dragonCurveBool, Math.min(window.innerWidth, window.innerHeight));

    } catch (error) {
        console.error(error);
        if (error.data && error.data.message) {
            alert('Error: ' + error.data.message);
        } else {
            alert('An error occurred while trying to view the art.');
        }
    }
}

function drawDragonCurve(dragonCurveData, size) {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    // Center the drawing
    let x = canvas.width / 2;
    let y = canvas.height / 2;

    // Start by moving right
    let direction = 0; // 0: right, 1: up, 2: left, 3: down

    // Set the line width and color
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#FF0000'; // Red color

    ctx.beginPath();
    ctx.moveTo(x, y);

    // Calculate the length of each step
    let step = size / Math.pow(2, dragonCurveData.length / 2);

    for (let i = 0; i < dragonCurveData.length; i++) {
        // Turn right or left
        if (dragonCurveData[i]) {
            direction = (direction + 1) % 4;
        } else {
            direction = (direction + 3) % 4;
        }

        // Move in the current direction
        switch (direction) {
            case 0:
                x += step;
                break;
            case 1:
                y -= step;
                break;
            case 2:
                x -= step;
                break;
            case 3:
                y += step;
                break;
        }

        ctx.lineTo(x, y);
    }

    ctx.stroke();
}


document.getElementById('mintButton').addEventListener('click', mintArt);
document.getElementById('viewButton').addEventListener('click', () => {
    const tokenId = document.getElementById('tokenId').value;
    viewArt(tokenId);
});

window.ethereum.enable();

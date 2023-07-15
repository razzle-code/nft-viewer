const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
const contractAddress = '0x6066e42a33e0535bdfe709E5Ba43ccA1300B12AE'; // replace with your contract's address
const contractABI = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"approved","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"approve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bool[]","name":"dragonCurve","type":"bool[]"},{"internalType":"uint256","name":"backgroundColor","type":"uint256"},{"internalType":"uint256","name":"baseColor","type":"uint256"}],"name":"createArt","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getArt","outputs":[{"internalType":"bool[]","name":"","type":"bool[]"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"}] // replace with your contract's ABI

const contract = new ethers.Contract(contractAddress, contractABI, signer);

// This function generates a dragon curve sequence
function dragonCurve(iterations) {
    let dragonCurve = "R";
    while (iterations > 1) {
        let dragonCurveReversed = [...dragonCurve].reverse().join('');
        dragonCurveReversed = dragonCurveReversed.replace(/R/g, "L").replace(/-/g, "R").replace(/L/g, "-");
        dragonCurve += "R" + dragonCurveReversed;
        iterations--;
    }
    return dragonCurve;
}

// This is just a placeholder for your actual dragon curve drawing function
function drawDragonCurve(iterations, size) {
    // You would put your code for drawing a dragon curve on a canvas here.
    // This could involve using the canvas API to draw lines based on the dragon curve sequence
    // and the provided iterations and size parameters.
    console.log(`Drawing a dragon curve with ${iterations} iterations and size ${size}`);
}

async function mintArt() {
    try {
        const iterations = document.getElementById('iterations').value;
        const dragonCurveString = dragonCurve(iterations);
        const dragonCurveArray = Array.from(dragonCurveString).map(c => c === 'R');
        const backgroundColor = Math.floor(Math.random() * 0xFFFFFF);
        const baseColor = Math.floor(Math.random() * 0xFFFFFF);

        const tx = await contract.createArt(dragonCurveArray, backgroundColor, baseColor);
        const receipt = await tx.wait();
        const transferEvent = receipt.events.find(e => e.event === 'Transfer');
        const tokenId = transferEvent.args.tokenId.toString();

        viewArt(tokenId);

        alert('Art minted!');
    } catch (error) {
        console.error(error);
        alert('An error occurred while trying to mint the art.');
    }
}

async function viewArt(tokenId) {
    try {
        const [dragonCurveBool, backgroundColor, baseColor] = await contract.getArt(tokenId);
        const dragonCurve = dragonCurveBool.map(b => b ? 'R' : 'L').join('');
        const iterations = Math.floor(Math.log2(dragonCurve.length + 1));

        drawDragonCurve(iterations, Math.min(window.innerWidth, window.innerHeight));

    } catch (error) {
        console.error(error);
        if (error.data && error.data.message) {
            alert('Error: ' + error.data.message);
        } else {
            alert('An error occurred while trying to view the art.');
        }
    }
}

document.getElementById('mintButton').addEventListener('click', mintArt);
document.getElementById('viewButton').addEventListener('click', () => {
    const tokenId = document.getElementById('tokenId').value;
    viewArt(tokenId);
});

window.ethereum.enable();

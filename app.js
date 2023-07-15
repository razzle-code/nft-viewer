const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
const contractAddress = '0x6066e42a33e0535bdfe709E5Ba43ccA1300B12AE'; // replace with your contract's address
const contractABI = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"approved","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"approve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bool[]","name":"dragonCurve","type":"bool[]"},{"internalType":"uint256","name":"backgroundColor","type":"uint256"},{"internalType":"uint256","name":"baseColor","type":"uint256"}],"name":"createArt","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getArt","outputs":[{"internalType":"bool[]","name":"","type":"bool[]"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"}] // replace with your contract's ABI

const contract = new ethers.Contract(contractAddress, contractABI, signer);

async function mintArt() {
    try {
        // Generate a Dragon Curve sequence and colors for demonstration
        // In a real application, you would get these from user input or generate them in a more sophisticated way
        const dragonCurve = Array(2**7 - 1).fill().map(() => Math.random() < 0.5);
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
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');

    // Clear the canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    try {
        // Get the art data from the contract
        const [dragonCurve, backgroundColor, baseColor] = await contract.getArt(tokenId);

        // Set the background color
        context.fillStyle = '#' + backgroundColor.toString(16).padStart(6, '0');
        context.fillRect(0, 0, canvas.width, canvas.height);

        // Draw the Dragon Curve
        context.beginPath();
        context.moveTo(canvas.width / 2, canvas.height / 2);
        let direction = 0;
        for (const turn of dragonCurve) {
            direction += turn ? 1 : -1;
            direction %= 4;
            switch (direction) {
                case 0:
                    context.lineTo(context.moveToX, context.moveToY - 1);
                    break;
                case 1:
                    context.lineTo(context.moveToX + 1, context.moveToY);
                    break;
                case 2:
                    context.lineTo(context.moveToX, context.moveToY + 1);
                    break;
                case 3:
                    context.lineTo(context.moveToX - 1, context.moveToY);
                    break;
            }
        }
        context.strokeStyle = '#' + baseColor.toString(16).padStart(6, '0');
        context.stroke();
    } catch (error) {
        console.error(error);
        if (error.data && error.data.message) {
            alert('Error: ' + error.data.message);
        } else {
            alert('An error occurred while trying to view the art.');
        }
    }
}

window.ethereum.enable();

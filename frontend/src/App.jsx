import "./App.css";
import { useState } from "react";
import { ethers } from "ethers";
import ICO from "../../artifacts/contracts/NTDuongCrowdSale.sol/NTDuongCrowdsale.json";

const icoAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
function App() {
  // Properties

  const [walletAddress, setWalletAddress] = useState("");

  // Helper Functions

  // Requests access to the user's META MASK WALLET
  // https://metamask.io
  async function requestAccount() {
    console.log("Requesting account...");

    // ❌ Check if Meta Mask Extension exists
    if (window.ethereum) {
      console.log("detected");

      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setWalletAddress(accounts[0]);
      } catch (error) {
        console.log("Error connecting...");
      }
    } else {
      alert("Meta Mask not detected");
    }
  }

  // Create a provider to interact with a smart contract
  async function connectWallet() {
    if (typeof window.ethereum !== "undefined") {
      await requestAccount();

      const provider = new ethers.providers.Web3Provider(window.ethereum);
    }
  }

  async function isOpen() {
    // If MetaMask exists
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(icoAddress, ICO.abi, provider);
      try {
        // Call Greeter.greet() and display current greeting in `console`
        /* 
          function greet() public view returns (string memory) {
            return greeting;
          }
        */
        const data = await contract.isOpen();
        console.log("data: ", data);
      } catch (error) {
        console.log("Error: ", error);
      }
    }
  }

  return (
    <div className="mt-3">
      <div className="flex float-right">
        <button
          className="bg-[#36ABFF] text-white hover:bg-sky-600 font-semibold rounded-lg px-5 py-2 mr-3"
          onClick={requestAccount}
        >
          Request Account
        </button>
        <h3 className="mr-3">Wallet Address: {walletAddress}</h3>
        <button onClick={isOpen}>test</button>
      </div>
    </div>
  );
}

export default App;

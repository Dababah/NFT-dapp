import React, { useState } from "react";
import { ethers } from "ethers";

function App() {
  const [account, setAccount] = useState("");
  const [tokenId, setTokenId] = useState("");
  const [message, setMessage] = useState("");
  const [isMinting, setIsMinting] = useState(false);
  const [isBurning, setIsBurning] = useState(false);

  // 🔧 GANTI DENGAN ALAMAT KONTRAK KAMU SETELAH DEPLOY
  const CONTRACT_ADDRESS = "0xE20F4E0781E60AdC40414046adA582e352c23093";
  const ABI = [
    "function mintNFT(address to, string memory tokenURI) returns (uint256)",
    "function burn(uint256 tokenId)",
    "function ownerOf(uint256) view returns (address)",
  ];

  const connect = async () => {
    if (!window.ethereum) return setMessage("MetaMask tidak terdeteksi!");
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const addr = await signer.getAddress();
      setAccount(addr);
      setMessage("");
    } catch (err) {
      setMessage("Koneksi ditolak.");
    }
  };

  const mint = async () => {
    if (!account) return;
    setIsMinting(true);
    setMessage("");
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
      const tx = await contract.mintNFT(
        account,
        "ipfs://bafkreidtwyrztgtcqshwvswsbj6ztwc7r6cxkruqltjyz2te7i7yv5bhza"
      );
      await tx.wait();
      setMessage("✅ NFT berhasil dimint!");
    } catch (err) {
      setMessage(`❌ Gagal mint: ${err.reason || err.message}`);
    } finally {
      setIsMinting(false);
    }
  };

  const burn = async () => {
    if (!account || !tokenId) return setMessage("Masukkan Token ID!");
    setIsBurning(true);
    setMessage("");
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
      const tx = await contract.burn(tokenId);
      await tx.wait();
      setMessage("🔥 NFT berhasil dibakar!");
      setTokenId("");
    } catch (err) {
      setMessage(`❌ Gagal burn: ${err.reason || err.message}`);
    } finally {
      setIsBurning(false);
    }
  };

  return (
    <div className="min-h-screen bg-darker text-gray-100 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md bg-dark rounded-2xl shadow-2xl p-6 border border-gray-800">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
            🖼️ NFT Praktikum
          </h1>
          <p className="text-gray-400 mt-2">
            Mint & Burn NFT di jaringan Sepolia
          </p>
        </div>

        {!account ? (
          <button
            onClick={connect}
            className="w-full py-3 px-4 bg-primary hover:bg-purple-600 rounded-xl font-semibold transition-all duration-200 transform hover:scale-[1.02] shadow-lg shadow-purple-900/30">
            🔌 Hubungkan Wallet
          </button>
        ) : (
          <div className="space-y-5">
            <div className="bg-gray-800/50 rounded-xl p-4 text-center border border-gray-700">
              <p className="text-sm text-gray-400">Wallet Terhubung</p>
              <p className="font-mono text-sm truncate">{account}</p>
            </div>

            <button
              onClick={mint}
              disabled={isMinting}
              className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-[1.02] shadow-lg ${
                isMinting
                  ? "bg-gray-700 cursor-not-allowed"
                  : "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/30"
              }`}>
              {isMinting ? "⏳ Sedang Mint..." : "✨ Mint NFT Baru"}
            </button>

            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Token ID"
                value={tokenId}
                onChange={(e) => setTokenId(e.target.value)}
                className="flex-1 py-3 px-4 bg-gray-800/70 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                onClick={burn}
                disabled={isBurning || !tokenId}
                className={`px-5 rounded-xl font-semibold transition-all duration-200 transform hover:scale-[1.02] shadow-lg ${
                  isBurning || !tokenId
                    ? "bg-gray-700 cursor-not-allowed"
                    : "bg-rose-600 hover:bg-rose-500 shadow-rose-900/30"
                }`}>
                {isBurning ? "⏳" : "🔥"}
              </button>
            </div>
          </div>
        )}

        {message && (
          <div
            className={`mt-6 p-3 rounded-xl text-center font-medium ${
              message.includes("✅") || message.includes("🔥")
                ? "bg-emerald-900/30 text-emerald-300"
                : "bg-rose-900/30 text-rose-300"
            }`}>
            {message}
          </div>
        )}

        <div className="mt-8 text-center text-xs text-gray-500">
          DApp Blockchain • Sepolia Testnet
        </div>
      </div>
    </div>
  );
}

export default App;

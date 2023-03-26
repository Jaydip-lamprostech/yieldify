import React, { createContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/Home and Navbar/navbar";
import Home from "./components/Home and Navbar/home";
import Profile from "./components/Signup and Profile/profile";
import SignUp from "./components/Signup and Profile/signup";
import Subscription from "./components/All Subscription/allsubscription";
// import { WagmiConfig, createClient, configureChains, Chain } from "wagmi";
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { goerli } from "wagmi/chains";
// import { scrollTestnet, polygon } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
// import { scrollTestnet } from "@wagmi/core/chains";
// import { alchemyProvider } from "wagmi/providers/alchemy";
// import { publicProvider } from "wagmi/providers/public";
import { InjectedConnector } from "wagmi/connectors/injected";
import { getDefaultProvider } from "ethers";
import "./App.css";

const App = () => {
  const scrollalpha = {
    id: 534353,
    name: "Scroll Alpha Testnet",
    network: "Scroll Alpha Testnet",
    iconUrl: "https://testscan.bt.io/static/media/BTT.e13a6c4e.svg",
    iconBackground: "#fff",
    nativeCurrency: {
      decimals: 18,
      name: "Scroll Alpha Testnet",
      symbol: "ETH",
    },
    rpcUrls: {
      default: "https://alpha-rpc.scroll.io/l2",
    },
    blockExplorers: {
      default: {
        name: "Scroll Alpha Testnet",
        url: "https://blockscout.scroll.io/",
      },
    },
    testnet: true,
  };
  const { chains, provider } = configureChains(
    [goerli],
    [
      alchemyProvider({ apiKey: "O5NYvtwLMNG0LjAXPQEk0YJT2l3UxTAY" }),
      publicProvider(),
    ]
  );

  const { connectors } = getDefaultWallets({
    appName: "My RainbowKit App",
    chains,
  });

  const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider,
  });
  return (
    <div>
      <>
        <WagmiConfig client={wagmiClient}>
          <RainbowKitProvider chains={chains}>
            <Router>
              <NavBar />
              <div className="pages">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/signup" element={<SignUp />} />
                  <Route path="/subscription" element={<Subscription />} />
                </Routes>
              </div>
            </Router>
          </RainbowKitProvider>
        </WagmiConfig>
      </>
      {/* <Footer /> */}
    </div>
  );
};

export default App;

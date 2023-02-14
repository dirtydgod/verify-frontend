import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import "@rainbow-me/rainbowkit/styles.css";
import {
    getDefaultWallets,
    RainbowKitProvider,
    midnightTheme,
} from "@rainbow-me/rainbowkit";
import { Chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { RecoilRoot } from "recoil";

window.Buffer = window.Buffer || require("buffer").Buffer;

const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
);

const cantoChain: Chain = {
    id: 7700,
    name: "Canto",
    network: "canto",
    nativeCurrency: {
        decimals: 18,
        name: "Canto",
        symbol: "CANTO",
    },
    rpcUrls: {
        default: {
            http: [
                "https://canto.gravitychain.io",
                "https://canto.slingshot.finance",
            ],
        },
    },
    blockExplorers: {
        default: {
            name: "Canto Explorer",
            url: "https://tuber.build",
        },
    },
    testnet: false,
};

const { chains, provider } = configureChains([cantoChain], [publicProvider()]);

const { connectors } = getDefaultWallets({
    appName: "FrenlyFaces",
    chains,
});

const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider,
});

root.render(
    <RecoilRoot>
        <WagmiConfig client={wagmiClient}>
            <RainbowKitProvider
                chains={chains}
                theme={midnightTheme({
                    accentColor: "#000",
                    fontStack: "system",
                })}
            >
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </RainbowKitProvider>
        </WagmiConfig>
    </RecoilRoot>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { darkThemePreferred } from "./constants/styling";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { Verify } from "./pages/Verify";
import { useRecoilState } from "recoil";
import { themeState } from "./state/theme";
function App() {
    const [theme] = useLocalStorage(
        "theme",
        darkThemePreferred ? "dark" : "light"
    );
    const [recoilTheme, setRecoilTheme] = useRecoilState(themeState);

    useEffect(() => {
        if (theme === "dark") {
            document.documentElement.classList.add("dark");
            const themeColorMeta = document.createElement("meta");
            themeColorMeta.setAttribute("name", "theme-color");
            themeColorMeta.setAttribute("content", "#000");
            document.head.appendChild(themeColorMeta);
            setRecoilTheme("dark");
        } else {
            document.documentElement.classList.remove("dark");
            const themeColorMeta = document.createElement("meta");
            themeColorMeta.setAttribute("name", "theme-color");
            themeColorMeta.setAttribute("content", "#FFF");
            document.head.appendChild(themeColorMeta);
            setRecoilTheme("light");
        }
    }, [theme]);

    return (
        <Routes>
            <Route path="/" element={<Verify />} />
        </Routes>
    );
}

export default App;

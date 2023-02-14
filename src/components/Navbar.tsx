import { useState } from "react";
import { Sun, Moon } from "react-feather";
import { darkThemePreferred } from "../constants/styling";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useRecoilState } from "recoil";
import { themeState } from "../state/theme";

export function Navbar(props: { RightElement: JSX.Element }) {
    const [theme, setTheme] = useLocalStorage(
        "theme",
        darkThemePreferred ? "dark" : "light"
    );

    const [, setRecoilTheme] = useRecoilState(themeState);

    return (
        <div>
            <nav className="">
                <div className="mx-auto px-4">
                    <div className="flex justify-between">
                        <div className="flex" />
                        <div className="flex space-x-6">
                            {theme === "dark" && (
                                <button
                                    onClick={() => {
                                        setTheme("light");
                                        document.documentElement.classList.remove(
                                            "dark"
                                        );
                                        const themeColorMeta =
                                            document.createElement("meta");
                                        themeColorMeta.setAttribute(
                                            "name",
                                            "theme-color"
                                        );
                                        themeColorMeta.setAttribute(
                                            "content",
                                            "#FFF"
                                        );
                                        document.head.appendChild(
                                            themeColorMeta
                                        );
                                        setRecoilTheme("light");
                                    }}
                                    className="px-auto mt-4"
                                >
                                    <Sun color="white" />
                                </button>
                            )}
                            {theme === "light" && (
                                <button
                                    onClick={() => {
                                        setTheme("dark");
                                        document.documentElement.classList.add(
                                            "dark"
                                        );
                                        const themeColorMeta =
                                            document.createElement("meta");
                                        themeColorMeta.setAttribute(
                                            "name",
                                            "theme-color"
                                        );
                                        themeColorMeta.setAttribute(
                                            "content",
                                            "#000"
                                        );
                                        document.head.appendChild(
                                            themeColorMeta
                                        );
                                        setRecoilTheme("dark");
                                    }}
                                    className="px-auto mt-4"
                                >
                                    <Moon color="black" />
                                </button>
                            )}
                            <div className="mt-4">{props.RightElement}</div>
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    );
}

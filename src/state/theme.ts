import { atom } from "recoil";
import { darkThemePreferred } from "../constants/styling";

export const themeState = atom({
    key: "theme",
    default: darkThemePreferred ? "dark" : "light",
});

import { atom } from "recoil";

export const publishModalStateAtom = atom({
    key: "publishModalState",
    default: { visible: false, url: "" }
});

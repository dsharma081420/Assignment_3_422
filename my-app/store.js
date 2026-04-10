import { atom } from "jotai";

// No default value (removed from A2) - undefined = "not yet loaded from API"
// Prevents Favourites page from flashing "Nothing Here" before data arrives
export const favouritesAtom = atom();

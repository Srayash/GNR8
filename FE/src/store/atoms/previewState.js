import {atom} from 'recoil';

export const previewStateAtom = atom({
    key: 'previewStateAtom',
    default : {
        isPreviewing: false,
    }
})
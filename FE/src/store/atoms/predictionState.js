import {atom} from 'recoil';

export const predictionStateAtom = atom({
    key: 'predictionStateAtom',
    default : {
        prediction : ""
    }
})
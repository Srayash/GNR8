import {atom} from 'recoil';

export const predictionLoadingStateAtom = atom({
    key: 'predictionLoadingStateAtom',
    default : {
        generating : false
    }
})
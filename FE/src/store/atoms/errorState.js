import {atom} from 'recoil';

export const errorStateAtom = atom({
    key: 'errorStateAtom',
    default : {
        visible : false,
        text : "",
    }
})
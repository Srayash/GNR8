import {atom} from 'recoil';

export const userStateAtom = atom({
    key: 'userStateAtom',
    default : {
        name : null,
        token : null,
    }
})
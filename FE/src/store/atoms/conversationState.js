import {atom} from 'recoil';

export const conversationStateAtom = atom({
    key: 'conversationStateAtom',
    default : {
      messages: []
    }
})
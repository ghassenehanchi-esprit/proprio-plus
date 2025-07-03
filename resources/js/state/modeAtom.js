import { atom } from 'recoil';

const getInitialMode = () => {
  if (typeof localStorage !== 'undefined') {
    return localStorage.getItem('mode') || 'buyer';
  }
  return 'buyer';
};

const modeAtom = atom({
  key: 'mode',
  default: getInitialMode(),
  effects_UNSTABLE: [
    ({ onSet }) => {
      onSet(newMode => {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('mode', newMode);
        }
      });
    }
  ]
});

export default modeAtom;

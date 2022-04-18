import { atom } from 'recoil';
import { TodoModel } from '../model/todoModel';

const todoListAtom = atom<Array<TodoModel>>({
  key: 'todoListAtom',
  default: []
});

export { todoListAtom };

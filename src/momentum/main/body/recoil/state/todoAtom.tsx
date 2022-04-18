import { atom } from 'recoil';
import { TodoModel } from '../model/todoModel';

const todoListAtom = atom<Array<TodoModel>>({
  key: 'todoListAtom',
  default: []
});

const todoChange = atom<TodoModel>({
  key: 'todoChangeAtom',
  default: {} as TodoModel
});
export { todoListAtom, todoChange};

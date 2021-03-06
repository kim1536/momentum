import axios, { AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { TodoModel } from '../recoil/model/todoModel';
import { todoListAtom } from '../recoil/state/todoAtom';
import './todoList.scss';

const TodoList = () => {
  const url = 'http://localhost:4000/todo';
  const [todoContents, setTodoContents] = useRecoilState<Array<TodoModel>>(todoListAtom);
  const [todoContent, setTodoContent] = useState<TodoModel>({ id: '', content: '', checked: false });
  const [selectedIdx, setSelectedIdx] = useState<number>(-1);

  // 화면에 todoList 출력
  useEffect(() => {
    getTodoCtnts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 1 rest api에 todoList 요청.
  const getTodoCtnts = async (): Promise<void> => {
    const res: AxiosResponse<any, any> = await axios.get(`${url}`, {});
    setTodoContents(res.data);
  };

  //  2 rest api에 todo 추가 혹은 수정 요청.
  const handleTodoForm = async (e: any): Promise<void> => {
    e.preventDefault();
    if (selectedIdx === -1) {
      // rest api에 todo 추가 요청.
      await axios.post(`${url}`, todoContent);
      await getTodoCtnts();
      clearInput();
    } else {
      // rest api에 todo 수정 요청.
      await axios.put(`${url}/${todoContent.id}`, todoContent);
      await getTodoCtnts();
      setSelectedIdx(-1);
      clearInput();
    };
  };

  // 3 조회 rest api에 todo 삭제 요청.
  const todoDelete = async (id: string): Promise<void> => {
    await axios.delete(`${url}/${id}`, {});
    setTodoContents(todoContents.filter((todo => todo.id !== id)));
    setSelectedIdx(-1);
  };

  // CheckBox 상태 감지
  const onToggle = (id: any, index: number) => {
    const x = todoContents.map((item) => {
      if (item.id === id) {
        return { ...item, checked: !item.checked };
      }
      else {
        return item;
      }
    });
    setTodoContents(x);
  };

  // 컨텐츠 내용 변경
  const handleTodoInput = (e: any): void => {
    let copyTodoContent: TodoModel = Object.assign({}, todoContent);
    copyTodoContent.content = e.target.value;
    setTodoContent(copyTodoContent);
  };

  // 수정하기와 취소하는 이밴트 
  const todoEdit = (e: any, todoModel: TodoModel, index: number) => {
    e.nativeEvent.stopImmediatePropagation()
    if (selectedIdx === -1) {
      clearInput();
      setTodoContent(() => {
        return {
          id: todoContents[index].id,
          content: todoContents[index].content,
          checked: todoContents[index].checked
        };
      });
      setSelectedIdx(index);
    } else {
      clearInput();
      setSelectedIdx(-1);
    };
  };

  // 초기화
  const clearInput = () => {
    setTodoContent({ id: '', content: '', checked: false });
  };

  return (
    <>
      {/* TODO 작성 */}
      <div>
        <h1>Things To Do</h1>
        <form onSubmit={handleTodoForm}>
          <input
            type='text'
            value={todoContent.content}
            onChange={handleTodoInput}
            placeholder='할 일 작성'
          />
          <button type='submit'>{selectedIdx === -1 ? '추가' : '수정'}</button>
        </form>
        {/* TODO List */}
        <div>
          <table className='tableContainer'>
            <tbody>
              {todoContents?.map((todo, idx) => {
                return (
                  <tr key={todo.id}>
                    <>
                      {
                        console.log(todo.checked)
                      }
                    </>
                    <td width='150'>
                      <input
                        type='checkbox'
                        className={todo.checked ? 'check' : 'uncheck'}
                        checked={todo.checked}
                        onChange={(e) => {
                          e.nativeEvent.stopImmediatePropagation()
                          onToggle(todo.id, idx)
                        }}
                      />
                      <span>{todo.content}</span>
                    </td>
                    <td>
                      <button onClick={(e) => todoEdit(e, todo, idx)}>{selectedIdx === -1 ? '수정하기' : '취소'}</button>
                    </td>
                    <td>
                      <button onClick={() => todoDelete(todo.id)}>X</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export { TodoList }
import axios, { AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { TodoModel } from '../recoil/model/todoModel';
import { todoListAtom } from '../recoil/state/todoAtom';

const TodoList = () => {
  const url = 'http://localhost:4000/todo';
  const [todoContents, setTodoContents] = useRecoilState<Array<TodoModel>>(todoListAtom);
  const [todoContent, setTodoContent] = useState<TodoModel>({id: '', content: '', checked: false});
  const [isChecked, setIsCheckeds] = useState<Array<boolean>>([]);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  // InputBox 추가인 경우와 편집일 경우
  useEffect(() => {
    // 수정일때
    if (selectedIdx !== null) {
      setTodoContent(() => {
        return {
          id: todoContents[selectedIdx].id,
          content: todoContents[selectedIdx].content,
          checked: todoContents[selectedIdx].checked
        };
      });
    } else {
      // 추가일때
      clearInput();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[selectedIdx, todoContents]);
  
  // 화면에 todoList 출력
  useEffect(() => {
    getTodoCtnts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // 화면에 todoList 출력

  // 1 rest api에 todoList 요청.
  const getTodoCtnts = async (): Promise<void> => {
    const res: AxiosResponse<any, any> = await axios.get(`${url}`, {});
    setTodoContents(res.data);
    setIsCheckeds(new Array(res.data.length).fill(false));
  };
  
  //  2 rest api에 todo 추가 혹은 수정 요청.
  const handleTodoForm = async (e: any): Promise<void> => {
    e.preventDefault();
    if (selectedIdx === null) {
      // rest api에 todo 추가 요청.
      await axios.post(`${url}`, todoContent);
      await getTodoCtnts();
      clearInput();
    } else {
      // rest api에 todo 수정 요청.
      await axios.put(`${url}/${todoContent.id}`, todoContent);
      await getTodoCtnts();
      setSelectedIdx(null);
      clearInput();
    };
  };

  const clearInput = () => {
    setTodoContent({id: '', content: '', checked: false});
  };

  // 3 조회 rest api에 todo 삭제 요청.
  const todoDelete = async (id: string): Promise<void> => {
    await axios.delete(`${url}/${id}`, {});
    setTodoContents((todoContents.filter((todo => todo.id !== id))));
    setSelectedIdx(null);
  };

  const onToggle = (id: any, index: number) => {
    setIsCheckeds((arr) => {
      const xx = arr.map((check, idx) => {
        if (idx === index) {
          check = !check;
        }
        return check
      })
      return [...xx]
    });
  };

  // 컨텐츠 내용 변경
  const handleTodoInput = (e: any): void  => {
    let copyTodoContent: TodoModel = Object.assign({}, todoContent);
    copyTodoContent.content = e.target.value;
    setTodoContent(copyTodoContent);
  };
  
  const todoEdit = (e: any, todoModel: TodoModel, index: number) => {
      e.preventDefault();
      e.stopPropagation();
      if (selectedIdx === null) {
        setSelectedIdx(index);
      } else {
        clearInput();
        setSelectedIdx(null);
      };
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
          <button type='submit'>{selectedIdx === null ? '추가' : '수정'}</button>
        </form>
        {/* TODO List */}
        <div>
          <table>
            <tbody>
              {todoContents && todoContents?.map((todo, idx) => {
                return (
                  <tr key={todo.id}  onClick={(e) => {
                    console.log(selectedIdx);
                    e.stopPropagation(); 
                    e.preventDefault();
                    setSelectedIdx(idx);
                    }}>
                    <td width='150'>
                      {
                        isChecked.length > 0 && (
                          <input
                            type='checkbox'
                            className={isChecked[idx] ? 'check' : 'uncheck'}
                            checked={isChecked[idx]}
                            onChange={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              onToggle(todo.id, idx)
                            }}
                           />
                        )
                      }
                      <span>{todo.content}</span>
                    </td>
                    <td>
                      <button onClick={(e) => todoEdit(e, todo, idx)}>{selectedIdx === null ? '수정하기' : '취소' }</button>
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

export {TodoList}
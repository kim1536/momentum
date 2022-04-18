import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { TodoModel } from "../recoil/model/todoModel";
import { todoListAtom } from "../recoil/state/todoAtom";

const TodoList = () => {
  const url = 'http://localhost:4000/todo';
  const [todoContents, setTodoContents] = useRecoilState<Array<TodoModel>>(todoListAtom);
  const [isChecked, setIsChecked] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(0);

  // 
  useEffect(() => {
    getTodoCtnts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 1 rest api에 todoList 요청.
  const getTodoCtnts = async (): Promise<void> => {
    const res: AxiosResponse<any, any> = await axios.get(`${url}`, {});
    setTodoContents(res.data);
  };
  
  //  2 rest api에 todo 추가 요청.
  const handleTodoForm = async (e: any): Promise<void> => {
    e.preventDefault();
    await axios.post(`${url}`, todoContents[selectedIdx]).then((req) => {
      setTodoContents(req.data);
    });

    await getTodoCtnts();
  };

  // 3 조회 rest api에 todo 삭제 요청.
  const todoDelete = async (id: string): Promise<void> => {
    await axios.delete(`${url}/${id}`, {});
    setTodoContents((todoContents.filter((todo => todo.id !== id))));
  }

  const onToggle = (id: string) => {
    setIsChecked(!isChecked);
  };

  // content추가 todoCnt에 값 추가
  const handleTodoInput = (e: any): void  => {
    setTodoContents((todoContents) => {
      const arr = todoContents.map((todoContent, idx) => {
        if (selectedIdx === idx) {
          todoContent.content = e.target.value
        }
        return todoContent
      })
      return [...arr]
    });
  };
  
  return (
    <>
      <div>
        <h1>Things To Do</h1>
        <form onSubmit={handleTodoForm}>
          <input
            type="text"
            value={todoContents[selectedIdx].content}
            onChange={handleTodoInput}
            placeholder="할 일 작성"
          />
          <button type="submit">추가</button>
        </form>

        <div>
          <table>
            <tbody>
              {todoContents?.map((todo, idx) => {
                return (
                  <tr key={todo.id} onClick={() => {
                    setSelectedIdx(idx);
                  }}>
                    <td width="150">
                      <input
                        type="checkbox"
                        className={isChecked ? 'check' : 'uncheck'}
                        checked={isChecked}
                        onClick={() => onToggle(todo.id)}
                       />
                      <span>{todo.content}</span>
                    </td>
                    <td>
                      {/* <button onClick={() => todoEdit()}>수정하기</button> */}
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
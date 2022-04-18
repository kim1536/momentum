import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { TodoModel } from "../recoil/model/todoModel";
import { todoListAtom } from "../recoil/state/todoAtom";

const TodoList = () => {
  const url = 'http://localhost:4000/todo';
  const [todoCnts, setTodoCnts] = useRecoilState<Array<TodoModel>>(todoListAtom);
  const [todoCnt, setTodoCnt] = useState({
    content: ""
  });

  useEffect(() => {
    getTodoConts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 조회 rest api에 todoList 요청.
  const getTodoConts = async (): Promise<void> => {
    const res: AxiosResponse<any, any> = await axios.get(`${url}`, {});
    setTodoCnts(res.data);
  };

  // 조회 rest api에 todo 삭제 요청.
  const todoDelete = async (id: number): Promise<void> => {
    await axios.delete(`${url}/${id}`, {});
    setTodoCnts((items: any) => items.filter((x: { id: any }) => x.id !== id));
  }

  const handleTodoInput = (e: any): void  => {
    setTodoCnt({ content: e.target.value });
  };
  
  // 조회 rest api에 todo 추가 요청.
  const handleTodoForm = async (e: any): Promise<void> => {
    e.preventDefault();
    await axios.post(`${url}`, todoCnt).then((req) => {
      setTodoCnt(req.data);
    });

    setTodoCnt({
      content: ""
    });

    await getTodoConts();
  };


  return (
    <>
      <div>
        <h1>Things To Do</h1>
        <form onSubmit={handleTodoForm}>
          <input
            type="text"
            value={todoCnt.content}
            onChange={handleTodoInput}
            placeholder="할 일 작성"
          />
          <button type="submit">추가</button>
        </form>
        <div>
          <table>
            <tbody>
              {todoCnts && todoCnts.map((todo) => {
                return (
                  <tr key={todo.id}>
                    <td>
                      <input type="checkbox" />
                    </td>
                    <td width="100">
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
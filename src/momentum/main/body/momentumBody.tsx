import { Clock } from "./Container/clock";
import { TodoList } from "./Container/todoList";

const MomentumBody = () => {
  return (
      <>
        <div className="momentum-body">
          <div className="container-body">
            <Clock />
            <TodoList />
          </div>
        </div>
      </>
  );
};

export { MomentumBody };
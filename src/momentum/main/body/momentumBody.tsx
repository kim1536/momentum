import { Clock } from "./Container/clock";

const MomentumBody = () => {
  console.log('body!!!');
  return (
      <>
        <div className="momentum-body">
          <div className="container-body">
            <Clock />
          </div>
        </div>
      </>
  );
};

export { MomentumBody };
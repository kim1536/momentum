import { MomentumBody } from "./main/body/momentumBody";
import { MomentumFooter } from "./main/footer/momentumFooter";
import { MomentumHeader } from "./main/header/momentumHeader";
import './momentum.scss';

const Momentum = () => {
  return (
      <>
        <div className="momentum-container">
          <MomentumHeader />
          <MomentumBody />
          <MomentumFooter />
        </div>
      </>
  );
};

export { Momentum };
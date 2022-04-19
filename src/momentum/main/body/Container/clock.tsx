import { useEffect, useState } from 'react';

const Clock =  () => {
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');
  const [seconds, setSeconds] = useState('');

  useEffect(() => {
    setInterval(getClock,1000);
  }, []);

  const getClock = () => {
    const date = new Date();
    setHours(String(date.getHours()).padStart(2, '0'));
    setMinutes(String(date.getMinutes()).padStart(2, '0'));
    setSeconds(String(date.getSeconds()).padStart(2, '0'));
  };
  
  return (
    <>
      <div className='container-body'>
        <span style={{fontSize:'50px'}}>
          {hours}:{minutes}:{seconds}
        </span>
      </div>
    </>
  );
};

export { Clock };

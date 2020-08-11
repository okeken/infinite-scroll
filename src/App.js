import React, { useRef, useState, useEffect } from 'react';
import Skeleton from 'react-loading-skeleton';
import useCustomFetching from './customFetching';

import './index.css';

function App() {
  const [limit, setLimit] = useState(10);

  const url =
    limit <= 100 &&
    `https://jsonplaceholder.typicode.com/posts?&_limit=${limit}`;
  const { status, data, error } = useCustomFetching(url);

  let options = {
    root: null,
    rootMargin: '10px',
    threshold: 0.6,
  };
  const observer = useRef(
    new IntersectionObserver((entries) => {
      const firstpage = entries[0];

      if (firstpage.isIntersecting && limit <= 100) {
        setLimit((limit) => limit + 5);
      }
    }, options)
  );
  const [element, setElement] = useState(null);

  useEffect(() => {
    const currentElement = element;
    const currentObserver = observer.current;
    if (currentElement) {
      currentObserver.observe(currentElement);
    }
    return () => {
      if (currentElement) {
        currentObserver.unobserve(currentElement);
      }
    };
  }, [element]);

  return (
    <>
      <div className='post-container'>
        {data.map((item) => {
          return (
            <div className='post-body' key={item.id}>
              <h4>{item.title}</h4>
              <p>{item.body}</p>
            </div>
          );
        })}

        <div ref={setElement}>
          {status === 'loading' && !error && (
            <>
              <div className='loading-div'>
                <Skeleton width={50} />
                <Skeleton count={3} />
              </div>
              <div className='loading-div'>
                <Skeleton width={50} />
                <Skeleton count={3} />
              </div>
              <div className='loading-div'>
                <Skeleton width={50} />
                <Skeleton count={3} />
              </div>
              <div className='loading-div'>
                <Skeleton width={50} />
                <Skeleton count={3} />
              </div>
              <div className='loading-div'>
                <Skeleton width={50} />
                <Skeleton count={3} />
              </div>
            </>
          )}
        </div>
        <div>
          {limit >= 100 && (
            <p className='all-post-noti'>You're all caught up! </p>
          )}
        </div>

        <div className='error-div'>
          {error && limit <= 100 && 'Something went wrong! '}
        </div>
      </div>
    </>
  );
}

export default App;

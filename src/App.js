import React, { useRef, useState, useEffect } from 'react';
import Skeleton from 'react-loading-skeleton';
import useCustomFetching from './customFetching';

import './index.css';

function App() {
  const [page, setPage] = useState(1);

  const url =
    page <= 10 &&
    `https://jsonplaceholder.typicode.com/posts?&_limit=10&_page=${page}`;
  const { status, data, error } = useCustomFetching(url);

  let options = {
    rootMargin: '0px',
    threshold: 1,
  };
  const observer = useRef(
    new IntersectionObserver((entries) => {
      const firstpage = entries[0];

      if (firstpage.isIntersecting && page <= 10) {
        setPage((page) => page + 1);
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
            <div className='post-body'>
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
          {page >= 10 && (
            <p className='all-post-noti'>Hurray, You're all caught up! 🎉🎉 </p>
          )}
        </div>

        <div className='error-div'>
          {error && page <= 10 && 'Something went wrong! 😕'}
        </div>
      </div>
    </>
  );
}

export default App;

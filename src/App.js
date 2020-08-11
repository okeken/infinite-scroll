import React, { useCallback, useRef, useState, useEffect } from 'react';
import Skeleton from 'react-loading-skeleton';
import useCustomFetching from './customFetching';

import './index.css';

function App() {
  const [page, setPage] = useState(1);

  const url = `https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=10`;
  const { status, data, error } = useCustomFetching(url);

  let options = {
    root: null,
    rootMargin: '100px',
    threshold: 0.3,
  };
  const observer = useRef(
    new IntersectionObserver((entries) => {
      const firstpage = entries[0];

      if (firstpage.isIntersecting) {
        //if data.length ===10 return;
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
      {console.log('page number', page)}
      <div className='post-container'>
        {data.map((item, index) => {
          return (
            <div className='post-body' key={item.id}>
              <h4>{item.title}</h4>
              <p>{item.body || <Skeleton count={10} />}</p>
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

        <div className='error-div'>{error && 'Something went wrong! '}</div>
      </div>
    </>
  );
}

export default App;

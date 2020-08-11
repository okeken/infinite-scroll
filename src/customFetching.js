import { useEffect, useRef, useState, useCallback } from 'react';
import Axios from 'axios';

let useCustomFetching = (url) => {
  const cache = useRef({});
  const [data, setData] = useState([]);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);

  const initialLoad = useCallback(() => {
    const fetchpost = async () => {
      setStatus('loading');
      if (cache.current[url]) {
        const response = cache.current[url];
        setError(false);
        setStatus('loaded');
      } else {
        try {
          const response = await Axios(url);
          cache.current[url] = response;
          setData((d) => [...data, ...response.data]);
          console.log(data.length);
          setError(false);
          setStatus('loaded');
        } catch (e) {
          setError(true);
          return e;
        }
      }
      setStatus('loaded');
    };

    fetchpost();
  }, [url]);

  useEffect(() => {
   // if (data.length === 10) return;
    let cancelRequest = false;
    initialLoad();
    return function cleanup() {
      cancelRequest = true;
    };
  }, [initialLoad]);

  return {
    status,
    data,
    error,
  };
};

export default useCustomFetching;

// import { useEffect, useRef, useReducer } from 'react';
// import Axios from 'axios';

// let useCustomFetching = (url) => {
//   const cache = useRef({});
//   const initialState = {
//     status: 'idle',
//     error: null,
//     data: [],
//   };

//   const [state, dispatch] = useReducer((state, action) => {
//     switch (action.type) {
//       case 'Fe   tching':
//         return { ...initialState, status: 'loading' };

//       case 'Fetched':
//         return { ...initialState, status: 'loaded', data: action.payload };
//       case 'Fetch_Error':
//         return { ...initialState, status: 'error', error: action.payload };

//       default:
//         return;
//     }
//   }, initialState);

//   useEffect(() => {
//     let cancelRequest = false;
//     const fetchpost = async () => {
//       dispatch({ type: 'Fetching' });

//       if (cache.current[url]) {
//         const response = cache.current[url];
//         dispatch({ type: 'Fetched', payload: response.data });
//       } else {
//         try {
//           const response = await Axios(url);
//           cache.current[url] = response;
//           if (cancelRequest) return;
//           dispatch({ type: 'Fetched', payload: response.data });
//         } catch (e) {
//           console.log(e);

//           dispatch({ type: 'Fetch_Error' });
//         }
//       }
//     };

//     fetchpost();
//     return function cleanup() {
//       cancelRequest = true;
//     };
//   }, [url]);

//   return state;

//   // { status, data, isError };
// };

// export default useCustomFetching;

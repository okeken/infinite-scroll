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
          setError(false);
        } catch (e) {
          setError(true);
          return e;
        }
      }
      setStatus('loaded');
    };

    fetchpost();
  }, [url, data]);

  useEffect(() => {
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

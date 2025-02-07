import { useRef, useCallback } from 'react';

export default (listRef) => {

  const heights = useRef({});

  const setHeight = useCallback((index, ref) => {

  	const height = ref.current?.getBoundingClientRect().height

    heights.current = { ...heights.current, [index]: height };
    
    listRef.current?.resetAfterIndex(index);
 
  }, []);


  const getHeight = useCallback((index, defaultHeight) => {

    return heights.current[index] || defaultHeight;

  }, []);

  return { setHeight, getHeight, heights };

};


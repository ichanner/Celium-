import { useState, useRef, useCallback } from 'react';

export default (initialValue) => {

  const [state, setState] = useState(initialValue);

  const ref = useRef(state);

  const setStateWithRef = useCallback((value) => {
 
    ref.current = value;
 
    setState(value);
 
  }, []);


  return [state, setStateWithRef, ref];
};
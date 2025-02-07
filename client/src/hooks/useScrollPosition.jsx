import { useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { debounce } from 'lodash'

export default () => {

  const location = useLocation();
  const listRef = useRef(null);

  const debouncedSaveScrollPosition = debounce((scrollOffset) => {
          
    sessionStorage.setItem(`${location.pathname}-scrollPosition`, scrollOffset)
        
  }, 200) 

  const handleScroll = useCallback(({scrollOffset, scrollUpdateWasRequested})=>{

    if(listRef.current && !scrollUpdateWasRequested){

       debouncedSaveScrollPosition(scrollOffset)
    }

  })

  const loadScrollPosition = () => {

    const savedPosition = sessionStorage.getItem(`${location.pathname}-scrollPosition`);

    if (savedPosition !== null && listRef.current) {

      listRef.current.scrollTo(savedPosition);
    }

  };

  useEffect(() => {

    loadScrollPosition();

    return () => {

      debouncedSaveScrollPosition.cancel()
    }

    
  }, [location.pathname]);

  return {listRef, handleScroll};

}
  /*
  
  const location = useLocation();
  const listRef = useRef(null);

  useEffect(() => {
    
    const saveScrollPosition = () => {
      
      const list = listRef.current;

      if (list) {
        console.log(list)
        
        sessionStorage.setItem(`${location.pathname}-scrollPosition`, list.state.scrollOffset);
      }
    
    };

    const loadScrollPosition = () => {
      
      const savedPosition = sessionStorage.getItem(`${location.pathname}-scrollPosition`);

      if (savedPosition !== null && listRef.current) {
      
        listRef.current.scrollTo(0, parseInt(savedPosition, 10));
      }

    };

    // Restore position when component mounts
    loadScrollPosition();

    // Save position when component unmounts or path changes
    return () => saveScrollPosition();
  
  }, [location.pathname]);

  return listRef;
  */



import React, { useEffect, useState, useCallback, useRef } from 'react';
import { VariableSizeList as List } from 'react-window';
import { selectChatIds, selectNextCursor, selectLoading, fetchChats } from "../chatSlice";
import { useSelector, useDispatch } from 'react-redux';
import { TAB_HEIGHT } from "../chatConstants.js"
import { useParams } from 'react-router-dom';
import Tab from "./ChatTab";
import Loading from "../../../components/Loading"

export default () => {

  const chats = useSelector(selectChatIds);
  const is_loading = useSelector(selectLoading)
  const next_cursor = useSelector(selectNextCursor)
  const params = useParams();
  const dispatch = useDispatch()
  const listRef = useRef(null)

  useEffect(()=>{

    if(chats.length == 0){

      dispatch(fetchChats())
    }

  }, [])

  const handleScroll = () =>{

    if(listRef.current){

        const target = listRef.current._outerRef;

        if(!is_loading && next_cursor != null && (target.scrollHeight - target.scrollTop == target.clientHeight)){

          dispatch(fetchChats(next_cursor))
        }
    }
   
  }

  const Row = ({index, style}) =>{

    if(index == chats.length ){

      return is_loading ? (

          <div style={{...style, display: 'flex', justifyContent: 'center'}}>

            <Loading/> 

          </div> 

      ) : <div/>
      
    }
    else{

      const chat_id = chats[index]
      const is_selected = (params.id == chat_id)
      const previous_chat_id = index > 0 ? chats[index - 1] : ''

      return (

        <Tab 

          key={chat_id}
          is_selected={is_selected} 
          chat_id={chat_id} 
          previous_chat_id={previous_chat_id}
          style={style} 

        />
      )
    }
  }

  return (

    <div>

      { chats.length > 0 ?

        <List

          ref={listRef}
          height={chats.length*TAB_HEIGHT}
          itemCount={chats.length + 1 }
          itemSize={()=>TAB_HEIGHT}  
          onScroll={handleScroll}
        >

          { Row }

        </List> : null

      }

    </div>

  );

};




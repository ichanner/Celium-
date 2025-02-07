import "./styles.css"

import React, { useRef, useState, useEffect, useMemo, useCallback, createContext } from 'react'
import { VariableSizeList as List } from 'react-window'
import { useSelector, useDispatch } from 'react-redux'
import { selectMessageIds } from "../messageSlice"
import { selectReplyingById, selectDraftById } from "../uiSlice"
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { DEFAULT_MESSAGE_HEIGHT } from "../messageConstants"
import { HEIGHT } from "../../../constants/"
import Message from "./Message/Message"
import useWindowSize from "../../../hooks/useWindowSize"
import useScrollPosition from "../../../hooks/useScrollPosition"
import useDynamicHeights from "../../../hooks/useDyanmicHeights"
import SliderModal from "./Message/Attachments/Slider"
import InputBox from "./InputBox/InputBox"

export default ()=>{

  const { listRef, handleScroll } = useScrollPosition();
  const { setHeight, getHeight, heights } = useDynamicHeights(listRef)
  const { id: chat_id } = useParams();

  const messages = useSelector(selectMessageIds(chat_id))
  const replying = useSelector(selectReplyingById(chat_id))
  const draft = useSelector(selectDraftById(chat_id))

  const scrollToBottom = useCallback(()=>{

    if(listRef.current && heights.current){

      const bottom_pos = Object.values(heights.current).reduce((prev, curr)=> prev += curr);

      listRef.current.scrollTo(bottom_pos)
    }

  })


  const getItemSize = useCallback((index) => {
    
    return getHeight(index, DEFAULT_MESSAGE_HEIGHT);
  
  }, [getHeight]);

  const Row = ({index, style}) =>{

    const message_id = messages[index]
    const is_replying = (replying && message_id == replying.message_id)

    if(index == messages.length){

      return <div/>

    }
    else{

      return (
   
          <Message 

             key={message_id}
             is_replying={is_replying}
             index={index}
             chat_id={chat_id} 
             message_id={message_id} 
             style={style} 
             setHeight={setHeight}
          />

      )
    }
  }

  useEffect(()=>{

    if(replying && replying.index == messages.length - 1){

      scrollToBottom()
    }

  },[replying])


	return (

      <div className='message-list-container'>

        { messages.length > 0 ? (

    	    <List
            
            ref={listRef}
            width={'100%'}
            onScroll={handleScroll}
            height={HEIGHT}
            itemCount={messages.length + 1}
            itemSize={getItemSize}
          >
           
            { Row }
                
          </List>

        ) : <p className='empty-list-text'> No Messages </p> }


        <SliderModal/>

        { replying ?

          <InputBox {...replying}

            chat_id={chat_id} 
            draft={draft} 
            scrollToBottom={scrollToBottom} 

          /> : null
        }


      </div>


	)
 
}

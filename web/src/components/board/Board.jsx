import "./styles.css"

import React, { useRef, useEffect, useCallback, createContext } from 'react'
import { VariableSizeList as List } from 'react-window'
import Section from "./Section"
import { POST_WIDTH_FACTOR, BOARD_GUTTER_SIZE, SECTION_GUTTER_SIZE } from "../../utils/constants"
import { useDispatch, useSelector } from 'react-redux'
import { newSection } from "../../store/board/posts/actions"
import { selectSectionIndices } from "../../store/board/posts/selectors"
import InputBox from "./InputBox/InputBox"

const HEIGHT = window.screen.height;
const WIDTH = window.screen.width;
const POST_WIDTH = (WIDTH * POST_WIDTH_FACTOR) + BOARD_GUTTER_SIZE

export default ()=>{

  const dispatch = useDispatch()
  const threads = useSelector(selectThreadIds)

  useEffect(()=>{

    dispatch( newSection('bd990c83-5d28-483b-941f-70eb47991209') )

  }, [])


  if(threads.length == 0) return null;

	return (

      <>

  	    <List
              
          height={HEIGHT}
          width={WIDTH}
          itemCount={threads.length}
          itemSize={()=>POST_WIDTH}
          layout="horizontal"
        >

          {Section}
              
       </List>
       
       <InputBox/>
    
      </>
	)
}

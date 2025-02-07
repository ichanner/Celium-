import "./styles.css"

import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from "react-redux"
import { toggleOpen, selectModalType, selectModalProps } from "../../../../../store/modalSlice"
import { mdiArrowLeft, mdiArrowRight } from '@mdi/js'
import { Icon } from "@mdi/react"
import Modal from '../../../../../components/Modal/Modal';
import Attachment from "./Attachment/Attachment"
import classNames from 'classnames';
import { debounce } from 'lodash'

export default () => {

  const dispatch = useDispatch();
  const modal_type = useSelector(selectModalType);
  const modal_props = useSelector(selectModalProps);
  const is_open = (modal_type == 'ATTACHMENT_SLIDER');
  const { attachments, initial_index } = modal_props;
  const [ index, setIndex ] = useState(initial_index);

  useEffect(()=>{

    setIndex(initial_index)

  }, [initial_index, modal_type])


  const onKeyDown = debounce((event) => {

    const { key } = event

    if(key == "ArrowLeft"){

      moveLeft()
    }
    else if(key == "ArrowRight"){

      moveRight()
    }
    else if(key == "Escape"){

      event.preventDefault();

      dispatch(toggleOpen())
    }

  }, 100)

  useEffect(()=>{

      window.addEventListener('keydown', onKeyDown)

      return()=>{
  
        onKeyDown.cancel()

        window.removeEventListener('keydown', onKeyDown)
      }

    
  },[index, attachments, is_open])


  const moveLeft = useCallback((e)=>{

    if(e) e.stopPropagation()

    if(index != 0){

      setIndex(index - 1)
    }
    else{

      setIndex(attachments.length - 1)
    }
  })


  const moveRight = useCallback((e)=>{

    if(e) e.stopPropagation()

    if(index != attachments.length - 1){

      setIndex(index + 1)
    }
    else{

      setIndex(0)
    }
  })



  if(!is_open) return null



  return (

    <div onClick={()=>dispatch(toggleOpen())}>
    
      <Modal className={'slider-modal'} open={is_open} >

        <div className="arrow-container left-arrow">
    
          <Icon onClick={moveLeft} path={mdiArrowLeft} className={classNames('arrow', 'button-icon')} />
    
        </div>
    
        <Attachment expanded_view {...attachments[index]} />
    
        <div className="arrow-container right-arrow">
    
          <Icon onClick={moveRight} path={mdiArrowRight} className={classNames('arrow', 'button-icon')} />
    
        </div>
    
      </Modal>

    </div>
  );
};


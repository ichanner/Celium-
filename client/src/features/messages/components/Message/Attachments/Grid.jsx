import "./styles.css"

import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux'
import { toggleOpen } from "../../../../../store/modalSlice"
import Attachment from "./Attachment/Attachment"
import classNames from 'classnames'

export default ({ attachments }) => {
  
  const dispatch = useDispatch();

  const handleClick = useCallback((index)=>{

    dispatch(toggleOpen({

        type: 'ATTACHMENT_SLIDER',

        props: {

          attachments: [...attachments],
          initial_index: index
        }

    }))

  })


  return (
  
    <div className='grid-container'>

        {

          attachments.map((attachment, index)=>{

            const should_expand = (attachments.length % 2 != 0 && index == attachments.length-1)

            return (

               <div onClick={()=>handleClick(index)} className={classNames({ 'expanded-grid-cell': should_expand })}>

                  <Attachment {...attachment}
                  
                   expanded_view={ attachments.length == 1} 
                   openSlider={ attachments.length > 1 ? ()=>handleClick(index) : undefined }
                  
                  />

               </div>

            )
              
          })

        }

    </div>
     
  );

};
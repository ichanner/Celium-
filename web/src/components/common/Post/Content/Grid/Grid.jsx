import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import Item from './Item'; 
import Attachment from "../../../Attachment/Attachment"
import {toggleFullScreen} from "../../../../../store/board/fullscreen/reducer"

export default ({ attachments }) => {
  
  const dispatch = useDispatch();

  const onPress = useCallback((index)=>{

      dispatch(toggleFullScreen({ index: index, attachments: attachments }));
  })

  return (
   
    <div>
      
      { attachments.length > 1 ? (
       
        <div className='grid-container'>
          
          { attachments.map((item, index) => (

              <Item {...item}
               
                onClick={onPress(index)}
                should_expand={(attachments.length % 2 != 0 && index == attachments.length-1)}
             
              />
          )

        )}
      
        </div>
     
      ) : (
        
          <Attachment {...attachments[0]}
            
            is_fullscreen={false}
            onClick={onPress(0)}

          />
        )

      }
    
    </div>
  );
};

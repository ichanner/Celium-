import "./styles.css"

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { mdiMagnify, mdiPlus, mdiForum } from '@mdi/js';
import { Icon } from "@mdi/react";
import Collapse from '@mui/material/Collapse';
import ChatList from "./ChatList"

export default () => {

  const [ expanded, setExpanded ] = useState(true)

  const SectionIcon = () =>{

    return(

      <Icon 

        onClick={()=>setExpanded(!expanded)} 
        className='section-icon' 
        path={mdiForum} 

      />
    )
  }

  return (

      <div>

        <Collapse  orientation="horizontal" in={expanded} unmountOnExit>
       
          <div className='side-bar'>

            <div className='section-wrapper'>

              <div className='section-header' >

                <div onClick={()=>setExpanded(!expanded)} className='sub-section'>

                  <SectionIcon/>
          
                  <div className='section-title'>{'Chats'}</div>
              
                </div>

              </div>

              <div className='sub-section'>

                <Icon className='section-btn' path={mdiMagnify} />
                
                <Icon className='section-btn' path={mdiPlus} />

              </div>

            </div>

            <ChatList/>

          </div>

        </Collapse>

        { !expanded && <SectionIcon/> }

      </div>

  );

};



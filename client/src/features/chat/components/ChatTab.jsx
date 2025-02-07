import './styles.css'
import React, {useState, useCallback} from 'react'
import { mdiBellOff, mdiDotsHorizontal, mdiAccountPlus, mdiLocationExit } from '@mdi/js'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { Icon } from "@mdi/react"
import { selectChatById } from "../chatSlice"
import { useNavigate, useParams } from 'react-router-dom';
import DropDown from "../../../components/DropDown/DropDown"
import DropDownInput from "../../../utils/DropDownInput"
import classNames from "classnames"


export default ({chat_id, previous_chat_id, style, is_selected})=>{

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [ is_hovering, setIsHovering ] = useState(false);
    const { subject } = useSelector(selectChatById(chat_id));

    const handleClose = useCallback((e)=>{

      e.stopPropagation();

     /*

        dispatch(leave()) => dispatch(removed)
     */

      navigate(previous_chat_id)
    
    }) 

    return (
 
      <div

        style={{...style}}
        onMouseEnter={(e)=>setIsHovering(true)} 
        onMouseLeave={(e)=>setIsHovering(false)} 
        onClick={(e)=>navigate(`/${chat_id}`)}
    
       >

          <div className={classNames('tab', { 'tab-selected': is_hovering || is_selected })}>
       
            <div className='tab-subject'> {subject} </div>

            {
              (is_hovering || is_selected) && (


                  <DropDown

                    onClose={(e)=>setIsHovering(false)}

                    open_icon_class={classNames('menu-open-btn', 'button-icon')}

                    buttons={[

                        DropDownInput('Slience', mdiBellOff),
                        DropDownInput('Invite', mdiAccountPlus),
                        DropDownInput('Leave', mdiLocationExit, true, true)

                    ]}

                  />
              )

             
            }

          </div>

      </div>    
    )

  }
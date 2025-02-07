import React, {useState} from 'react'
import truncateText from "../../../../utils/truncateText"
import transformDate from "../../../../utils/transformDate"
import getDateString from "../../../../utils/getDateString"
import { COLOR_SCHEME } from "../../../../utils/constants"
import { MenuButton, PopupButton } from "../../../../utils/formats"
import { Tooltip, TooltipWrapper } from 'react-tooltip'
import { useDispatch } from 'react-redux'
import { deletePost } from "../../../../store/board/posts/actions"
import { togglePopup } from "../../../../store/app/popup/actions"
import { toggleMenu } from "../../../../store/board/menu/actions"
import { mdiPencil, mdiContentCopy, mdiDelete, mdiDotsVertical } from '@mdi/js'
import config from "../../../../config"
import Avatar from "../../../common/Avatar/Avatar"
import Icon from '@mdi/react'

import "./styles.css"

export default (props) =>{

	const { creation_date, id, username, author_id, edit_date, color } = props;

	const dispatch = useDispatch()

	const menu_buttons = [

	 	 MenuButton('Edit', mdiPencil, ()=>{console.log('edit')}),
		 
		 MenuButton('Delete', mdiDelete, ()=>{

		 	( togglePopup(

		 		{

					label: 'Delete Post',
					prompt: "Do you want to delete this post?",
					component: { name: 'post',  props: { ...props } },

					inputs: [

						PopupButton('Delete Post', false, async()=>{

								await dispatch(deletePost(id))
							}
						),
						
						PopupButton('Cancel',  true)
					]
				}

		 	))

		 }),

		 MenuButton('Copy', mdiContentCopy, ()=>{ console.log('copy') })
	]

	return(

		<div>

			<div className='post-header-container'>

				<div className='post-header-child-container'>
					
					<Avatar user_id={ author_id } />					

					<div className='username' >{ truncateText(username, 15) } />
					
					<div  

						data-tooltip-id="tooltip"
		  				data-tooltip-content={getDateString(creation_date)}
						className='date' 
					>

						{ transformDate(creation_date) }

					</div>

					{ edit_date != null ? (

							<Icon  

								data-tooltip-id="tooltip"
		  						data-tooltip-content={`Last edited ${getDateString(edit_date)}`}
		  						className='edit-icon' 
		  						path={mdiPencil} 
		  						size={0.5} 
		  						color={'white'}
	  						/> 

  						) : null
					}

				</div>

				<div onClick={()=>dispatch(toggleMenu(menu_buttons))}>

					<Icon 

						className='menu-icon' 
						path={mdiDotsVertical} 
						size={0.8} 
						color={'white'}
					/>

				</div>
			
			</div>

			<Tooltip id='tooltip'/>

		</div>
	)
}

import './styles.css'

import React, { useState, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { setReplying } from "../../uiSlice";
import { 
	mdiBookmarkOutline, 
	mdiBookmark, 
	mdiContentCopy, 
	mdiReply, 
	mdiReplyOutline, 
	mdiRepeat, 
	mdiLinkVariant, 
	mdiDotsHorizontal, 
	mdiPencil, 
	mdiDelete, 
	mdiFlag 
} from '@mdi/js'
import Icon from '@mdi/react'
import DropDown from "../../../../components/DropDown/DropDown"
import DropDownInput from "../../../../utils/DropDownInput"
import classNames from "classnames"


export default(({username, chat_id, index, message_id, is_replying, is_local, is_bookmarked})=>{

	const dispatch = useDispatch();

	const drop_down_buttons = !is_local ? [

		DropDownInput('Edit', mdiPencil, true), 
		DropDownInput('Delete', mdiDelete, false, true)

	] : [ DropDownInput('Report', mdiFlag, true, true) ] 

	return (

		<div className='footer-container'>

			<Icon 

				onClick={()=>dispatch(setReplying({chat_id, message_id, index, username}))}
				className={'footer-button'}
				path={is_replying ? mdiReply : mdiReplyOutline} 

			/>

			<Icon 

				className={'footer-button'}
				path={is_bookmarked ? mdiBookmark : mdiBookmarkOutline} 

			/>

			<Icon path={mdiRepeat} className={'footer-button'}/>

			<DropDown 

				open_icon_class='footer-button'

				buttons={[

					DropDownInput('Copy Text', mdiContentCopy),
					DropDownInput('Copy Link', mdiLinkVariant),

					...drop_down_buttons

				]}
			/>


		</div>


	)
	
})
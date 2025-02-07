import "./styles.css"

import React, { useRef, useState, useEffect, useCallback } from 'react'
import useStateWithRef from "../../../../hooks/useStateWithRef"
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment';
import { mdiPlusCircle, mdiClose, mdiSend, mdiDelete } from '@mdi/js'
import Icon from '@mdi/react'
import { useSelector, useDispatch } from 'react-redux'
import { sendMessage } from "../../messageSlice"
import { setReplying, setDraft, removeReplying } from "../../uiSlice"
import classNames from 'classnames'
import AttachmentList from "./AttachmentList"

export default(({ message_id, username, draft, chat_id, scrollToBottom }) => {

	const fileInputRef = useRef(null)
	const inputRef = useRef(null)
	const dispatch = useDispatch()
	const containerRef = useRef(null)

	const [ attachments, setAttachments, attachmentsRef ] = useStateWithRef(draft ? draft.attachments : []);
	const [ body, setBody, bodyRef ] = useStateWithRef(draft ? draft.body : '')


	useEffect(()=>{

		const onKeyDown = (event)=>{

			if(event.key == 'Escape'){

				event.preventDefault();
				
				closeInputBox()
			}
			else if(event.key == 'Return'){

				submitInput()
			}
		}


		window.addEventListener('keydown', onKeyDown)

		return () => {

			dispatch(

				setDraft({

					chat_id: chat_id, 
					body: bodyRef.current, 
					attachments: attachmentsRef.current

				})
			)

			window.removeEventListener('keydown', onKeyDown)
		}

	}, [])


	const submitInput = async() =>{



		await dispatch(sendMessage(chat_id, message_id, body, [...attachments]));
		
		closeInputBox()

		scrollToBottom();
	}

	const closeInputBox = () => {

		dispatch(removeReplying(chat_id))
	}


	const openFileExplorer = () => {

		if(fileInputRef.current){

			fileInputRef.current.click()
		}
	}

	const removeAttachment = (index) => {

		setAttachments([...attachments.slice(0, index), ...attachments.slice(index + 1)])
	}

	const handleFileChange = (event) => {

	    const files = event.target.files;

	    let new_attachments = [];

	    for (let i = 0; i < files.length; i++) {
	      
	      const file = files[i];
	      const url = URL.createObjectURL(file); 

	      new_attachments.push({url: url, file: file, format: file.type, name: file.name})
	      
	    }
	    
	    setAttachments([...attachments, ...new_attachments]);
  	}

  	const initTextField = (inputRef) => {

  		const len = body.length

  		inputRef.focus()
  		inputRef.setSelectionRange(len, len)
  	}

	const AttachmentsIcon = (

		<InputAdornment position="start">
			            
			<Icon 

				className={classNames('input-icon', 'button-icon')} 
				onClick={openFileExplorer} 
				path={mdiPlusCircle}
			/>
	 	
	 	</InputAdornment>
	)

	const SendIcon = (

		<InputAdornment position="start">
			            
			<Icon 
				className={classNames('input-icon', 'button-icon')} 
				onClick={submitInput}
				path={mdiSend}

			/>
	 	
	 	</InputAdornment>
	)

	return (

		<div ref={containerRef} className="input-container">

			<input 

				onChange={handleFileChange} 
				type='file' 
				multiple={true}
				ref={fileInputRef} 
				style={{display: 'none'}}
			/>

		
			
			<div className='replying-container'>

				<div className='replying-text'> Replying to <b> {username} </b> </div>

				<Icon 

					className={classNames('reply-icon', 'button-icon')}  
					onClick={closeInputBox}
					path={mdiClose}

				/>

			</div>
				
			
			<AttachmentList 

				attachments={attachments} 
				removeAttachment={removeAttachment}
			/>

			<TextField 

				className="custom-text-field"
				inputRef={inputRef => inputRef && initTextField(inputRef)}
				multiline={true}
				value={body}
				onChange={({target})=>setBody(target.value)}
				InputProps={{ startAdornment: AttachmentsIcon, endAdornment: SendIcon }}
			/>


		</div>

	)

})

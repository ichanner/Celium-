import "./styles.css"

import React, {useRef, useEffect, useState, useCallback} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {COLOR_SCHEME} from "../../../../utils/constants"
import truncateNumber from "../../../../utils/truncateNumber"
import {togglePopup} from "../../../../store/app/popup/actions"
import {PopupButton} from "../../../../utils/formats"
import Icon from '@mdi/react';
import {mdiLinkVariant } from '@mdi/js'

export default ({ bridges }) =>{

	const dispatch = useDispatch();

	const onPress = useCallback(()=>{
		
		//TODO

	})

	return (

		<div className='stat-container'>

			<Icon 

				path={mdiLinkVariant}
				size={1} 
				color={COLOR_SCHEME.POST_TEXT_PRIMARY} 
			/>

			 <div className='stat-text'> { truncateNumber(bridges) } />

		</div> 

	)

}
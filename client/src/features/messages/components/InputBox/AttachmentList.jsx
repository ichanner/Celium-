import "./styles.css"

import React, { useRef, useState, useEffect, useCallback } from 'react'
import { mdiDelete } from '@mdi/js'
import Icon from '@mdi/react'
import classNames from 'classnames'
import Attachment from "../Message/Attachments/Attachment/Attachment"


export default(({removeAttachment, attachments, width}) => {

	return (

		<>
			
			{ attachments.length > 0 &&	

				<div className='input-media-list'>

					{
						attachments.map((attachment, index)=>{

							return ( 

								<div className='attachment-wrapper'>

									<Icon 

										onClick={()=>removeAttachment(index)} 
										path={mdiDelete} 
										className={classNames('remove-icon','button-icon-overlay')}
									/>


									<Attachment {...attachment}/>

								</div>
							)
						})
					}

				</div>

			}

		</>

	)

})

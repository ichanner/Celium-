import "./styles.css"

import React, { useCallback, useState } from 'react';
import VideoPlayer from "./VideoPlayer"
import Loading from '../../../../../../components/Loading';
import classNames from 'classnames'


export default ({url, format, height, width, expanded_view, openSlider}) =>{

	const is_video = format.startsWith('video/')
	const is_document = !is_video && !format.startsWith('image/')
	const background_image = is_document ? 'file.svg' : 'loading.svg'
	const [ hovering, setHovering ] = useState(false);

	const containerStyle = {

		//height: expanded_view ? height : '16rem',
		//width: expanded_view ? width : 'auto',
		//backgroundImage: `url(https://bsr59766kh.execute-api.us-east-1.amazonaws.com/v1/assets/icons/attachment.svg)`,

		
		aspectRatio: expanded_view ? `${width}/${height}` : 1,
    };

	return(

		<div 

			onMouseEnter={()=>setHovering(true)} 
			onMouseLeave={()=>setHovering(false)} 
			style={{...containerStyle} }
			className='attachment-container'


		>
		     { is_video ? (

		        <VideoPlayer 

		        	url={url} 
		        	hovering={hovering}
		        	autoplay={expanded_view} 
		        	openSlider={openSlider} 
		        />

		      ) : (

		        <img src={url} alt='Unable to Load Image' 
		        	
		        	className={classNames({'expanded-image': expanded_view})}
		        />

		  	 )}

	  	</div>
	)
	
	

}

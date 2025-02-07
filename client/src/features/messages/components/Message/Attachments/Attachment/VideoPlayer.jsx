import "./styles.css"

import React, { useMemo, useEffect, useState, useRef, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { mdiPlay, mdiDownload } from '@mdi/js'
import Icon from '@mdi/react'
import classNames from "classnames"
import generateThumbnail from "../../../../utils/generateThumbnail"
import Hls from "hls.js"

export default({ url, autoplay, hovering, openSlider })=>{

	const [playing, setPlaying] = useState(autoplay);
  const [thumbnail, setThumbnail] = useState(null);

	const videoRef = useRef(null);
	const dispatch = useDispatch();
  const is_local_file = url.startsWith("blob:")

  useEffect(()=>{

    if(!is_local_file){

        setThumbnail(`${url}?format=jpg`)
    }
    else{

        generateThumbnail(url).then((res)=>{

          setThumbnail(res)
        
        })
    }

    const hls = new Hls();

    if(Hls.isSupported() && videoRef.current){

   //   hls.loadSource(`${url}?format=m3u8`);

     // hls.loadSource('https://d3rv02o6tzn21x.cloudfront.net/processed/3/94e38dd5-a77b-4eff-b282-eb13e60df7f4/myvideoHLS_Stream.m3u8')
     
     // hls.attachMedia(videoRef.current);
    } 

  },[url])


  const downloadVideo = useCallback((e)=>{

    e.stopPropagation();

    window.open(`${url}/download`, '_blank')
  })

	const handleClick = useCallback((e)=>{

		e.stopPropagation();

		if(openSlider){

			openSlider()
		}
		else if(videoRef.current){

			setPlaying(true);
		}
	})

	useEffect(()=>{

		if(playing){

			videoRef.current.play()
		}
		else{

			videoRef.current.pause();
		}

	},[playing])

	return (

		<React.Fragment>

      { (hovering && !is_local_file) &&

        <div onClick={downloadVideo} className={classNames("icon-overlay", "download-icon-overlay")}>
        
          <Icon className={classNames('download-icon', 'button-icon')} path={mdiDownload}/>
        
        </div>

      }

      <video preload style={{display: playing ? 'block' : 'none'}} ref={videoRef} controls/>

        

	 		{ !playing &&

	 			<>

	 				<img src={thumbnail} />

		 			<div onClick={handleClick} className={classNames("icon-overlay","play-icon-overlay")}>

		 				<Icon path={mdiPlay} className={classNames('play-icon', 'button-icon')}/>

		 			</div>

		 		</>
		 	}

    </React.Fragment>
	
	)

}




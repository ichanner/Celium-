import React, { useRef, useContext, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { SectionContext } from "../../board/Thread"
import { selectPostById } from "../../../store/board/posts/selectors"
import { HEIGHT } from "../../../utils/constants"
import Post from "./Post"

const DIVIDER_HEIGHT = HEIGHT * 0.04

export default ({index, section_index, post_id}) =>{

	const postRef = useRef(null);
	const post = useSelector(selectPostById(section_index, post_id));

	const { setPostHeight, windowWidth } = useContext(SectionContext)

	useEffect(()=>{

		setPostHeight(index, postRef.current.getBoundingClientRect().height)

	}, [windowWidth])

	return (

		<div className='post-wrapper-container' ref={postRef}>

			<Post {...post} />

			<div style={{backgroundColor: post.color, width: '1%', height: DIVIDER_HEIGHT}}/>

		</div>
	)
}
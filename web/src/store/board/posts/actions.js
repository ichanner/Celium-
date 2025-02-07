import {setUploadProgress} from "../../create/reducer"
import {DIRECTIONS} from "../../../utils/constants"
import { 

	addPosts,
	addSiblings,
	removePost,
	setPostContent,
	setFocusedSibling,
	setAttachmentProcessed,
	setFocusedSectionIndex,
	setReplying,

} from "./reducer";

import getCursor from "../utils/getCursor"
import PostsAPI from "../../../api/posts"


export const newSection = ( initial_post_id ) => async(dispatch, getState)=>{
	
	const new_posts = await PostsAPI.traverse(initial_post_id, DIRECTIONS.AROUND);
	
	dispatch( addSection( { new_posts, initial_post_id } ) );
}

export const getSiblings = ( parent_id, is_expired, leaf_depth, leaf_date, _id ) => async(dispatch, getState)=>{

	const cursor = getCursor([ 
		
		{ is_expired: is_expired }, 
		{ leaf_depth: leaf_depth }, 
		{ leaf_date: leaf_date }, 
		{ _id: _id } 
	
	]);
	const new_siblings = await PostsAPI.fetchSiblings(parent_id, cursor)

	dispatch( addSiblings( { new_siblings, parent_id } ) );
}

export const getPosts = ( parent_id, direction ) => async(dispatch, getState)=>{];

	const new_posts = await PostsAPI.traverse(parent_id, direction)

	dispatch( addPosts( { direction, new_posts, parent_id } ) );
}

export const createPost = () => async(dispatch, getState)=>{

	const { postsSlice, creatorSlice } = getState()
	const { body, attachments } = creatorSlice;
	const { replying } = postsSlice;
	const { post_id } = replying;
	
	const uploadCallback = ({loaded, total})=>{ 

		dispatch(setUploadProgress((loaded/total)*100)) 
	}

	const new_post = await PostsAPI.post(post_id, body, attachments, uploadCallback);
				
	dispatch(addPost({ new_post, post_id }))
}

export const editPost = (post_id)=> async(dispatch, getState) =>{

	const { postsSlice, creatorSlice } = getState();
	const { body: new_body, attachments: new_attachments } = creatorSlice;

	await PostsAPI.edit(post_id, new_body, new_attachments);

	dispatch( setPostContent({post_id, new_body, new_attachments}) );
} 

export const deletePost = (post_id) => async(dispatch, getState)=>{

	await PostsAPI.remove(post_id)

	dispatch(removePost(post_id))
}

export { 	

	setFocusedSibling,
	setAttachmentProcessed,
	setFocusedSectionIndex,
	setReplying
}
import {createSlice} from '@reduxjs/toolkit'
import {DIRECTIONS} from "../../../utils/constants"

const {TOP, DOWN} = DIRECTIONS  

const updateSection = (sections, focused_section_index, new_fields) => {

	const focused_section = sections[focused_section_index];

	return [

		...sections.slice(0, focused_section_index),

		{
			...focused_section, ...new_fields
		},

		...sections.slice(focused_section_index + 1)
	]
}


const updatePost = (sections, focused_section_index, post_id, callback) => {

	const focused_section = sections[focused_section_index];

	const new_fields = {

		posts: focused_section.posts.map((post) => {
        
	        if (post.id === post_id) {

	        	const new_fields = callback(post);
	 	                    
	            return { ...post, new_fields}
	        }
		    
		});
	}

	return updateSection(sections, focused_section_index, new_fields);
}


const postsSlice = createSlice({

	name: 'postsSlice',
	
	initialState: {

		sections:[], 
		focused_section_index: 0,
		focused_post_index: 0,
		loading_state: {},
		replying: {post_id: null, username: null},	
		error: null,

	},
	
	reducers:{

		setFocusedSectionIndex: (state, action)=>{

			state.focused_section_index = action.payload;
		},

		setReplying: (state, action)=>{

			state.replying = action.payload
		},

		addSection: (state, action)=>{

			let initial_post_index = 0; 

			const { sections, focused_section_index } = state;
			const { new_posts, initial_post_id } = action.payload;

			if(initial_post_id != null){

				initial_post_index = new_posts.findIndex(({id})=>id==initial_post_id)
			}
            
			state.sections = [ 

				...sections.slice(0, focused_section_index + 1), 
					
					Section(new_posts), 
				
				...sections.slice(focused_section_index + 1)
			]
			
			state.focused_section_index = focused_section_index + 1;
			state.focused_post_index = initial_post_index;

		},

		//Add Posts (When adding posts to the section and not a parent post because the parent post is not in the section)
		addPosts : (state, action)=>{

			const { new_posts, direction } = action.payload;
		    const { sections, focused_section_index, loading_state } = state;
		    const { posts } = sections[focused_section_index];

		    let updated_posts = [];

		    if(direction == TOP){

		    	updated_posts = [...new_posts, ...posts];
		    }
		    else{

		    	updated_posts = [...posts, ...new_posts];	    	
		    }

		    state.sections = updateSection(sections, focused_section_index, { 

		    		posts: updated_posts
		    	}
		    );

		    state.loading_state = { 

	    		sections: {

	    			...loading_state.sections, [focused_section_index]: null 

	    		}, 

	    		...loading_state 
		    }
		},

		addSiblings : (state, action)=>{

			const { focused_section_index, sections, loading_state } = state;
			const { post_id, new_siblings } = action.payload;

			states.sections = updatePost(sections, focused_section_index, post_id, 

				(post) => {

					return { ...post, siblings: { ...post.siblings, ...new_siblings } }
				}
			)

			state.loading_state = { 

				posts: { 

					...loading_state.posts, [`${post_id}_${focused_section_index}`]: null 
				},

				...loading_state
			}

		},

		setFocusedSibling : (state, action)=>{

			const { sections, focused_section_index } = state;
			const { post_id, new_sibling_index } = action.payload;
		
			states.sections = updatePost(sections, focused_section_index, post_id, 

				(post) => {

					return { ...post, focused_sibling_index: new_sibling_index}
				}
			)
		}, 

		setAttachmentProcessed: (state, action) =>{

			const { attachment_id, post_id } = action.payload;
			const { sections, focused_section_index } = state;
			
			state.sections = updatePost(sections, focused_section_index, post_id, 

				(post)=>({

					attachments: post.attachments.map((attachment)=>{

						if(attachment.id == attachment_id){

							return {...attachment, is_processing: false}
						}

						return attachment
					})
				})
			)

		},
      
		removePost: (state, action) =>{

			const { removed_post_id } = action.payload;
			const { sections, focused_section_index } = state;
			
			state.sections = updatePost(sections, focused_section_index, removed_post_id, 

				(post)=>({

					user_id: null, 
					username: '[Deleted]', 
					body: '[Deleted]',	
					attachments: []
				})
			);
		},

		setPostContent: (state, action) =>{

			const { focused_section_index, sections } = state
			const { new_body, removed_attachments, edited_post_id } = action.payload
		
			state.sections = updatePost(sections, focused_section_index, edited_post_id, 

				(post)=>({

					body: new_body,	
					edit_date: Date.now(),
					attachments: post.attachments.filter(({id})=>!removed_attachments.includes(id))

				})
			);
		}
	}
})

export const { 

	setFocusedSectionIndex,
	setReplying,
	addPosts,
	addSiblings,
	setFocusedSibling,
	setAttachmentProcessed,
	removePost,
	setPostContent
	


} = postsSlice.actions

export default postsSlice.reducer


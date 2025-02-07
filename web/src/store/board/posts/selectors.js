import { createSelector } from '@reduxjs/toolkit';

const sections = (state) => state.postsSlice.sections;
const focused_section_index = (state) => state.postsSlice.focused_section_index;
const focused_post_index = (state) => state.postsSlice.focused_post_index;
const replying_post_id = (state) => state.postsSlice.replying.post_id;
const loading_state = (state) => state.postsSlice.loading_state;
const error = (state) => state.postsSlice.error;

export const selectError = createSelector([error], (error)=>error);

export const selectIsReplying = (post_id) => createSelector([replying_post_id], (id) => post_id === id);

export const selectReplying = createSelector( [replying_post_id], (replying) => replying);

export const selectLoadingState = createSelector( [loading_state], (loading_state) => loading_state);

export const selectSections = createSelector( [sections], (sections) => sections);

export const selectSectionIndices = createSelector( [sections], (sections) => sections.map((_, index) => index));

export const selectFocusedSectionIndex = createSelector( [focused_section_index], (index) => index);

export const selectFocusedPostIndex = createSelector( [focused_post_index], (index) => index);

export const selectPostByIndex = (section_index, post_index) => createSelector([sections], 

  (sections) => sections[section_index]?.posts[post_index]
);

export const selectSectionByIndex = (index) => createSelector([sections], 

  (sections) => sections[index]
);

export const selectFocusedSection = createSelector( [focused_section_index, sections],

  (focused_section_index, sections) => sections[focused_section_index]
);

export const selectPostIds = (section_index) => createSelector([sections], 

  (sections) => sections[section_index].posts?.map(({ id }) => id)
);

export const selectPostById = (section_index, post_id) => createSelector([sections], (sections) => {
   
    const section = sections[section_index];
    
    if (!section){

      return undefined;
    }
    
    const post = section.posts.find((post) => post.id === post_id);
    
    return post;
});


export const selectSectionLoadingState = (section_index) => createSelector( [loading_state],
  
  (loading_state) => {
    
    return loading_state.sections[section_index];
  }

);

export const selectPostLoadingState = (section_index, post_id) => createSelector( [loading_state],
  
  (loading_state) => {
  
    return loading_state.posts[`${post_id}_${section_index}`];
  }

);


export const selectSiblingIds = (section_index, post_id) => createSelector( [selectPostById(section_index, post_id)],

  (post) => {

      return post ? post.siblings.map(sibling => sibling.id) : [];
  }

);

export const selectSiblingById = (section_index, post_id, sibling_id) => createSelector( [selectPostById(section_index, post_id)],
  
  (post) => {
    
    if (!post) {
    
      return undefined;
    }
    
    const sibling = post.siblings.find((sibling) => sibling.id === sibling_id);
   
    return sibling;
  }

);


export const selectFocusedSibling = (section_index, post_id) => createSelector( [selectPostById(section_index, post_id)],
  
  (post) => {
   
    return post ? post.siblings[post.focused_sibling_index] : null;
  }

);

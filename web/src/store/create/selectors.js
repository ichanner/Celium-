import {createSelector} from '@reduxjs/toolkit'

const attachments = (state) => state.creatorSlice.attachments
const body = (state) => state.creatorSlice.body
const upload_progress = (state) => state.creatorSlice.upload_progress

export const selectAttachments = createSelector(attachments, (attachments)=>attachments)
export const selectBody = createSelector(body, (body)=>body)
export const selectUploadProgress = createSelector(upload_progress, (upload_progress)=>upload_progress)


import "./styles.css"

import React, { useCallback } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import classNames from "classnames"
import { toggleOpen } from "../../store/modalSlice"
import { useDispatch } from "react-redux"

export default ({open, children, className}) => {
  
  const dispatch = useDispatch()

  const handleClose = useCallback(()=>{

    dispatch(toggleOpen())

  })


  return (

    <Modal

      open={open}
      onClose={handleClose}
      className={classNames(className, 'modal-container')}
      closeAfterTransition
      BackdropProps={{className: 'modal-overlay'}}
  
    >
 
     <>  {children} </>

    </Modal>
  );
};


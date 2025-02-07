import "./styles.css"
import { Icon } from "@mdi/react";
import { mdiDotsHorizontal } from "@mdi/js"
import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from "./Menu"
import classNames from "classnames"

export default ({buttons, onClose, open_icon_class}) => {

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {

    event.stopPropagation();

    setAnchorEl(event.currentTarget);

  };

  const handleClose = (event) => {

    event.stopPropagation();
    
    if(onClose) onClose();
    
    setAnchorEl(null);
  };

  return (

    <>
    
      <Icon onClick={handleClick} path={mdiDotsHorizontal} className={open_icon_class}/> 

      <Menu open={open} anchorEl={anchorEl} handleClose={handleClose} buttons={buttons}/>

    </>
  );
}



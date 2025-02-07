import "./styles.css"
import { Icon } from "@mdi/react";
import React, { useState } from 'react';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import { styled } from '@mui/material/styles';

//These suck so I'm going to avoid mui as much as possible

const StyledMenu= styled(Menu)(({ theme }) => ({
  '& .MuiPaper-root': {
    backgroundColor: 'var(--gray-900)'
  }
}))

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'row',
  justifyContent: 'space-between',
  padding: ' .4 .7rem',
  '&:hover': {
    backgroundColor: 'var(--gray-800)'
  },
}));

export default ({buttons, handleClose, open, anchorEl}) => {

  return (

    <StyledMenu 

      id="menu-list-grow"
      placement="right"
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }} 
    >

      { 

        buttons.map((button, index) => (

          <React.Fragment key={index}>

           { button.new_section && <div className='divider'/> }

            <StyledMenuItem onClick={(e)=>e.stopPropagation()} sx={button.serious ? {'& > *': {color: 'var(--red-500)'}} : {}} /*onClick={button.callback}*/>

              <div className='item-label'> {button.label} </div>

              { button.icon_path && <Icon path={button.icon_path} className='item-icon'/> }


            </StyledMenuItem>

          </React.Fragment>

        ))
      }

    </StyledMenu>

   
  );
}



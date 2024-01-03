import { Box, Fade, Modal as MUIModal } from '@mui/material';
import React, { ReactElement } from 'react';

const modalStyles = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflowY: 'auto',
  overflowX: 'hidden',
  height: '100vh',
};

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactElement;
}

const Modal: React.FC<ModalProps> = ({ open, onClose, children }) => {
  return (
    <MUIModal
      open={open}
      onClose={onClose}
      closeAfterTransition
      sx={modalStyles}
    >
      <Fade in={open}>{children}</Fade>
    </MUIModal>
  );
};

export default Modal;

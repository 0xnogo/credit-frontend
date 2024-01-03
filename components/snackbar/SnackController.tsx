import React from 'react';
import Snackbar from './SnackbarComponent';
import { useSnackbar } from '../../hooks/useSnackbar';

const SnackController = () => {
  const {
    data: { open, type, message, heading, ExtraComp },
    clearSnackBar,
  } = useSnackbar();

  return open ? (
    <Snackbar
      type={type}
      heading={heading}
      message={message}
      ExtraComp={ExtraComp}
      clearSnackBar={clearSnackBar}
    />
  ) : (
    <></>
  );
};

export default SnackController;

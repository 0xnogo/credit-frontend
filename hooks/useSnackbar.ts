import useSWR from 'swr';

const SNACKBAR_KEY = 'snackbar-state';

const defaultObj = {
  open: false,
  type: undefined,
  message: '',
  heading: '',
  ExtraComp: undefined,
};

type SnackbarState = {
  type?: 'Error' | 'Info' | 'Success';
  message: string;
  heading: string;
  ExtraComp?: any;
};

export function useSnackbar() {
  const { data = defaultObj, mutate } = useSWR<
    SnackbarState & { open: boolean }
  >(SNACKBAR_KEY, null);

  const clearSnackBar = () => {
    mutate(defaultObj);
  };

  const showSnackbar = (barData: SnackbarState) => {
    clearSnackBar();
    setTimeout(() => {
      mutate({ ...barData, open: true });
    });
  };

  return {
    data: data as SnackbarState & { open: boolean },
    clearSnackBar,
    showSnackbar,
  };
}

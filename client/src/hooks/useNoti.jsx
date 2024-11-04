import { useSnackbar } from "notistack";
export const useNoti = () => {
  const { enqueueSnackbar } = useSnackbar();
  const showSnackBar = (message, variant) => {
    enqueueSnackbar(message, {
      variant,
      anchorOrigin: {
        vertical: "bottom",
        horizontal: "right",
      },
    });
  };
  return showSnackBar;
};

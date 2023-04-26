import Button, { ButtonProps } from "@mui/material/Button";

export const WideButton = (props: ButtonProps) => (
  <Button
    {...props}
    sx={(theme) => {
      return {
        marginTop: theme.spacing(10),
        marginBottom: theme.spacing(10),
        padding: theme.spacing(10),
        textAlign: "center",
        width: "100%",
        borderRadius: 10,
      };
    }}
  >
    {props.children}
  </Button>
);

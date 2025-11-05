import { toast as sonnerToast } from "sonner";

export function useToast() {
  return {
    toast: ({ title, description, variant = "default", duration = 4000 }) => {
      sonnerToast[variant === "destructive" ? "error" : "success"](
        `${title}${description ? " - " + description : ""}`,
        { duration }
      );
    },
  };
}

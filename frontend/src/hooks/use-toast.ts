import { toast as toastManager } from "@/components/ui/toast";


type ToastProps = {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
};

// Map to base-ui toast manager which has a create method
export function useToast() {
  return {
    toast: (props: ToastProps) => {
      // Use the existing toast manager
      if (toastManager && typeof (toastManager as any).create === "function") {
        (toastManager as any).create({
          title: props.title,
          description: props.description,
          type: props.variant === "destructive" ? "error" : "success"
        });
      } else {
        alert(`${props.title}\n${props.description}`);
      }
    },
  };
}

export const toast = (props: ToastProps) => {
  if (toastManager && typeof (toastManager as any).create === "function") {
    (toastManager as any).create({
      title: props.title,
      description: props.description,
      type: props.variant === "destructive" ? "error" : "success"
    });
  } else {
    alert(`${props.title}\n${props.description}`);
  }
};

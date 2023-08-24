import { forwardRef, ComponentProps} from "react";

  interface InputProps extends Omit<ComponentProps<'input'>, 'prefix'> {
      label?: string;
      className?: string;
      id?:string;
  }

  export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
    { label, type,  onChange,placeholder, className = '',id,  ...props },
    ref
    ) {
      return (
        <label className="w-full" htmlFor={id}>
          {label && (
            <div className="mb-1 flex items-center space-x-1.5 ">
              <div className="font-medium font-general-sans">{label}</div>
            </div>
          )}
            <div className="flex items-center justify-center">
              <input
                id={id}
                placeholder={placeholder}
                className={`   border ${className}`}
                type={type}
                onChange={onChange}
                ref={ref}
                {...props}
              />
            </div>
        </label>
      );
  });
  
export function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
    return (
      <textarea
        className={`w-full h-64 p-4 text-lg border rounded-s-2xl ${className}`}
        {...props}
      />
    );
  }
  
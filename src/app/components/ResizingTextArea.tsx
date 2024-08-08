import React, { useState, useRef, useEffect } from 'react';

interface ResizingTextareaProps {
  id?: string;
  name?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: string;
}

const ResizingTextarea: React.FC<ResizingTextareaProps> = ({
  id,
  name,
  value,
  defaultValue,
  onChange,
  placeholder,
  className,
  minHeight = '40px',
}) => {
  const [textareaValue, setTextareaValue] = useState(value);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  console.log(defaultValue);

  useEffect(() => {
    adjustHeight();
  }, [textareaValue]);

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto'; // Reset height to auto to calculate the correct scroll height
      textarea.style.height = `${textarea.scrollHeight}px`; // Set the height to match the content
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextareaValue(e.target.value);
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <textarea
      id={id ? id : ''}
      name={name ? name : ''}
      defaultValue={defaultValue ? defaultValue : ''}
      ref={textareaRef}
      value={textareaValue}
      onChange={handleChange}
      placeholder={placeholder ? placeholder : ''}
      className={`resize-none overflow-hidden ${className}`}
      style={{ minHeight }}
      rows={1} // Setting the initial rows to 1 for better UX
    />
  );
};

export default ResizingTextarea;

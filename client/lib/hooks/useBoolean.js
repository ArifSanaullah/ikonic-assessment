import { useState } from "react";

export const useBoolean = (defaultValue) => {
  const [value, setValue] = useState(defaultValue ?? false);

  const setTrue = () => setValue(true);

  const setFalse = () => setValue(false);

  const toggle = () => setValue((prevValue) => !prevValue);

  return {
    value,
    setValue,
    setTrue,
    setFalse,
    toggle,
  };
};

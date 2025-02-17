import { useState, type JSX } from 'react';
import { useBoolean } from '@tomic/react';
import { InputProps } from './ResourceField';
import { ErrMessage } from './InputStyles';
import { Checkbox } from './Checkbox';

export default function InputBoolean({
  resource,
  property,
  commit,
  ...props
}: InputProps): JSX.Element {
  const { required: _required, ...otherProps } = props;

  const [err, setErr] = useState<Error | undefined>(undefined);
  const [value, setValue] = useBoolean(resource, property.subject, {
    handleValidationError: setErr,
    commit,
  });

  return (
    <>
      <Checkbox checked={value} onChange={setValue} {...otherProps} />
      {err && <ErrMessage>{err.message}</ErrMessage>}
    </>
  );
}

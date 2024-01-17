import { Resource, useValue } from '@tomic/react';

import { InputWrapper } from './InputStyles';
import { styled } from 'styled-components';

interface AtomicSelectInputProps {
  resource: Resource;
  property: string;
  options: {
    value: string;
    label: string;
  }[];
  commit?: boolean;
  onChange?: (value: string) => void;
}

type Props = AtomicSelectInputProps &
  Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange' | 'resource'>;

export function AtomicSelectInput({
  resource,
  property,
  options,
  commit = false,
  onChange,
  ...props
}: Props): JSX.Element {
  const [value, setValue] = useValue(resource, property, { commit });

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setValue(e.target.value);
    onChange?.(e.target.value);
  };

  return (
    <StyledInputWrapper>
      <SelectWrapper disabled={!!props.disabled}>
        <Select {...props} onChange={handleChange} value={value as string}>
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </SelectWrapper>
    </StyledInputWrapper>
  );
}

const StyledInputWrapper = styled(InputWrapper)`
  min-width: 15ch;
`;

const SelectWrapper = styled.span<{ disabled: boolean }>`
  width: 100%;
  padding-inline: 0.2rem;
  background-color: ${p =>
    p.disabled ? p.theme.colors.bg1 : p.theme.colors.bg};
`;

const Select = styled.select`
  cursor: pointer;
  width: 100%;
  border: none;
  outline: none;
  height: 2rem;
  background-color: transparent;
  color: ${p => p.theme.colors.text};
  &:disabled {
    color: ${props => props.theme.colors.textLight};
    background-color: transparent;
  }
`;

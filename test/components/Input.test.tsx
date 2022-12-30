import { pickHTMLAttributes } from '@bearei/react-util';
import '@testing-library/jest-dom';
import { fireEvent } from '@testing-library/react';
import React, { useEffect, useState } from 'react';
import Input from '../../src/components/Input';
import { render } from '../utils/test_utils';

interface CustomInputProps {
  onChange?: (e: React.ChangeEvent<HTMLInputElement>, value?: string) => void;
  value?: string;
}

const CustomInput: React.FC<CustomInputProps> = ({ value, onChange }) => {
  const [inputValue, setInputValue] = useState('');
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    const inputtedValue = e.currentTarget.value;

    setInputValue(inputtedValue);
    onChange?.(e, inputtedValue);
  };

  useEffect(() => {
    typeof value === 'string' && setInputValue(value);
  }, [value]);

  return (
    <input
      value={inputValue}
      aria-label="custom-input"
      onChange={handleChange}
    />
  );
};

const setup = () => {
  const utils = render(
    <Input
      defaultValue="1"
      onChange={() => {}}
      renderMain={({ value, ...props }) => (
        <CustomInput {...{ ...props, value: value?.toString() }} />
      )}
      renderContainer={({ id, children }) => (
        <div data-cy="container" id={id} tabIndex={1}>
          {children}
        </div>
      )}
    />,
  );

  const input = utils.getByLabelText('custom-input') as HTMLInputElement;

  return {
    input,
    ...utils,
  };
};

describe('test/components/Input.test.ts', () => {
  test('It should be a render input', async () => {
    const { getByDataCy } = render(
      <Input
        prefix="before"
        suffix="after"
        afterLabel="after"
        beforeLabel="before"
        onChange={() => {}}
        renderLabel={({ position, children }) => (
          <span data-cy={`label-${position}`}>{children}</span>
        )}
        renderFixed={({ position, children }) => (
          <span data-cy={`fixed-${position}`}>{children}</span>
        )}
        renderMain={({
          id,
          afterLabel,
          beforeLabel,
          suffix,
          prefix,
          ...props
        }) => (
          <>
            {beforeLabel}
            {prefix}
            <input
              {...pickHTMLAttributes(props)}
              data-cy="input"
              data-id={id}
            />
            {suffix}
            {afterLabel}
          </>
        )}
        renderContainer={({ id, children }) => (
          <div data-cy="container" id={id} tabIndex={1}>
            {children}
          </div>
        )}
      />,
    );

    expect(getByDataCy('container')).toHaveAttribute('tabIndex');
    expect(getByDataCy('fixed-before')).toHaveTextContent('before');
    expect(getByDataCy('fixed-after')).toHaveTextContent('after');
    expect(getByDataCy('label-before')).toHaveTextContent('before');
    expect(getByDataCy('label-after')).toHaveTextContent('after');
    expect(getByDataCy('input')).toHaveAttribute('value');
  });

  test('It would be to change the input value', async () => {
    const { input } = setup();

    expect(input).toHaveAttribute('value');

    fireEvent.change(input, { target: { value: '17' } });

    fireEvent.focus(input);
    fireEvent.blur(input);

    expect(input.value).toBe('17');
  });
});

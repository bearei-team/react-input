import '@testing-library/jest-dom';
import {render} from '../utils/testUtils';
import Input, {InputOptions} from '../../src/components/Input';
import React, {useEffect, useState} from 'react';
import {fireEvent} from '@testing-library/react';
import {pickHTMLAttributes} from '@bearei/react-util';

interface CustomInputProps {
  onChange?: (e: React.ChangeEvent<HTMLInputElement>, value?: string) => void;
  value?: string;
}

const CustomInput: React.FC<CustomInputProps> = ({value, onChange}) => {
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

  return <input value={inputValue} aria-label="custom-input" onChange={handleChange} />;
};

const setup = () => {
  const utils = render(
    <Input<HTMLInputElement>
      defaultValue="1"
      onChange={() => {}}
      renderMain={props => <CustomInput {...props} />}
      renderContainer={({id, children}) => (
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
    const {getByDataCy} = render(
      <Input<HTMLInputElement>
        prefix="before"
        suffix="after"
        afterLabel="after"
        beforeLabel="before"
        onChange={() => {}}
        renderContainer={({id, children}) => (
          <div data-cy="container" id={id} tabIndex={1}>
            {children}
          </div>
        )}
        renderLabel={({position, children}) => (
          <span data-cy={`label-${position}`}>{children}</span>
        )}
        renderFixed={({position, children}) => (
          <span data-cy={`fixed-${position}`}>{children}</span>
        )}
        renderMain={({id, ...props}) => (
          <input {...pickHTMLAttributes(props)} data-cy="input" data-id={id} />
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
    const {input} = setup();

    expect(input).toHaveAttribute('value');

    fireEvent.change(input, {target: {value: '17'}});

    fireEvent.focus(input);
    fireEvent.blur(input);

    expect(input.value).toBe('17');
  });
});

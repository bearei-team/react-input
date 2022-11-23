import '@testing-library/jest-dom';
import {render} from '../utils/testUtils';
import Input, {InputChangeEvent} from '../../src/components/Input';
import React, {useEffect, useState} from 'react';
import {fireEvent} from '@testing-library/react';

interface CustomInputProps {
  onChange?: (event: InputChangeEvent, value?: string) => void;
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
    <Input renderMain={props => <CustomInput {...props} />} onChange={(event, value) => {}} />,
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
      <Input
        prefix="before"
        suffix="after"
        afterLabel="after"
        beforeLabel="before"
        onChange={() => {}}
        renderContainer={({id}, element) => (
          <div data-cy="container" id={id} tabIndex={1}>
            {element}
          </div>
        )}
        renderLabel={({position}, element) => <span data-cy={`label-${position}`}>{element}</span>}
        renderFixed={({position}, element) => <span data-cy={`fixed-${position}`}>{element}</span>}
        renderMain={({size, id, handleEvent, ...props}) => (
          <input {...props} data-cy="input" data-id={id} />
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

    expect(input.value).toBe('17');
  });
});

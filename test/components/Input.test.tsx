import '@testing-library/jest-dom';
import {render} from '../utils/testUtils';
import {Input, InputChangeEvent} from '../../src/components/Input';
import React, {useEffect, useState} from 'react';
import {fireEvent} from '@testing-library/react';

interface CustomInputProps {
  onChange?: (event: InputChangeEvent, value?: string) => void;
  value?: string;
}

const CustomInput: React.FC<CustomInputProps> = ({value, onChange}) => {
  const [inputValue, setInputValue] = useState('');
  const handleChange = (event: InputChangeEvent) => {
    event.preventDefault();

    const inputtedValue = event.currentTarget.value;

    setInputValue(inputtedValue);
    onChange?.(event, inputtedValue);
  };

  useEffect(() => {
    value && value !== inputValue && setInputValue(value);
  }, [value]);

  return <input value={inputValue} aria-label="custom-input" onChange={handleChange} />;
};

const setup = () => {
  const utils = render(
    <Input renderChildren={props => <CustomInput {...props} />} onChange={(event, value) => {}} />,
  );

  const input = utils.getByLabelText('custom-input') as HTMLInputElement;

  return {
    input,
    ...utils,
  };
};

describe('test/components/Input.test.ts', () => {
  test('It should be a render input.', async () => {
    const {getByDataCy} = render(
      <Input
        prefix="before"
        suffix="after"
        renderContainer={({id}, element) => (
          <div data-cy="container" id={id} tabIndex={1}>
            {element}
          </div>
        )}
        renderInner={(_props, element) => (
          <div data-cy="inner" tabIndex={1}>
            {element}
          </div>
        )}
        renderFixed={({position}, element) => <span data-cy={`${position}`}>{element}</span>}
        renderChildren={props => <input data-cy="input" {...props} />}
      />,
    );

    expect(getByDataCy('container')).toHaveAttribute('tabIndex');
    expect(getByDataCy('inner')).toHaveAttribute('tabIndex');
    expect(getByDataCy('before')).toHaveTextContent('before');
    expect(getByDataCy('after')).toHaveTextContent('after');
    expect(getByDataCy('input')).toHaveAttribute('value');
  });

  test('It would be to change the input value.', async () => {
    const {input} = setup();

    expect(input).toHaveAttribute('value');

    fireEvent.change(input, {target: {value: '23'}});

    expect(input.value).toBe('23');
  });
});

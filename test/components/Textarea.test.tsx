import '@testing-library/jest-dom';
import {render} from '../utils/testUtils';
import Textarea from '../../src/components/Textarea';
import React, {useEffect, useState} from 'react';
import {fireEvent} from '@testing-library/react';
import {pickHTMLAttributes} from '@bearei/react-util';

interface CustomTextareaProps {
  onChange?: (e: React.ChangeEvent<HTMLInputElement>, value?: string) => void;
  value?: string;
}

const CustomTextarea: React.FC<CustomTextareaProps> = ({value, onChange}) => {
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

  return <input value={inputValue} aria-label="custom-textarea" onChange={handleChange} />;
};

const setup = () => {
  const utils = render(
    <Textarea
      defaultValue="1"
      onChange={() => {}}
      renderMain={({value, ...props}) => (
        <CustomTextarea {...{...props, value: value?.toString()}} />
      )}
      renderContainer={({id, children}) => (
        <div data-cy="container" id={id} tabIndex={1}>
          {children}
        </div>
      )}
    />,
  );

  const textarea = utils.getByLabelText('custom-textarea') as HTMLInputElement;

  return {
    textarea,
    ...utils,
  };
};

describe('test/components/Input.test.ts', () => {
  test('It should be a render textarea', async () => {
    const {getByDataCy} = render(
      <Textarea
        prefix="before"
        suffix="after"
        onChange={() => {}}
        renderFixed={({position, children}) => (
          <span data-cy={`fixed-${position}`}>{children}</span>
        )}
        renderHeader={({prefix, suffix}) => (
          <>
            {prefix}
            {suffix}
          </>
        )}
        renderMain={({id, header, ...props}) => (
          <>
            {header}
            <input
              {...pickHTMLAttributes(props)}
              data-cy="textarea"
              data-id={id}
              value=""
              onChange={() => {}}
            />
          </>
        )}
        renderContainer={({id, children}) => (
          <div data-cy="container" id={id} tabIndex={1}>
            {children}
          </div>
        )}
      />,
    );

    expect(getByDataCy('container')).toHaveAttribute('tabIndex');
    expect(getByDataCy('fixed-before')).toHaveTextContent('before');
    expect(getByDataCy('fixed-after')).toHaveTextContent('after');
    expect(getByDataCy('textarea')).toHaveAttribute('value');
  });

  test('It would be to change the textarea value', async () => {
    const {textarea} = setup();

    expect(textarea).toHaveAttribute('value');

    fireEvent.change(textarea, {target: {value: '17'}});

    fireEvent.focus(textarea);
    fireEvent.blur(textarea);

    expect(textarea.value).toBe('17');
  });
});

import * as React from 'react';
import {useState, useEffect, useId} from 'react';
import {NativeSyntheticEvent, TextInputChangeEventData, TextInputProps} from 'react-native';
import {getPlatform} from '@bearei/react-util/lib-esm/getPlatform';

/**
 * Input change event.
 */
export type InputChangeEvent =
  | React.ChangeEvent<HTMLInputElement>
  | NativeSyntheticEvent<TextInputChangeEventData>;

/**
 * Input children element props.
 */
export interface InputChildrenProps
  extends Pick<InputProps, 'value' | 'defaultValue' | 'disabled'> {
  /**
   * Listen for input value changes.
   */
  onChange?: (event: InputChangeEvent) => void;
}

/**
 * Input props.
 */
export interface InputProps {
  /**
   * Input prefix element.
   */
  prefix?: JSX.Element | string;

  /**
   * Input suffix element.
   */
  suffix?: JSX.Element | string;

  /**
   * Input value.
   */
  value?: string;

  /**
   * Input default value.
   */
  defaultValue?: string;

  /**
   * Whether to disable input.
   */
  disabled?: boolean;

  /**
   * Input is loaded or not.
   */
  loading?: boolean;

  /**
   * Render the input prefix or suffix.
   */
  renderFix?: (fixType: 'pre' | 'suf', element?: string | JSX.Element) => JSX.Element;

  /**
   * Render the input internal container.
   */
  renderInner?: (element?: JSX.Element) => JSX.Element;

  /**
   * Render the input container.
   */
  renderContainer?: (id: string, element?: JSX.Element) => JSX.Element;

  /**
   * Render the Children element.
   *
   * The browser environment children <input />.
   * The react native environment children <TextInput />.
   */
  renderChildren?: (
    inputChildrenProps: InputChildrenProps,
  ) =>
    | React.ReactElement<TextInputProps>
    | React.ReactElement<
        React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>
      >;

  /**
   * Listen for input value changes.
   */
  onChange?: (event: InputChangeEvent, value?: string) => void;
}

export const Input: React.FC<InputProps> = ({
  prefix,
  suffix,
  value,
  defaultValue,
  onChange,
  renderFix,
  renderInner,
  renderContainer,
  renderChildren,
  ...args
}) => {
  const id = useId();
  const [inputValue, setInputValue] = useState('');
  const handleChange = (event: InputChangeEvent) => {
    event.preventDefault();

    const text =
      getPlatform() === 'reactNative'
        ? (event as NativeSyntheticEvent<TextInputChangeEventData>).nativeEvent.text
        : (event as React.ChangeEvent<HTMLInputElement>).currentTarget.value;

    setInputValue(text);
    onChange?.(event, text);
  };

  const prefixElement = prefix && renderFix?.('pre', prefix);
  const suffixElement = suffix && renderFix?.('suf', suffix);
  const childrenElement = (
    <>
      {prefixElement}
      {renderChildren?.({value: inputValue, defaultValue, onChange: handleChange, ...args})}
      {suffixElement}
    </>
  );

  const innerElement = renderInner ? renderInner?.(childrenElement) : <>{childrenElement}</>;
  const containerElement = renderContainer ? (
    renderContainer?.(id, innerElement)
  ) : (
    <>{innerElement}</>
  );

  useEffect(() => {
    const nextValue = defaultValue ? defaultValue : value;

    nextValue && setInputValue(nextValue);
  }, [value, defaultValue]);

  return <>{containerElement}</>;
};

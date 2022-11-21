import * as React from 'react';
import {useState, useEffect, useId} from 'react';
import {
  NativeSyntheticEvent,
  TextInputChangeEventData,
  TextInputProps,
  TextInputFocusEventData,
} from 'react-native';
import {getPlatform} from '@bearei/react-util/lib/getPlatform';

/**
 * Input change event.
 */
export type InputChangeEvent = React.ChangeEvent<HTMLInputElement> &
  NativeSyntheticEvent<TextInputChangeEventData>;

/**
 * Input change event.
 */
export type InputFocusEvent =
  | React.FocusEvent<HTMLInputElement, Element>
  | NativeSyntheticEvent<TextInputFocusEventData>;

export type InputOmitProps = Omit<
  InputProps,
  | 'renderFixed'
  | 'renderInner'
  | 'renderContainer'
  | 'renderChildren'
  | 'prefix'
  | 'suffix'
  | 'onChange'
>;

/**
 * Input children element props.
 */
export interface InputChildrenProps extends InputOmitProps {
  /**
   * Listen for input value changes.
   */
  onChange?: (event: InputChangeEvent) => void;
}

/**
 * Input fixed props.
 */
export interface InputFixedProps extends InputOmitProps {
  /**
   * fixed position.
   */
  position: 'before' | 'after';
}

/**
 * Input inner props.
 */
export type InputInnerProps = InputOmitProps;

/**
 * Input container props.
 */
export interface InputContainerProps extends InputOmitProps {
  /**
   * Component unique ID.
   */
  id: string;
}

/**
 * Input props.
 */
export interface InputProps
  extends Omit<
    React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> &
      TextInputProps,
    'prefix' | 'onChange'
  > {
  /**
   * Prefix element.
   */
  prefix?: JSX.Element | string;

  /**
   * Suffix element.
   */
  suffix?: JSX.Element | string;

  /**
   * If it's loaded.
   */
  loading?: boolean;

  /**
   * Input type.
   */
  inputType?: 'default' | 'error';

  /**
   * Render the input prefix or suffix.
   */
  renderFixed?: (props: InputFixedProps, element?: string | JSX.Element) => JSX.Element;

  /**
   * Render the input internal container.
   */
  renderInner?: (props: InputInnerProps, element?: JSX.Element) => JSX.Element;

  /**
   * Render the input container.
   */
  renderContainer?: (props: InputContainerProps, element?: JSX.Element) => JSX.Element;

  /**
   * Render the Children element.
   *
   * The browser environment children <input />.
   * The react native environment children <TextInput />.
   */
  renderChildren?: (
    props: InputChildrenProps,
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
  renderFixed,
  renderInner,
  renderContainer,
  renderChildren,
  ...args
}) => {
  const platform = getPlatform();
  const id = useId();
  const [inputValue, setInputValue] = useState('');
  const handleChange = (event: InputChangeEvent) => {
    event.preventDefault();

    const text = platform === 'reactNative' ? event.nativeEvent.text : event.currentTarget.value;

    setInputValue(text);
    onChange?.(event, text);
  };

  const prefixElement = prefix && renderFixed?.({position: 'before', ...args}, prefix);
  const suffixElement = suffix && renderFixed?.({position: 'after', ...args}, suffix);
  const childrenElement = (
    <>
      {prefixElement}
      {renderChildren?.({value: inputValue, defaultValue, onChange: handleChange, ...args})}
      {suffixElement}
    </>
  );

  const innerElement = renderInner ? (
    renderInner?.({...args}, childrenElement)
  ) : (
    <>{childrenElement}</>
  );

  const containerElement = renderContainer ? (
    renderContainer?.({id, ...args}, innerElement)
  ) : (
    <>{innerElement}</>
  );

  useEffect(() => {
    const nextValue = defaultValue ? defaultValue : value;

    nextValue && setInputValue(nextValue);
  }, [value, defaultValue]);

  return <>{containerElement}</>;
};

import * as React from 'react';
import {useState, useEffect, useId} from 'react';
import {
  NativeSyntheticEvent,
  TextInputChangeEventData,
  TextInputProps,
  TextInputFocusEventData,
} from 'react-native';
import {getPlatform} from '@bearei/react-util/lib/platform';
import {handleEvent} from '@bearei/react-util/lib/event';

/**
 * Input box props
 */
export interface InputProps
  extends Omit<
    | React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> &
        TextInputProps,
    'prefix' | 'onChange' | 'onFocus' | 'onBlur' | 'size'
  > {
  /**
   * An input box with a prefix label
   */
  afterLabel?: React.ReactNode;

  /**
   * An input box with a suffix label
   */
  beforeLabel?: React.ReactNode;

  /**
   * An input box with a prefix
   */
  prefix?: React.ReactNode;

  /**
   * An input box with a suffix
   */
  suffix?: React.ReactNode;

  /**
   * Set the value of the input box
   */
  value?: string;

  /**
   * Set the default value for the input box
   */
  defaultValue?: string;

  /**
   * Whether or not to disable the input box
   */
  disabled?: boolean;

  /**
   * Whether the button is loading
   */
  loading?: boolean;

  /**
   * Set the input box size
   */
  size?: 'small' | 'medium' | 'large';

  /**
   * Set the input box shape
   */
  shape?: 'square' | 'circle' | 'round';

  /**
   * Sets the input box validation status
   */
  status?: 'normal' | 'error' | 'warning';

  /**
   * Renders the input box prefix label or suffix label
   */
  renderLabel?: (props: InputLabelProps, element?: React.ReactNode) => React.ReactNode;

  /**
   * Render input box prefix or suffix
   */
  renderFixed?: (props: InputFixedProps, element?: React.ReactNode) => React.ReactNode;

  /**
   * Render the input box container
   */
  renderContainer?: (props: InputContainerProps, element?: React.ReactNode) => React.ReactNode;

  /**
   * Render the input box main
   */
  renderMain?: (
    props: InputMainProps,
  ) =>
    | React.ReactElement<TextInputProps>
    | React.ReactElement<
        React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>
      >;

  /**
   * A callback when the contents of an input box change
   */
  onChange?: (e: InputChangeEvent, value?: string) => void;

  /**
   * The callback when the input box gets focus
   */
  onFocus?: (e: InputFocusEvent) => void;

  /**
   * Callback when the input box loses focus
   */
  onBlur?: (e: InputFocusEvent) => void;
}

/**
 * Input box props
 */
export interface InputChildrenProps
  extends Omit<
    InputProps,
    | 'renderFixed'
    | 'renderContainer'
    | 'renderMain'
    | 'renderLabel'
    | 'prefix'
    | 'suffix'
    | 'afterLabel'
    | 'beforeLabel'
  > {
  /**
   * Unique ID of card component
   */
  id: string;

  /**
   * Used to handle some common default events
   */
  handleEvent: typeof handleEvent;
}

export type InputChangeEvent =
  | React.ChangeEvent<HTMLInputElement>
  | NativeSyntheticEvent<TextInputChangeEventData>;

export type InputFocusEvent =
  | React.FocusEvent<HTMLInputElement, Element>
  | NativeSyntheticEvent<TextInputFocusEventData>;

export type InputMainProps = Pick<InputProps, 'ref'> & InputChildrenProps;
export type InputContainerProps = InputChildrenProps;

export interface InputFixedProps extends InputChildrenProps {
  /**
   * The position of the prefix or suffix of an input box
   */
  position: 'before' | 'after';
}

export type InputLabelProps = InputFixedProps;

const Input: React.FC<InputProps> = ({
  ref,
  prefix,
  suffix,
  value,
  afterLabel,
  beforeLabel,
  defaultValue,
  onBlur,
  onFocus,
  onChange,
  renderFixed,
  renderLabel,
  renderContainer,
  renderMain,
  ...args
}) => {
  const id = useId();
  const childrenProps = {...args, id, handleEvent};
  const platform = getPlatform();
  const [inputValue, setInputValue] = useState('');
  const handleChange = (e: InputChangeEvent) => {
    const text =
      platform === 'reactNative'
        ? (e as NativeSyntheticEvent<TextInputChangeEventData>).nativeEvent.text
        : (e as React.ChangeEvent<HTMLInputElement>).currentTarget.value;

    setInputValue(text);
    onChange?.(e, text);
  };

  const handleFocus = (e: InputFocusEvent) => onFocus?.(e);
  const handleBlur = (e: InputFocusEvent) => onBlur?.(e);
  const prefixElement = (
    <>{prefix && renderFixed?.({...childrenProps, position: 'before'}, prefix)}</>
  );

  const suffixElement = (
    <>{suffix && renderFixed?.({...childrenProps, position: 'after'}, suffix)}</>
  );

  const beforeLabelElement = (
    <>{beforeLabel && renderLabel?.({...childrenProps, position: 'before'}, beforeLabel)}</>
  );

  const afterLabelElement = (
    <>{afterLabel && renderLabel?.({...childrenProps, position: 'after'}, afterLabel)}</>
  );

  const mainElement = (
    <>
      {beforeLabelElement}
      {prefixElement}
      {renderMain?.({
        ...childrenProps,
        ref,
        value: inputValue,
        defaultValue,
        ...(onChange ? {onChange: handleEvent(handleChange)} : undefined),
        ...(onFocus ? {onFocus: handleEvent(handleFocus)} : undefined),
        ...(onBlur ? {onBlur: handleEvent(handleBlur)} : undefined),
      })}

      {suffixElement}
      {afterLabelElement}
    </>
  );

  const containerElement = (
    <>{renderContainer ? renderContainer?.(childrenProps, mainElement) : mainElement}</>
  );

  useEffect(() => {
    const nextValue = defaultValue ?? value;

    typeof nextValue === 'string' && setInputValue(nextValue);
  }, [value, defaultValue]);

  return <>{containerElement}</>;
};

export default Input;

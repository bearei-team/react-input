import * as React from 'react';
import {useState, useEffect, useId} from 'react';
import {
  NativeSyntheticEvent,
  TextInputChangeEventData,
  TextInputProps,
  TextInputFocusEventData,
} from 'react-native';
import {getPlatform} from '@bearei/react-util/lib/getPlatform';
import {handleEvent} from '@bearei/react-util/lib/event';

export type InputChangeEvent =
  | React.ChangeEvent<HTMLInputElement>
  | NativeSyntheticEvent<TextInputChangeEventData>;

export type InputFocusEvent =
  | React.FocusEvent<HTMLInputElement, Element>
  | NativeSyntheticEvent<TextInputFocusEventData>;

export type InputOmitProps = Omit<
  InputProps,
  'renderFixed' | 'renderContainer' | 'renderChildren' | 'prefix' | 'suffix' | 'onChange'
>;

/**
 * Text box children props.
 */
export interface InputChildrenProps extends InputOmitProps {
  /**
   * This callback function is called when the text box content changes.
   */
  onChange?: (e: InputChangeEvent) => void;
}

/**
 * Text box prefix or suffix props.
 */
export interface InputFixedProps extends InputOmitProps {
  /**
   * The text box holds the component position.
   */
  position: 'before' | 'after';
}

/**
 * Text box container props.
 */
export interface InputContainerProps extends InputOmitProps {
  /**
   * The unique ID of the text box component.
   */
  id: string;
}

/**
 * Text box props.
 */
export interface InputProps
  extends Omit<
    | React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> &
        TextInputProps,
    'prefix' | 'onChange' | 'ref' | 'onFocus' | 'onBlur'
  > {
  /**
   * Text box prefix.
   */
  prefix?: React.ReactNode;

  /**
   * Text box suffix.
   */
  suffix?: React.ReactNode;

  /**
   * Whether the text box is loading.
   */
  loading?: boolean;

  /**
   * Render text box prefix or suffix.
   */
  renderFixed?: (props: InputFixedProps, element?: React.ReactNode) => React.ReactNode;

  /**
   * Render text box container.
   */
  renderContainer?: (props: InputContainerProps, element?: React.ReactNode) => React.ReactNode;

  /**
   * Render text box children.
   */
  renderChildren?: (
    props: InputChildrenProps,
  ) =>
    | React.ReactElement<TextInputProps>
    | React.ReactElement<
        React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>
      >;

  /**
   * This callback function is called when the text box content changes.
   */
  onChange?: (e: InputChangeEvent, value?: string) => void;

  /**
   * This callback function is called when the text box gets the focus.
   */
  onFocus?: (e: InputFocusEvent) => void;

  /**
   * This callback function is called when the text box loses focus.
   */
  onBlur?: (e: InputFocusEvent) => void;
}

const Input: React.FC<InputProps> = ({
  prefix,
  suffix,
  value,
  defaultValue,
  onBlur,
  onFocus,
  onChange,
  renderFixed,
  renderContainer,
  renderChildren,
  ...args
}) => {
  const id = useId();
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
  const prefixElement = prefix && renderFixed?.({...args, position: 'before'}, prefix);
  const suffixElement = suffix && renderFixed?.({...args, position: 'after'}, suffix);
  const childrenElement = (
    <>
      {prefixElement}
      {renderChildren?.({
        ...args,
        value: inputValue,
        defaultValue,
        ...(onChange ? {onChange: handleEvent(handleChange)} : undefined),
        ...(onFocus ? {onFocus: handleEvent(handleFocus)} : undefined),
        ...(onBlur ? {onBlur: handleEvent(handleBlur)} : undefined),
      })}

      {suffixElement}
    </>
  );

  const containerElement = renderContainer ? (
    renderContainer?.({...args, id}, childrenElement)
  ) : (
    <>{childrenElement}</>
  );

  useEffect(() => {
    const nextValue = defaultValue ?? value;

    nextValue && setInputValue(nextValue.toString());
  }, [value, defaultValue]);

  return <>{containerElement}</>;
};

export default Input;

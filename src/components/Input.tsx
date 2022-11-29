import {useState, useEffect, useId, useCallback} from 'react';
import type {
  Ref,
  DetailedHTMLProps,
  InputHTMLAttributes,
  ReactNode,
  ChangeEvent,
  FocusEvent,
} from 'react';
import type {
  NativeSyntheticEvent,
  TextInputChangeEventData,
  TextInputProps,
  TextInputFocusEventData,
} from 'react-native';
import handleEvent from '@bearei/react-util/lib/event';
import platformInfo from '@bearei/react-util/lib/platform';
import type {HandleEvent} from '@bearei/react-util/lib/event';

/**
 * Input box options
 */
export interface InputOptions<E> {
  /**
   * Input box values.
   */
  value?: string;

  /**
   * That triggers a change in the value of the input field
   */
  event?: E;
}

export interface BaseInputProps<T, E>
  extends Omit<
    DetailedHTMLProps<InputHTMLAttributes<T>, T> & TextInputProps & Pick<InputOptions<E>, 'value'>,
    'prefix' | 'onChange' | 'onFocus' | 'onBlur' | 'size'
  > {
  /**
   * Custom ref
   */
  ref?: Ref<T>;

  /**
   * The label at the back of the input box
   */
  afterLabel?: ReactNode;

  /**
   * The label in front of the input box
   */
  beforeLabel?: ReactNode;

  /**
   * Input box prefix
   */
  prefix?: ReactNode;

  /**
   * Input box suffix
   */
  suffix?: ReactNode;

  /**
   * Default values for input box
   */
  defaultValue?: string;

  /**
   * Whether to disable input box
   */
  disabled?: boolean;

  /**
   * Whether the input box is loading
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
   * Set the input box status
   */
  status?: 'normal' | 'error' | 'warning';

  /**
   * This function is called when the input field value changes
   */
  onChange?: (options: InputOptions<E>) => void;

  /**
   * This function is called when the input box gets the focus
   */
  onFocus?: (e: InputFocusEvent<T>) => void;

  /**
   * This function is called when the input field loses focus
   */
  onBlur?: (e: InputFocusEvent<T>) => void;
}

export interface InputProps<T, E> extends BaseInputProps<T, E> {
  /**
   * Render the input box label
   */
  renderLabel?: (props: InputLabelProps<T, E>) => ReactNode;

  /**
   * Render the input box fixed
   */
  renderFixed?: (props: InputFixedProps<T, E>) => ReactNode;

  /**
   * Render the input box main
   */
  renderMain?: (props: InputMainProps<T, E>) => ReactNode;

  /**
   * Render the input box container
   */
  renderContainer?: (props: InputContainerProps<T, E>) => ReactNode;
}

export interface InputChildrenProps<T, E>
  extends Omit<BaseInputProps<T, E>, 'prefix' | 'suffix' | 'afterLabel' | 'beforeLabel'> {
  /**
   * Component unique ID
   */
  id: string;
  children?: ReactNode;

  /**
   * Used to handle some common default events
   */
  handleEvent: HandleEvent;
}

export type InputChangeEvent<T> = ChangeEvent<T> | NativeSyntheticEvent<TextInputChangeEventData>;
export type InputFocusEvent<T> =
  | FocusEvent<T, Element>
  | NativeSyntheticEvent<TextInputFocusEventData>;

export interface InputMainProps<T, E>
  extends Omit<InputChildrenProps<T, E> & Pick<BaseInputProps<T, E>, 'ref'>, 'onChange'> {
  onChange?: (e: InputChangeEvent<T>, value?: string) => void;
}

export type InputContainerProps<T, E> = InputChildrenProps<T, E>;

export interface InputFixedProps<T, E> extends InputChildrenProps<T, E> {
  position: 'before' | 'after';
}

export type InputLabelProps<T, E> = InputFixedProps<T, E>;

function Input<T, E = InputChangeEvent<T>>({
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
}: InputProps<T, E>) {
  const id = useId();
  const [status, setStatus] = useState('idle');
  const [inputOptions, setInputOptions] = useState<InputOptions<E>>({value: ''});
  const platform = platformInfo();
  const childrenProps = {...args, id, handleEvent};
  const handleInputOptionsChange = useCallback(
    (options: InputOptions<E>) => onChange?.(options),
    [onChange],
  );

  const handleChange = (e: E) => {
    const value =
      platform === 'reactNative'
        ? (e as NativeSyntheticEvent<TextInputChangeEventData>).nativeEvent.text
        : (e as ChangeEvent<HTMLInputElement>).currentTarget.value;

    const options = {event: e, value};

    setInputOptions(options);
    handleInputOptionsChange(options);
  };

  const handleFocus = (e: InputFocusEvent<T>) => onFocus?.(e);
  const handleBlur = (e: InputFocusEvent<T>) => onBlur?.(e);

  useEffect(() => {
    const nextValue = status !== 'idle' ? value : defaultValue ?? value;
    const update = typeof nextValue === 'string';

    update &&
      setInputOptions(currentOptions => {
        const change = currentOptions.value !== nextValue && status === 'succeeded';

        change && handleInputOptionsChange({value: nextValue});

        return {value: nextValue};
      });

    status === 'idle' && setStatus('succeeded');
  }, [defaultValue, handleInputOptionsChange, status, value]);

  const prefixNode =
    prefix && renderFixed?.({...childrenProps, position: 'before', children: prefix});

  const suffixNode =
    suffix && renderFixed?.({...childrenProps, position: 'after', children: suffix});

  const beforeLabelNode =
    beforeLabel && renderLabel?.({...childrenProps, position: 'before', children: beforeLabel});

  const afterLabelNode =
    afterLabel && renderLabel?.({...childrenProps, position: 'after', children: afterLabel});

  const main = (
    <>
      {beforeLabelNode}
      {prefixNode}
      {renderMain?.({
        ...childrenProps,
        ref,
        value: inputOptions.value,
        defaultValue,
        ...(onChange
          ? {onChange: handleEvent(handleChange as (e: InputChangeEvent<T>) => void)}
          : undefined),
        ...(onFocus ? {onFocus: handleEvent(handleFocus)} : undefined),
        ...(onBlur ? {onBlur: handleEvent(handleBlur)} : undefined),
      })}

      {suffixNode}
      {afterLabelNode}
    </>
  );

  const container = renderContainer?.({...childrenProps, children: main}) ?? main;

  return <>{container}</>;
}

export default Input;

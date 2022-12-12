import * as array from '@bearei/react-util/lib/array';
import {bindEvents, handleDefaultEvent} from '@bearei/react-util/lib/event';
import platformInfo from '@bearei/react-util/lib/platform';
import {
  ChangeEvent,
  DetailedHTMLProps,
  FocusEvent,
  InputHTMLAttributes,
  ReactNode,
  Ref,
  useCallback,
  useEffect,
  useId,
  useState,
} from 'react';
import type {
  NativeSyntheticEvent,
  TextInputChangeEventData,
  TextInputFocusEventData,
  TextInputProps,
} from 'react-native';
import Textarea from './Textarea';

/**
 * Input options
 */
export interface InputOptions<E = unknown> extends Pick<BaseInputProps, 'value'> {
  /**
   * Triggers an event when a input option changes
   */
  event?: E;
}

export interface BaseInputProps<T = HTMLInputElement>
  extends Omit<
    DetailedHTMLProps<InputHTMLAttributes<T>, T> & TextInputProps,
    'prefix' | 'defaultValue' | 'size' | 'onChange' | 'onFocus' | 'onBlur' | 'value'
  > {
  /**
   * Custom ref
   */
  ref?: Ref<T>;

  /**
   * Input value
   */
  value?: string | string[];

  /**
   * The default value for the input
   */
  defaultValue?: string | string[];

  /**
   * no style input
   */
  noStyle?: boolean;

  /**
   * The label at the back of the input
   */
  afterLabel?: ReactNode;

  /**
   * The label in front of the input
   */
  beforeLabel?: ReactNode;

  /**
   * Input prefix
   */
  prefix?: ReactNode;

  /**
   * Input suffix
   */
  suffix?: ReactNode;

  /**
   * Whether to disable input
   */
  disabled?: boolean;

  /**
   * Whether or not to disable the input
   */
  loading?: boolean;

  /**
   * Input size
   */
  size?: 'small' | 'medium' | 'large';

  /**
   * Input shape
   */
  shape?: 'square' | 'circle' | 'round';

  /**
   * Input status
   */
  status?: 'normal' | 'error' | 'warning';

  /**
   * This function is called when the input option changes
   */
  onChange?: <E>(options: InputOptions<E>) => void;

  /**
   * This function is called when the input gets the focus
   */
  onFocus?: (e: FocusEvent<T, Element> | NativeSyntheticEvent<TextInputFocusEventData>) => void;

  /**
   * This function is called when the input loses focus
   */
  onBlur?: (e: FocusEvent<T, Element> | NativeSyntheticEvent<TextInputFocusEventData>) => void;

  /**
   * This function is called when the input value changes
   */
  onValueChange?: (value?: string | string[]) => void;
}

export type Event = 'onChange' | 'onFocus' | 'onBlur';

export interface InputProps<T> extends BaseInputProps<T> {
  /**
   * Render the input label
   */
  renderLabel?: (props: InputLabelProps) => ReactNode;

  /**
   * Render the input fixed
   */
  renderFixed?: (props: InputFixedProps) => ReactNode;

  /**
   * Render the input main
   */
  renderMain: (props: InputMainProps<T>) => ReactNode;

  /**
   * Render the input container
   */
  renderContainer: (props: InputContainerProps) => ReactNode;
}

export interface InputChildrenProps extends Omit<BaseInputProps, 'ref' | 'onChange'> {
  /**
   * Component unique ID
   */
  id: string;
  children?: ReactNode;

  /**
   * This function is called when the input option changes
   */
  onChange?: <E>(e: E) => void;
}

export interface InputFixedProps extends InputChildrenProps {
  position: 'before' | 'after';
}

export type InputLabelProps = InputFixedProps;
export type InputMainProps<T> = InputChildrenProps & Pick<BaseInputProps<T>, 'ref'>;
export type InputContainerProps = InputChildrenProps;

export type MenuType = typeof Input & {Textarea: typeof Textarea};

const Input = <T extends HTMLInputElement>(props: InputProps<T>) => {
  const {
    ref,
    value,
    prefix,
    suffix,
    loading,
    disabled,
    afterLabel,
    beforeLabel,
    defaultValue,
    onBlur,
    onFocus,
    onChange,
    onValueChange,
    renderFixed,
    renderLabel,
    renderMain,
    renderContainer,
    ...args
  } = props;

  const id = useId();
  const [status, setStatus] = useState('idle');
  const [inputOptions, setInputOptions] = useState<InputOptions>({value: ''});
  const events = Object.keys(props).filter(key => key.startsWith('on'));
  const platform = platformInfo();
  const childrenProps = {...args, id, loading, disabled};

  const handleInputOptionsChange = useCallback(
    <E,>(options: InputOptions<E>) => {
      onChange?.(options);
      onValueChange?.(options.value);
    },
    [onChange, onValueChange],
  );
  const handleResponse = <E,>(e: E, callback?: (e: E) => void) => {
    const isResponse = !loading && !disabled;

    isResponse && callback?.(e);
  };

  const handleCallback = (key: string) => {
    const event = {
      onBlur: handleDefaultEvent(
        (e: FocusEvent<T, Element> | NativeSyntheticEvent<TextInputFocusEventData>) =>
          handleResponse(e, onBlur),
      ),
      onFocus: handleDefaultEvent(
        (e: FocusEvent<T, Element> | NativeSyntheticEvent<TextInputFocusEventData>) =>
          handleResponse(e, onFocus),
      ),
      onChange: handleDefaultEvent(
        (e: NativeSyntheticEvent<TextInputChangeEventData> | ChangeEvent<HTMLInputElement>) => {
          const handleChange = (
            e: NativeSyntheticEvent<TextInputChangeEventData> | ChangeEvent<HTMLInputElement>,
          ) => {
            const value =
              platform === 'ReactNative'
                ? (e as NativeSyntheticEvent<TextInputChangeEventData>).nativeEvent.text
                : (e as ChangeEvent<HTMLInputElement>).currentTarget.value;

            const options = {event: e, value};

            setInputOptions(options);
            handleInputOptionsChange(options);
          };

          handleResponse(e, handleChange);
        },
      ),
    };

    return event[key as keyof typeof event];
  };

  useEffect(() => {
    const nextValue = status !== 'idle' ? value : defaultValue ?? value;

    nextValue &&
      setInputOptions(currentOptions => {
        const isUpdate =
          Array.isArray(nextValue) && Array.isArray(currentOptions.value)
            ? !array.isEqual(currentOptions.value, nextValue)
            : currentOptions.value !== nextValue && status === 'succeeded';

        isUpdate && handleInputOptionsChange({value: nextValue});

        return {value: nextValue};
      });

    status === 'idle' && setStatus('succeeded');
  }, [defaultValue, handleInputOptionsChange, status, value]);

  const prefixNode = renderFixed?.({...childrenProps, position: 'before', children: prefix});
  const suffixNode = renderFixed?.({...childrenProps, position: 'after', children: suffix});
  const beforeLabelNode = renderLabel?.({
    ...childrenProps,
    position: 'before',
    children: beforeLabel,
  });

  const afterLabelNode = renderLabel?.({...childrenProps, position: 'after', children: afterLabel});
  const main = renderMain({
    ...childrenProps,
    ref,
    value: inputOptions.value,
    defaultValue,
    beforeLabel: beforeLabelNode,
    prefix: prefixNode,
    suffix: suffixNode,
    afterLabel: afterLabelNode,
    ...bindEvents(events, handleCallback),
  });

  const container = renderContainer({...childrenProps, children: main});

  return <>{container}</>;
};

Object.defineProperty(Input, 'Textarea', {value: Textarea});

export default Input as MenuType;

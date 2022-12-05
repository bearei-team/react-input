import {
  useState,
  useEffect,
  useId,
  useCallback,
  ChangeEvent,
  Ref,
  DetailedHTMLProps,
  InputHTMLAttributes,
  ReactNode,
  FocusEvent,
} from 'react';
import type {
  NativeSyntheticEvent,
  TextInputChangeEventData,
  TextInputFocusEventData,
  TextInputProps,
} from 'react-native';
import {bindEvents, handleDefaultEvent} from '@bearei/react-util/lib/event';
import platformInfo from '@bearei/react-util/lib/platform';
import Textarea from './Textarea';

/**
 * Input box options
 */
export interface InputOptions<E = unknown> {
  /**
   * Input box value
   */
  value?: string | string[];

  /**
   * That triggers a change in the value of the input field
   */
  event?: E;
}

export interface BaseInputProps<T = HTMLElement>
  extends Omit<
    DetailedHTMLProps<InputHTMLAttributes<T>, T> & TextInputProps & Pick<InputOptions, 'value'>,
    'prefix' | 'defaultValue' | 'size' | 'onChange' | 'onFocus' | 'onBlur'
  > {
  /**
   * Custom ref
   */
  ref?: Ref<T>;

  /**
   * Set whether the input box is unstyled
   */
  noStyle?: boolean;

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
  defaultValue?: string | string[];

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
  onChange?: <E>(options: InputOptions<E>) => void;

  /**
   * This function is called when the input box gets the focus
   */
  onFocus?: (e: FocusEvent<T, Element> | NativeSyntheticEvent<TextInputFocusEventData>) => void;

  /**
   * This function is called when the input field loses focus
   */
  onBlur?: (e: FocusEvent<T, Element> | NativeSyntheticEvent<TextInputFocusEventData>) => void;

  /**
   * Call back this function when the input box value changes
   */
  onValueChange?: (value?: string | string[]) => void;
}

export type Event = 'onChange' | 'onFocus' | 'onBlur';

export interface InputProps<T> extends BaseInputProps<T> {
  /**
   * Render the input box label
   */
  renderLabel?: (props: InputLabelProps) => ReactNode;

  /**
   * Render the input box fixed
   */
  renderFixed?: (props: InputFixedProps) => ReactNode;

  /**
   * Render the input box main
   */
  renderMain?: (props: InputMainProps<T>) => ReactNode;

  /**
   * Render the input box container
   */
  renderContainer?: (props: InputContainerProps) => ReactNode;
}

export interface InputChildrenProps extends Omit<BaseInputProps, 'ref' | 'onChange'> {
  /**
   * Component unique ID
   */
  id: string;
  children?: ReactNode;

  /**
   * This function is called when the input field value changes
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

const Input = <T extends HTMLElement>(props: InputProps<T>) => {
  const {
    ref,
    prefix,
    suffix,
    value,
    afterLabel,
    beforeLabel,
    defaultValue,
    loading,
    disabled,
    onChange,
    onFocus,
    onBlur,
    onValueChange,
    renderFixed,
    renderLabel,
    renderMain,
    renderContainer,
    ...args
  } = props;

  const id = useId();
  const events = Object.keys(props).filter(key => key.startsWith('on'));
  const [status, setStatus] = useState('idle');
  const [inputOptions, setInputOptions] = useState<InputOptions>({value: ''});
  const platform = platformInfo();
  const childrenProps = {...args, id, loading, disabled};

  const handleInputOptionsChange = useCallback(
    <E,>(options: InputOptions<E>) => {
      onChange?.(options);
      onValueChange?.(options.value);
    },
    [onChange, onValueChange],
  );

  const handleCallback = (key: string) => {
    const handleResponse = <E,>(e: E, callback?: (e: E) => void) => {
      const response = !loading && !disabled;

      response && callback?.(e);
    };

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

  const handleArrayToString = (array = '' as string | string[]) =>
    Array.isArray(array) ? array.join(',') : array;

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

  const main = renderMain?.({
    ...childrenProps,
    ref,
    value: handleArrayToString(inputOptions.value),
    defaultValue: handleArrayToString(defaultValue),
    ...bindEvents(events, handleCallback),
  });

  const content = (
    <>
      {beforeLabelNode}
      {prefixNode}
      {main}
      {suffixNode}
      {afterLabelNode}
    </>
  );

  const container = renderContainer?.({...childrenProps, children: content});

  return <>{container}</>;
};

Object.defineProperty(Input, 'Textarea', {value: Textarea});

export default Input as MenuType;

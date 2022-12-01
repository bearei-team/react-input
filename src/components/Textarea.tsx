import {useId, ReactNode} from 'react';
import handleEvent from '@bearei/react-util/lib/event';
import Input, {
  BaseInputProps,
  InputChangeEvent,
  InputChildrenProps,
  InputFixedProps,
  InputProps,
} from './Input';

export type BaseTextareaProps<T, E> = Omit<BaseInputProps<T, E>, 'afterLabel' | 'beforeLabel'>;
export interface TextareaProps<T, E>
  extends Omit<BaseTextareaProps<T, E> & Pick<InputProps<T, E>, 'events'>, ''> {
  /**
   * Render the card header
   */
  renderHeader?: (props: TextareaHeaderProps<T, E>) => ReactNode;

  /**
   * Render the textarea fixed
   */
  renderFixed?: (props: TextareaFixedProps<T, E>) => ReactNode;

  /**
   * Render the textarea main
   */
  renderMain?: (props: TextareaMainProps<T, E>) => ReactNode;

  /**
   * Render the textarea container
   */
  renderContainer?: (props: TextareaContainerProps<T, E>) => ReactNode;
}

export type TextareaChildrenProps<T, E> = Omit<BaseTextareaProps<T, E>, 'ref' | 'onChange'> &
  Pick<InputChildrenProps<T, E>, 'id' | 'children' | 'handleEvent'>;

export type TextareaFixedProps<T, E> = TextareaChildrenProps<T, E> &
  Pick<InputFixedProps<T, E>, 'position'>;

export type TextareaHeaderProps<T, E> = TextareaChildrenProps<T, E>;
export type TextareaMainProps<T, E> = TextareaChildrenProps<T, E> &
  Pick<BaseTextareaProps<T, E>, 'ref'>;

export type TextareaContainerProps<T, E> = TextareaChildrenProps<T, E>;

function Textarea<T, E = InputChangeEvent<T>>({
  prefix,
  suffix,
  renderFixed,
  renderHeader,
  renderContainer,
  ...props
}: TextareaProps<T, E>) {
  const id = useId();
  const childrenProps = {...props, id, handleEvent};
  const prefixNode =
    prefix && renderFixed?.({...childrenProps, position: 'before', children: prefix});

  const suffixNode =
    suffix && renderFixed?.({...childrenProps, position: 'after', children: suffix});

  const header = renderHeader?.({...childrenProps, prefix: prefixNode, suffix: suffixNode});
  const main = <Input {...props} />;
  const content = (
    <>
      {header}
      {main}
    </>
  );

  const container = renderContainer?.({...childrenProps, children: content}) ?? content;

  return <>{container}</>;
}

export default Textarea;

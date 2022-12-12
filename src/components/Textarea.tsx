import {ReactNode, useId} from 'react';
import {BaseInputProps, InputChildrenProps, InputFixedProps} from './Input';

export type BaseTextareaProps<T = HTMLInputElement> = Omit<
  BaseInputProps<T>,
  'afterLabel' | 'beforeLabel'
>;

export interface TextareaProps<T> extends BaseTextareaProps<T> {
  /**
   * Render the card header
   */
  renderHeader?: (props: TextareaHeaderProps<T>) => ReactNode;

  /**
   * Render the textarea fixed
   */
  renderFixed?: (props: TextareaFixedProps<T>) => ReactNode;

  /**
   * Render the textarea main
   */
  renderMain: (props: TextareaMainProps<T>) => ReactNode;

  /**
   * Render the textarea container
   */
  renderContainer: (props: TextareaContainerProps<T>) => ReactNode;
}

export type TextareaChildrenProps<T> = Omit<BaseTextareaProps<T>, 'ref'> &
  Pick<InputChildrenProps, 'id' | 'children'>;

export type TextareaFixedProps<T> = TextareaChildrenProps<T> & Pick<InputFixedProps, 'position'>;
export type TextareaHeaderProps<T> = TextareaChildrenProps<T>;
export interface TextareaMainProps<T>
  extends Partial<TextareaChildrenProps<T> & Pick<BaseTextareaProps<T>, 'ref'>> {
  header?: ReactNode;
}

export type TextareaContainerProps<T> = TextareaChildrenProps<T>;

const Textarea = <T extends HTMLInputElement>({
  ref,
  prefix,
  suffix,
  renderFixed,
  renderHeader,
  renderMain,
  renderContainer,
  ...props
}: TextareaProps<T>) => {
  const id = useId();
  const childrenProps = {...props, id};
  const prefixNode =
    prefix && renderFixed?.({...childrenProps, position: 'before', children: prefix});

  const suffixNode =
    suffix && renderFixed?.({...childrenProps, position: 'after', children: suffix});

  const header = renderHeader?.({...childrenProps, prefix: prefixNode, suffix: suffixNode});
  const main = renderMain({...childrenProps, ref, header});
  const container = renderContainer({...childrenProps, children: main});

  return <>{container}</>;
};

export default Textarea;

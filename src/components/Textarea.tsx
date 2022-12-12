import omit from '@bearei/react-util/lib/omit';
import {ReactNode, useId} from 'react';
import Input, {BaseInputProps, InputChildrenProps, InputFixedProps} from './Input';

export type BaseTextareaProps<T = HTMLElement> = Omit<
  BaseInputProps<T>,
  'afterLabel' | 'beforeLabel'
>;

export interface TextareaProps<T> extends BaseTextareaProps<T> {
  /**
   * Render the card header
   */
  renderHeader?: (props: TextareaHeaderProps) => ReactNode;

  /**
   * Render the textarea fixed
   */
  renderFixed?: (props: TextareaFixedProps) => ReactNode;

  /**
   * Render the textarea main
   */
  renderMain?: (props: TextareaMainProps<T>) => ReactNode;

  /**
   * Render the textarea container
   */
  renderContainer?: (props: TextareaContainerProps) => ReactNode;
}

export type TextareaChildrenProps = Omit<BaseTextareaProps, 'ref' | 'onChange'> &
  Pick<InputChildrenProps, 'id' | 'children' | 'onChange'>;

export type TextareaFixedProps = TextareaChildrenProps & Pick<InputFixedProps, 'position'>;
export type TextareaHeaderProps = TextareaChildrenProps;
export type TextareaMainProps<T> = TextareaChildrenProps & Pick<BaseTextareaProps<T>, 'ref'>;
export type TextareaContainerProps = TextareaChildrenProps;

const Textarea = <T extends HTMLElement>({
  prefix,
  suffix,
  renderFixed,
  renderHeader,
  renderMain,
  renderContainer,
  ...props
}: TextareaProps<T>) => {
  const id = useId();
  const childrenProps = {
    ...omit(props, ['onChange', 'onFocus', 'onBlur']),
    id,
  };

  const prefixNode =
    prefix && renderFixed?.({...childrenProps, position: 'before', children: prefix});

  const suffixNode =
    suffix && renderFixed?.({...childrenProps, position: 'after', children: suffix});

  const header = renderHeader?.({...childrenProps, prefix: prefixNode, suffix: suffixNode});
  const main = (
    <Input {...props} renderMain={renderMain} renderContainer={({children}) => children} />
  );

  const content = (
    <>
      {header}
      {main}
    </>
  );

  const container = renderContainer?.({...childrenProps, children: content});

  return <>{container}</>;
};

export default Textarea;

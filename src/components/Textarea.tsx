import omit from '@bearei/react-util/lib/omit';
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
  renderHeader?: (props: TextareaHeaderProps) => ReactNode;

  /**
   * Render the textarea fixed
   */
  renderFixed?: (props: TextareaFixedProps) => ReactNode;

  /**
   * Render the textarea main
   */
  renderMain: (props: TextareaMainProps<T>) => ReactNode;

  /**
   * Render the textarea container
   */
  renderContainer: (props: TextareaContainerProps) => ReactNode;
}

export type TextareaChildrenProps = Omit<BaseTextareaProps, 'ref' | 'onChange'> &
  Pick<InputChildrenProps, 'id' | 'children' | 'onChange'>;

export type TextareaFixedProps = TextareaChildrenProps & Pick<InputFixedProps, 'position'>;
export type TextareaHeaderProps = TextareaChildrenProps;
export interface TextareaMainProps<T>
  extends Partial<TextareaChildrenProps & Pick<BaseTextareaProps<T>, 'ref'>> {
  header?: ReactNode;
}

export type TextareaContainerProps = TextareaChildrenProps;

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
  const childrenProps = {
    ...omit(props, ['onChange', 'onFocus', 'onBlur']),
    id,
  };

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

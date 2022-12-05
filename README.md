# react-input

Base input components that support React and React native

## Installation

> yarn add @bearei/react-input --save

## Parameters

#### Input Options

| Name | Type | Required | Description |
| :-- | --: | --: | :-- |
| value | `string` | ✘ | Input box value |
| event | `ChangeEvent` `NativeSyntheticEvent` | ✘ | That triggers a change in the value of the input field |

#### Input

| Name | Type | Required | Description |
| :-- | --: | --: | :-- |
| noStyle | `boolean` | ✘ | Set whether the input box is unstyled |
| afterLabel | `ReactNode` | ✘ | The label at the back of the input box |
| beforeLabel | `ReactNode` | ✘ | The label in front of the input box |
| prefix | `ReactNode` | ✘ | Input box prefix |
| suffix | `ReactNode` | ✘ | Input box suffix |
| value | `string` | ✘ | Input box value |
| defaultValue | `string` | ✘ | Default values for input box |
| disabled | `boolean` | ✘ | Whether to disable input box |
| loading | `boolean` | ✘ | Whether the input box is loading |
| size | `small` `medium` `large` | ✘ | Set the input box size |
| shape | `square` `circle` `round` | ✘ | Set the input box shape |
| status | `normal` `error` `warning` | ✘ | Set the input box status |
| onChange | `(options: InputOptions) => void` | ✘ | This function is called when the input field value changes |
| onValueChange | `onValueChange?: (value?: string) => void` | ✘ | Call back this function when the input box value changes |
| onFocus | `(e: FocusEvent) => void` `(e: NativeSyntheticEvent<TextInputFocusEventData>) => void` | ✘ | This function is called when the input box gets the focus |
| onBlur | `(e: FocusEvent) => void` `(e: NativeSyntheticEvent<TextInputFocusEventData>) => void` | ✘ | This function is called when the input field loses focus |
| renderLabel | `(props: InputLabelProps) => ReactNode` | ✘ | Render the input box label |
| renderFixed | `(props: InputFixedProps) => ReactNode` | ✘ | Render the input box fixed |
| renderMain | `(props: InputMainProps) => ReactNode` | ✘ | Render the input box main |
| renderContainer | `(props: InputContainerProps) => ReactNode` | ✘ | Render the input box container |

## Use

```typescript
import React from 'React';
import ReactDOM from 'react-dom';
import Input from '@bearei/react-input';

const input = (
  <Input<HTMLInputElement>
    prefix="before"
    suffix="after"
    afterLabel="after"
    beforeLabel="before"
    onChange={() => {}}
    renderContainer={({id, children}) => (
      <div data-cy="container" id={id} tabIndex={1}>
        {children}
      </div>
    )}
    renderLabel={({position, children}) => <span data-cy={`label-${position}`}>{children}</span>}
    renderFixed={({position, children}) => <span data-cy={`fixed-${position}`}>{children}</span>}
    renderMain={({id, ...props}) => (
      <input {...pickHTMLAttributes(props)} data-cy="input" data-id={id} />
    )}
  />
);

ReactDOM.render(input, container);
```

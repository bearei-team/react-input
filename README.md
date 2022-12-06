# react-input

Base input components that support React and React native

## Installation

> yarn add @bearei/react-input --save

## Parameters

#### Input Options

| Name  |                Type | Required | Description                                            |
| :---- | ------------------: | -------: | :----------------------------------------------------- |
| value | `string` `string[]` |        ✘ | Input value                                            |
| event |           `unknown` |        ✘ | That triggers a change in the value of the input field |

#### Input

| Name | Type | Required | Description |
| :-- | --: | --: | :-- |
| value | `string` `string[]` | ✘ | Input value |
| defaultValue | `string` | ✘ | The default value for the input |
| noStyle | `boolean` | ✘ | no style input |
| afterLabel | `ReactNode` | ✘ | The label at the back of the input |
| beforeLabel | `ReactNode` | ✘ | The label in front of the input |
| prefix | `ReactNode` | ✘ | Input prefix |
| suffix | `ReactNode` | ✘ | Input suffix |
| disabled | `boolean` | ✘ | Whether to disable input |
| loading | `boolean` | ✘ | Whether or not to disable the input |
| size | `small` `medium` `large` | ✘ | Input size |
| shape | `square` `circle` `round` | ✘ | Input shape |
| status | `normal` `error` `warning` | ✘ | Input status |
| onChange | `(options: InputOptions) => void` | ✘ | This function is called when the input option changes |
| onFocus | `(e: React.FocusEvent) => void` | ✘ | This function is called when the input gets the focus |
| onBlur | `(e: React.FocusEvent) => void` | ✘ | This function is called when the input loses focus |
| onValueChange | `(value:string) => void` | ✘ | This function is called when the input value changes |
| renderLabel | `(props:InputLabelProps) => void` | ✘ | Render the input label |
| renderFixed | `(props:InputFixedProps) => void` | ✘ | Render the input fixed |
| renderMain | `(props:InputMainProps) => void` | ✘ | Render the input main |
| renderContainer | `(props:InputContainerProps) => void` | ✘ | Render the input container |

## Use

```typescript
import React from 'React';
import ReactDOM from 'react-dom';
import Input from '@bearei/react-input';

const input = (
  <Input
    prefix="before"
    suffix="after"
    afterLabel="after"
    beforeLabel="before"
    onChange={() => {}}
    renderContainer={({id, children}) => (
      <div id={id} tabIndex={1}>
        {children}
      </div>
    )}
    renderLabel={({position, children}) => <span>{children}</span>}
    renderFixed={({position, children}) => <span>{children}</span>}
    renderMain={({id, ...props}) => <input {...props} data-id={id} />}
  />
);

ReactDOM.render(input, container);
```

# react-input

A basic input component that supports react and native react.

## Installation

> yarn add @bearei/react-input --save

## Parameters

| Name | Type | Required | Description |
| :-- | --: | --: | :-- |
| afterLabel | ReactNode | ✘ | An input box with a prefix label |
| beforeLabel | ReactNode | ✘ | An input box with a suffix label |
| prefix | ReactNode | ✘ | An input box with a prefix |
| suffix | ReactNode | ✘ | An input box with a suffix |
| value | string | ✘ | Set the value of the input box |
| defaultValue | string | ✘ | Set the default value for the input box |
| disabled | boolean | ✘ | Whether or not to disable the input box |
| loading | boolean | ✘ | Whether the button is loading |
| size | 'small','medium','large' | ✘ | Set the input box size |
| shape | 'square','circle','round' | ✘ | Set the input box shape |
| status | 'normal','error','warning' | ✘ | Sets the input box validation status |
| renderLabel | function(props,element) | ✘ | Renders the input box prefix label or suffix label |
| renderFixed | function(props,element) | ✘ | Render input box prefix or suffix |
| renderContainer | function(props,element) | ✘ | Render the input box container |
| renderMain | function(props) | ✘ | Render the input box main |
| onChange | function(e,value) | ✘ | A callback when the contents of an input box change |
| onFocus | function(e) | ✘ | The callback when the input box gets focus |
| onBlur | function(e) | ✘ | Callback when the input box loses focus |

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
    renderContainer={({id}, element) => (
      <div data-cy="container" id={id} tabIndex={1}>
        {element}
      </div>
    )}
    renderLabel={({position}, element) => <span data-cy={`label-${position}`}>{element}</span>}
    renderFixed={({position}, element) => <span data-cy={`fixed-${position}`}>{element}</span>}
    renderMain={({size, id, ...props}) => <input {...props} data-cy="input" data-id={id} />}
  />
);

ReactDOM.render(input, container);
```

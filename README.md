# react-input

A basic input component that supports react and native react.

## Installation

> yarn add @bearei/react-input --save

## Use

```typescript
import React from 'React';
import ReactDOM from 'react-dom';
import {Input} from '@bearei/react-input';

const input = (
  <Input
    prefix="prefix"
    suffix="suffix"
    renderContainer={(id, element) => <div id={id}>{element}</div>}
    renderInner={element => <div>{element}</div>}
    renderFix={(fixType, element) => <span>{element}</span>}
    renderChildren={childrenProps => <input {...childrenProps} />}
  />
);

ReactDOM.render(input, container);
```

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
    prefix="before"
    suffix="after"
    renderContainer={({id}, element) => (
      <div data-cy="container" id={id} tabIndex={1}>
        {element}
      </div>
    )}
    renderInner={(_props, element) => (
      <div data-cy="inner" tabIndex={1}>
        {element}
      </div>
    )}
    renderFixed={({position}, element) => <span data-cy={`${position}`}>{element}</span>}
    renderChildren={props => <input data-cy="input" {...props} />}
  />
);

ReactDOM.render(input, container);
```

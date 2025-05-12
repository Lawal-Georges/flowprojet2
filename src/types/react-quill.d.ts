// types/react-quill.d.ts
declare module 'react-quill' {
    import { Component } from 'react';
  
    export interface ReactQuillProps {
      value: string;
      onChange: (value: string) => void;
      [key: string]: unknown;
    }
  
    class ReactQuill extends Component<ReactQuillProps> {}
  
    export default ReactQuill;
  }
  
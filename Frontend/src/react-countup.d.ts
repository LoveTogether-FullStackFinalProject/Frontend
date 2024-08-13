declare module 'react-countup' {
    import { ComponentType } from 'react';
  
    interface CountUpProps {
      end: number;
      start?: number;
      duration?: number;
      delay?: number;
      prefix?: string;
      suffix?: string;
      decimals?: number;
      decimal?: string;
      separator?: string;
      useEasing?: boolean;
      easingFn?: (t: number, b: number, c: number, d: number) => number;
      formattingFn?: (value: number) => string;
      onStart?: () => void;
      onEnd?: () => void;
      onPauseResume?: () => void;
      onReset?: () => void;
      onUpdate?: () => void;
    }
  
    const CountUp: ComponentType<CountUpProps>;
  
    export default CountUp;
  }
  
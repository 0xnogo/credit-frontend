import { RefObject, useEffect, useRef } from 'react';

export type AnimatedTransformProps = {
  speed: number;
  milliseconds: number;
  falloff: number;
  finalValue: number;
  ref: RefObject<HTMLElement>;
};

export function useAnimatedTransform(
  { speed, milliseconds, falloff, finalValue, ref }: AnimatedTransformProps,
  playSound: (currentPosition: number) => void,
  afterAnimationComplete: () => void,
) {
  const transform = useRef(0);
  const animationGatedRef = useRef(true);

  const animate = () => {
    if (ref.current && animationGatedRef.current) {
      if (transform.current < finalValue) {
        const normalizedData = transform.current / finalValue;

        transform.current =
          transform.current + (speed - normalizedData * speed);
        ref.current.style.transform = `translateX(-${transform.current}px)`;
        playSound(transform.current);
        //we move upto 5 decimals. If we allow max decimals, the animation will take a minute to finish
        if (normalizedData < 0.9999) {
          requestAnimationFrame(animate);
        } else {
          afterAnimationComplete();
        }
      } else {
        transform.current = 0;
        ref.current.style.transform = `translateX(0)`;
        requestAnimationFrame(animate);
      }
    }
  };

  useEffect(() => {
    transform.current = 0;
    animationGatedRef.current = false;
    setTimeout(() => {
      animationGatedRef.current = true;
      if (ref.current) ref.current.style.transform = `translateX(0px)`;
      if (speed && milliseconds && finalValue) {
        requestAnimationFrame(animate);
      }
    });
  }, [speed, falloff, milliseconds, finalValue, ref]);

  return `translateX(-${transform.current}px)`;
}

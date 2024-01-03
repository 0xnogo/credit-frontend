import { useEffect, useMemo, useRef, useState } from 'react';
import { SlotContainer } from '../../components/gtm/spin/SlotContainer';
import {
  AnimatedTransformProps,
  useAnimatedTransform,
} from './useAnimatedTransform';
import { useWindowSize } from '../useWindowSize';
import { LayeredAudio } from '@/lib/layeredAudio';
import { returnRewardDisplay } from '@/lib/weightedRandom';
import { Reward, SelectorProperties } from 'types/gtm';

type LootBoxProps = {
  slotWidths: Record<any, any>;
  slotHeights: Record<any, any>;
  rewards: Reward[];
  probabilities: number[];
  slotSpacing?: number;
  numScreens?: number;
  selectorProperties?: SelectorProperties;
  queries: number[];
  onCompleteHandler: (reward: any) => void;
  soundURL?: string;
};

function randomIntFromInterval(min: number, max: number) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

//TODO - Only render the slots currently showing on screen
export function useLootboxModule({
  slotWidths,
  queries,
  slotHeights,
  rewards,
  probabilities,
  slotSpacing = 10,
  numScreens = 20,
  selectorProperties,
  onCompleteHandler,
  soundURL,
}: LootBoxProps) {
  const [slotBuffer, setSlotBuffer] = useState<Reward[]>([]);
  const containerRef = useRef<HTMLElement>(null);
  const slotRef = useRef<HTMLElement>(null);
  const rewardRef = useRef<any>(null);
  const selectorRef = useRef<HTMLImageElement>(null);
  const slotIndexRef = useRef(0);
  const [audio] = useState(new LayeredAudio(soundURL as string));
  const [animState, setAnimState] = useState<AnimatedTransformProps>({
    speed: 0,
    milliseconds: 0,
    falloff: 0,
    finalValue: 0,
    ref: slotRef,
  });
  const [{ isRunning }, setState] = useState({
    isRunning: false,
  });

  const [width] = useWindowSize();

  const currentHitQuery = useMemo(() => {
    let query = 0;
    queries.forEach((currentQuery) => {
      if (width >= currentQuery) {
        query = currentQuery;
      }
    });
    return query;
  }, [width, queries]);

  const slotWidth = slotWidths[currentHitQuery];

  const slotHeight = slotHeights[currentHitQuery];

  const playSound = (currentPosition: number) => {
    const width = containerRef.current?.offsetWidth ?? 0;

    const currentSlot = Math.floor((currentPosition + width / 2) / slotWidth);

    if (slotIndexRef.current < currentSlot) {
      slotIndexRef.current = currentSlot;
      audio.play();
    }
  };

  useAnimatedTransform(animState, playSound, () => {
    setState({
      isRunning: false,
    });
    onCompleteHandler(rewardRef.current);
    rewardRef.current = undefined;
  });

  const totalWidthPerSlot = slotWidth + slotSpacing;

  const getNumItemsInScreen = (slotWidth: number) => {
    const width = containerRef.current?.offsetWidth ?? 0;
    return Math.ceil(width / slotWidth);
  };

  const initSlotBuffer = (animate?: Boolean) => {
    setState({
      isRunning: false,
    });
    const width = containerRef.current?.offsetWidth ?? 0;
    slotIndexRef.current = width / 2 / slotWidth;
    //first, we reset the slot buffer
    const numItemsInScreen = getNumItemsInScreen(totalWidthPerSlot);
    const actualWidth = numItemsInScreen * slotWidth;
    const numItems = numItemsInScreen * numScreens;
    const randomizedArray = new Array(numItems)
      .fill(null)
      //TODO: optimize for performance
      .map(() => returnRewardDisplay(rewards, probabilities));
    setSlotBuffer(randomizedArray);
    if (animate) {
      setAnimState({
        speed: 5,
        milliseconds: 1,
        falloff: 0.8,
        finalValue:
          (actualWidth - width) / 2 +
          (numItemsInScreen % 2 === 0 ? slotWidth / 2 : 0) -
          2,
        ref: slotRef,
      });
    }
    return randomizedArray;
  };

  const reset = () => {
    rewardRef.current = null;
    resizeHandler();
  };

  const startAnimation = (prize: Reward, bufferInput?: any[]) => {
    rewardRef.current = prize;
    let usedBuffer = bufferInput ?? slotBuffer;
    const numItemsInScreen = getNumItemsInScreen(totalWidthPerSlot);
    const landingSlotIndex = usedBuffer.length - numItemsInScreen;

    setState({
      isRunning: true,
    });

    setSlotBuffer((buffer) => {
      let temp = usedBuffer ?? buffer;
      temp[landingSlotIndex] = prize;
      return temp;
    });

    setAnimState({
      speed: 100,
      milliseconds: 1,
      falloff: 0.99,
      finalValue:
        landingSlotIndex * slotWidth -
        //account for it being centered initially
        ((containerRef.current?.offsetWidth ?? 0) / 2 -
          //should be able to land anywhere within the chosen slot
          randomIntFromInterval(slotWidth / 4, (slotWidth * 2) / 3)),
      ref: slotRef,
    });
  };

  const resizeHandler = () => {
    setAnimState({
      speed: 0,
      milliseconds: 0,
      falloff: 0,
      finalValue: 0,
      ref: slotRef,
    });
    const buffer = initSlotBuffer(true);

    if (rewardRef.current) {
      startAnimation(rewardRef.current, buffer);
    }
  };

  useEffect(() => {
    resizeHandler();
  }, [width]);

  return {
    component: (
      <SlotContainer
        currentHitQuery={currentHitQuery}
        selectorRef={selectorRef}
        slotRef={slotRef}
        selectorProperties={selectorProperties}
        numItems={slotBuffer.length}
        buffer={slotBuffer}
        slotHeight={slotHeight}
        slotWidth={slotWidth}
        slotSpacing={slotSpacing}
      />
    ),
    containerRef,
    startAnimation,
    isRunning,
    reset,
  };
}

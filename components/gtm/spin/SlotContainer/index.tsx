import { Reward, SelectorProperties } from 'types/gtm';
import { SlotItem } from './SlotItem';
import { Box } from '@mui/material';
import Image from 'next/image';
import { slotPaddingProperties } from '@constants/gtm';

type SlotContainerProps = {
  buffer: Reward[];
  slotWidth: number;
  slotHeight: number;
  numItems: number;
  slotSpacing: number;
  selectorProperties?: SelectorProperties;
  slotRef: any;
  selectorRef: any;
  currentHitQuery: number;
};

export function SlotContainer({
  currentHitQuery,
  buffer,
  slotWidth,
  slotHeight,
  numItems,
  slotSpacing,
  selectorProperties,
  slotRef,
  selectorRef,
}: SlotContainerProps) {
  const selectorHeight = selectorProperties?.heights[currentHitQuery];

  const paddingProperties = slotPaddingProperties[currentHitQuery];

  return (
    <Box position="relative" height="max-content">
      <Box
        ref={slotRef}
        style={{
          width: numItems * slotWidth,
          height: slotHeight,
          display: 'flex',
          flexShrink: '0',
          position: 'relative',
          gap: slotSpacing,
        }}
      >
        {buffer.map((item, index) => (
          <SlotItem
            key={index + item.name}
            width={slotWidth}
            height={slotHeight}
            index={index}
            item={item}
            paddingProperties={paddingProperties}
          />
        ))}
      </Box>

      {selectorProperties && (
        <Image
          alt="Selector"
          ref={selectorRef}
          width={selectorProperties.width}
          height={selectorHeight}
          src={selectorProperties.imgURI ?? ''}
          style={{
            position: 'absolute',
            top:
              selectorProperties.position === 'across'
                ? '0'
                : selectorProperties.position === 'top'
                ? -slotHeight
                : slotHeight,
            left: '50%',
            zIndex: '1',
            ...selectorProperties.style,
          }}
        />
      )}
    </Box>
  );
}

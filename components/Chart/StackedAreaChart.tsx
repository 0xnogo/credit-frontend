import { Group } from '@visx/group';
import { AreaStack, Line, LinePath } from '@visx/shape';
import { AxisLeft } from '@visx/axis';
import { scaleLinear, scaleSqrt } from '@visx/scale';
import { bisector, extent } from 'd3-array';
import { Typography, useTheme } from '@mui/material';
import { localPoint } from '@visx/event';
import { useCallback } from 'react';
import { TooltipWithBounds, useTooltip, defaultStyles } from '@visx/tooltip';
import {
  compactCurrency,
  formatCurrency,
  formatTimestampToDate,
} from '@utils/index';
interface DataPoint {
  date: number;
  [key: string]: number;
}

const x = (d: DataPoint) => new Date(d.date);

const getDate = (d: DataPoint) => d.date;

// defining tooltip styles
const tooltipStyles = {
  ...defaultStyles,
  minWidth: 60,
  backgroundColor: 'rgba(0,0,0,0.9)',
  color: 'white',
};
interface StackedAreaProps {
  width: number;
  height: number;
  colors: string[];
  areaColors: string[];
  data: DataPoint[];
  keys: string[];
  labels: string[];
}

function StackedAreaChart({
  width,
  height,
  colors,
  areaColors,
  data,
  keys,
  labels,
}: StackedAreaProps) {
  // define margins from where to start drawing the chart
  const margin = { top: 40, right: 40, bottom: 40, left: 50 };

  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;

  const maxYValue = Math.max(
    ...(data ?? []).flatMap((d: DataPoint) =>
      keys.flatMap((key, index) => d[keys[index]]),
    ),
  );
  const timeScale = scaleLinear({
    range: [0, xMax],
    domain: extent(data, getDate) as [number, number],
    nice: true,
  });
  const yScale = scaleSqrt({
    range: [yMax - 40, -40],
    nice: true,
    domain: [0, maxYValue],
  });

  const getRD = (d: DataPoint, lineIndex: number) => {
    return d[keys[lineIndex]];
  };

  const bisectDate = bisector((d: DataPoint) => d.date).left;

  const theme = useTheme();

  const {
    tooltipData,
    tooltipLeft = 0,
    tooltipTop = 0,
    showTooltip,
    hideTooltip,
  } = useTooltip<number[]>();

  const handleTooltip = useCallback(
    (event: any) => {
      const { x } = localPoint(event) || { x: 0 };
      const x0 = timeScale.invert(x - margin.left); // get Date from the scale

      const index = bisectDate(data, x0, 1);

      const d0 = data[index - 1];
      const d1 = data[index];

      let d = d0;
      if (d1 && getDate(d1)) {
        d =
          x0.valueOf() - getDate(d0).valueOf() >
          getDate(d1).valueOf() - x0.valueOf()
            ? d1
            : d0;
      }

      const rdArray = keys.map((_, index) => getRD(d, index));

      showTooltip({
        tooltipData: [...rdArray, d.date],
        tooltipLeft: x,
        tooltipTop: yScale(rdArray[0]),
      });
    },
    [timeScale, bisectDate, data, getDate, getRD, yScale],
  );

  return (
    <>
      <svg width={width} height={height - 40} style={{ paddingTop: '40px' }}>
        <Group top={margin.top} left={margin.left}>
          <AxisLeft
            scale={yScale}
            stroke={'#8D8D8D'}
            tickStroke={'#393939'}
            tickLabelProps={() => ({
              fill: '#8D8D8D',
              fontSize: 11,
              textAnchor: 'end',
              fontFamily: theme.typography['body-small-regular'].fontFamily,
            })}
            tickFormat={function tickFormat(d) {
              return compactCurrency(d);
            }}
          />
          <AreaStack
            keys={keys}
            data={data}
            stroke="white"
            strokeWidth={2}
            x={(d) => timeScale(x(d.data))}
            y0={(d) => yScale(d[0])}
            y1={(d) => yScale(d[1])}
          >
            {({ stacks, path }) =>
              stacks.map((stack, index) => (
                <path
                  d={path(stack) || ''}
                  key={`stack-${stack.key}`}
                  stroke={colors[index]}
                  fill={areaColors[index]}
                  strokeWidth={0}
                />
              ))
            }
          </AreaStack>
          <LinePath
            stroke={colors[0]}
            strokeWidth={3}
            data={data}
            x={(d) => timeScale(getDate(d)) ?? 0}
            y={(d) => yScale(d[keys[0]])}
          />
          <LinePath
            stroke={colors[1]}
            strokeWidth={3}
            data={data}
            x={(d) => timeScale(getDate(d)) ?? 0}
            y={(d) => yScale(d[keys[1]])}
          />
          {tooltipData && (
            <g>
              <Line
                from={{ x: tooltipLeft - margin.left, y: -40 }}
                to={{ x: tooltipLeft - margin.left, y: yMax - 40 }}
                stroke={'#EDF2F7'}
                strokeWidth={2}
                pointerEvents="none"
                strokeDasharray="4,2"
              />
            </g>
          )}
          <rect
            x={0}
            y={0}
            width={innerWidth}
            height={innerHeight}
            onTouchStart={handleTooltip}
            fill={'transparent'}
            onTouchMove={handleTooltip}
            onMouseMove={handleTooltip}
            onMouseLeave={() => hideTooltip()}
          />
        </Group>
      </svg>
      {tooltipData ? (
        <TooltipWithBounds
          key={Math.random()}
          top={tooltipTop}
          left={tooltipLeft}
          style={{
            ...tooltipStyles,
            borderRadius: '12px',
            backgroundColor: theme.palette.neutrals[100],
          }}
        >
          {keys.map((_, index) => (
            <>
              <Typography
                key={index}
                variant="body-small-regular"
                display="block"
              >{`${labels[index]}: $${formatCurrency(
                tooltipData[index],
                2,
              )}`}</Typography>
            </>
          ))}

          <Typography
            variant="body-small-regular"
            display="block"
          >{`Date: ${formatTimestampToDate(
            tooltipData[tooltipData.length - 1] * 1000,
          )}`}</Typography>
        </TooltipWithBounds>
      ) : null}
    </>
  );
}

export default StackedAreaChart;

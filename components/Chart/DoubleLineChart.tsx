import { useCallback } from "react";
import { Group } from "@visx/group";
import {
  scaleBand,
  scaleLinear,
  scaleLog,
  scaleOrdinal,
  scalePoint,
  scalePower,
  scaleQuantile,
  scaleRadial,
  scaleSqrt,
  scaleSymlog,
  scaleThreshold,
  scaleTime,
} from "@visx/scale";
import { AxisLeft } from "@visx/axis";
import { Line, LinePath } from "@visx/shape";
import { extent, bisector } from "d3-array";
import { LinearGradient } from "@visx/gradient";
import { GridRows } from "@visx/grid";
import { useTooltip, TooltipWithBounds, defaultStyles } from "@visx/tooltip";
import { localPoint } from "@visx/event";
import {
  compactCurrency,
  formatCurrency,
  formatTimestampToDate,
} from "@utils/index";
import * as allCurves from "@visx/curve";
import { Box, Typography, useTheme } from "@mui/material";
import BigNumber from "bignumber.js";

interface DataPoint {
  date: number;
  [key: string]: number;
}

interface DoubleLineChartProps {
  width: number;
  height: number;
  series: DataPoint[];
  keys: string[];
  labels: string[];
  colors: string[];
  dataType?: "dollars" | "percentage";
}

function DoubleLineChart({
  series,
  width,
  height,
  keys,
  labels,
  colors,
  dataType = "dollars",
}: DoubleLineChartProps) {
  const theme = useTheme();

  const maxYValue = Math.max(
    ...(series ?? []).flatMap((d: DataPoint) =>
      keys.flatMap((key, index) => d[keys[index]])
    )
  );

  // tooltip parameters
  const {
    tooltipData,
    tooltipLeft = 0,
    tooltipTop = 0,
    showTooltip,
    hideTooltip,
  } = useTooltip<number[]>();

  // define margins from where to start drawing the chart
  const margin = { top: 40, right: 40, bottom: 40, left: 50 };

  // defining inner measurements
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // Defining selector functions
  const getRD = (d: DataPoint, lineIndex: number) => {
    return d[keys[lineIndex]];
  };
  const getDate = (d: DataPoint) => d.date;
  const bisectDate = bisector((d: DataPoint) => d.date).left;

  // Defining scales
  // horizontal, x scale
  const timeScale = scaleLinear({
    range: [0, innerWidth],
    domain: extent(series, getDate) as [number, number],
    nice: true,
  });

  // vertical, y scale
  const rdScale = scaleSqrt({
    range: [innerHeight, 0],
    domain: [0, maxYValue],
  });

  // defining tooltip styles
  const tooltipStyles = {
    ...defaultStyles,
    minWidth: 60,
    backgroundColor: "rgba(0,0,0,0.9)",
    color: "white",
  };

  const handleTooltip = useCallback(
    (event: any) => {
      const { x } = localPoint(event) || { x: 0 };
      const x0 = timeScale.invert(x - margin.left); // get Date from the scale

      const index = bisectDate(series, x0, 1);

      const d0 = series[index - 1];
      const d1 = series[index];

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
        tooltipTop: rdScale(rdArray[0]),
      });
    },
    [timeScale, bisectDate, series, getDate, getRD, rdScale]
  );

  return (
    <Box style={{ position: "relative" }}>
      <svg width={width} height={height}>
        <Group left={margin.left} top={margin.top}>
          <GridRows
            scale={rdScale}
            width={innerWidth}
            height={innerHeight - margin.top}
            stroke="#393939"
            strokeOpacity={0.2}
            numTicks={4}
          />
          <LinearGradient
            id="area-gradient"
            from={"#43b284"}
            to={"#43b284"}
            toOpacity={0.1}
          />
          <AxisLeft
            stroke={"#8D8D8D"}
            tickStroke={"#393939"}
            scale={rdScale}
            tickLabelProps={() => ({
              fill: "#8D8D8D",
              fontSize: 11,
              textAnchor: "end",
              fontFamily: theme.typography["body-small-regular"].fontFamily,
            })}
            numTicks={4}
            tickFormat={function tickFormat(d) {
              return compactCurrency(d);
            }}
          />

          {keys.map((key, index) => (
            <>
              <LinePath
                key={`${key}-linePath`}
                curve={allCurves.curveLinear}
                stroke={colors[index]}
                strokeWidth={3}
                data={series}
                x={(d) => timeScale(getDate(d)) ?? 0}
                y={(d) => rdScale(getRD(d, index)) ?? 0}
              />
            </>
          ))}

          {tooltipData && (
            <g>
              <Line
                from={{ x: tooltipLeft - margin.left, y: 0 }}
                to={{ x: tooltipLeft - margin.left, y: innerHeight }}
                stroke={"#EDF2F7"}
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
            fill={"transparent"}
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
            borderRadius: "12px",
            backgroundColor: theme.palette.neutrals[100],
          }}
        >
          {keys.map((_, index) => (
            <Typography
              key={`${index}-Typography`}
              variant="body-small-regular"
              display="block"
            >{`${labels[index]}: ${
              dataType === "dollars" ? "$" : ""
            }${formatCurrency(tooltipData[index], 2)}${
              dataType === "percentage" ? "%" : ""
            }`}</Typography>
          ))}

          <Typography
            variant="body-small-regular"
            display="block"
          >{`Date: ${formatTimestampToDate(
            tooltipData[tooltipData.length - 1] * 1000
          )}`}</Typography>
        </TooltipWithBounds>
      ) : null}
    </Box>
  );
}

export default DoubleLineChart;

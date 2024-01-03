//@ts-nocheck
import { AreaClosed, Bar } from "@visx/shape";
import { Tooltip, defaultStyles, withTooltip } from "@visx/tooltip";
import { scaleLinear, scaleTime } from "@visx/scale";
import { useCallback, useEffect, useMemo, useState } from "react";
import ChartOverlay from "./ChartOverlay";
import { Group } from "@visx/group";
import { bisector, max } from "d3-array";
import { localPoint } from "@visx/event";
import millify from "millify";
import { timeFormat } from "d3-time-format";
import { Box } from "@mui/material";
import generateDateValue from "@visx/mock-data/lib/generators/genDateValue";
import { curveNatural } from "@visx/curve";
import { currencyFormatter, oneMonth, oneWeek } from "@graph/core";
import { LinearGradient } from "@visx/gradient";
import BigNumber from "bignumber.js";

const series = new Array<ChartData>(1)
  .fill({ date: new Date(0), value: 0 }) // Initialize with a default ChartData object
  .map((_, i) =>
    generateDateValue(25, i / 72).sort(
      (a, b) => a.date.getTime() - b.date.getTime()
    )
  );
const allData = series.reduce((rec, d) => rec.concat(d), []);

const tooltipStyles = {
  ...defaultStyles,
  background: "#fff",
  border: "1px solid white",
  color: "white",
};

interface ChartData {
  date: Date | null;
  value?: number;
  volumeUSD?: number;
}

export interface Overlay {
  title: string;
  value: string;
  date: Date | number | null;
}

interface AreaChartProps {
  data?: ChartData[];
  tooltipDisabled?: boolean;
  overlayEnabled?: boolean;
  title?: string;
  width?: number;
  height?: number;
  showTooltip?: boolean;
  tooltipData?: ChartData;
  tooltipTop?: number;
  tooltipLeft?: number;
  timestamp?: {
    currentTarget: {
      value: string;
    };
  };
  gradientHash?: string;
  onTimespanChange?: (timestamp: string) => void;
  margin?: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  fromColor?: string;
  toColor?: string;
}

const formatDate = timeFormat("%b %d, '%y");

function AreaChart({
  data: initialData,
  tooltipDisabled = false,
  overlayEnabled = false,
  title = "",
  width = 0,
  height = 0,
  showTooltip,
  tooltipData,
  tooltipTop = 0,
  tooltipLeft = 0,
  timestamp = {
    currentTarget: {
      value: "ALL",
    },
  },
  gradientHash = "hm",
  onTimespanChange = () => null,
  margin = {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  fromColor = "#98FFFF",
  toColor = "#98FFFF",
}: AreaChartProps) {
  let emptyData = false;
  let data = initialData;
  if (!data) {
    data = allData;
    emptyData = true;
  }
  const [timespan, setTimespan] = useState(oneMonth());

  useMemo(() => {
    if (timestamp?.currentTarget.value === "ALL") {
      setTimespan(62802180);
    } else if (timestamp?.currentTarget.value === "1W") {
      setTimespan(oneWeek());
    } else if (timestamp?.currentTarget.value === "1M") {
      setTimespan(oneMonth());
    }
  }, [timestamp?.currentTarget.value]);

  const getDate = (d: ChartData | undefined) => new Date(d?.date ?? 0);
  const bisectDate = bisector<ChartData, Date>((d) => new Date(d.date ?? 0))
    .left;
  const getValue = (d: ChartData) => (d && d.value !== undefined ? d.value : 0);

  data = data.filter((d) => timespan <= Number(d.date));
  const lastData = data.length > 1 ? data[data.length - 1] : null;
  const lastDataValue = lastData ? (lastData.value ? lastData.value : 0) : 0;
  const [overlay, setOverlay] = useState({
    title,
    value: currencyFormatter.format(lastDataValue),
    date: lastData ? lastData.date : 0,
  });

  useEffect(() => {
    setOverlay({
      title,
      value: currencyFormatter.format(lastDataValue),
      date: lastData ? lastData.date : 0,
    });
  }, [lastDataValue, lastData, title]);

  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const xScale = useMemo(
    () =>
      scaleTime({
        range: [0, innerWidth],
        domain: [
          Math.min(...(data?.map((d) => Number(getDate(d))) ?? [])),
          Math.max(...(data?.map((d) => Number(getDate(d))) ?? [])),
        ],
      }),
    [innerWidth, data]
  );

  const yScale = useMemo(
    () =>
      scaleLinear({
        range: [innerHeight, 0],
        domain: [
          new BigNumber(Math.min(...(data?.map((d) => getValue(d)) ?? [])))
            .times(0.9)
            .toNumber(),
          new BigNumber(Math.max(...(data?.map((d) => getValue(d)) ?? [])))
            .times(1.1)
            .toNumber(),
        ],
        nice: true,
      }),
    [innerHeight, data]
  );

  const handleTooltip = useCallback(
    (
      event:
        | React.TouchEvent<Element>
        | React.MouseEvent<SVGRectElement, MouseEvent>
    ) => {
      if (showTooltip !== undefined) {
        const { x } = localPoint(event) || { x: 0 };
        const x0 = xScale.invert(x);
        const index = bisectDate(data ?? [], x0, 1);
        const d0 = data?.[index - 1];
        const d1 = data?.[index];
        let d = d0;
        if (d1 && getDate(d1)) {
          d =
            x0.valueOf() - (getDate(d0) || 0).valueOf() >
            (getDate(d1) || 0).valueOf() - x0.valueOf()
              ? d1
              : d0;
        }
        const lastDataValue = d ? (d.value !== undefined ? d.value : 0) : 0;
        setOverlay({
          ...overlay,
          value: currencyFormatter.format(lastDataValue),
          date: d && d.date !== undefined ? d.date : 0,
        });
      }
    },
    [showTooltip, xScale, overlay, data, bisectDate]
  );

  if (width < 10) return null;

  function handleTimespanChange(e: React.ChangeEvent<HTMLSelectElement>) {
    if (e.currentTarget.value === "ALL") {
      setTimespan(62802180);
    } else if (e.currentTarget.value === "1W") {
      setTimespan(oneWeek());
    } else if (e.currentTarget.value === "1M") {
      setTimespan(oneMonth());
    }
  }

  return (
    <Box>
      {!emptyData && overlayEnabled && data.length > 0 && (
        <Box paddingTop="20px">
          <ChartOverlay
            overlay={overlay}
            onTimespanChange={handleTimespanChange}
          />
        </Box>
      )}
      <svg width={width} height={height}>
        <LinearGradient
          id={gradientHash}
          from={fromColor}
          to={toColor}
          toOpacity={0}
        />
        <Group>
          <AreaClosed
            curve={curveNatural}
            data={data}
            x={(d) => xScale(getDate(d))}
            y={(d) => yScale(getValue(d))}
            yScale={yScale}
            fill={`url(#${gradientHash})`}
          />
        </Group>
        <Bar
          x={0}
          y={0}
          width={width}
          height={height}
          fill="transparent"
          rx={14}
          onTouchStart={handleTooltip}
          onTouchMove={handleTooltip}
          onMouseMove={handleTooltip}
          onMouseLeave={() => {
            const lastDataValue =
              data && data.length > 0
                ? data[data.length - 1].value !== undefined
                  ? data[data.length - 1].value
                  : 0
                : 0;
            setOverlay({
              ...overlay,
              value: currencyFormatter.format(lastDataValue || 0),
              date: data && data.length ? data[data.length - 1].date : 0,
            });
          }}
        />
      </svg>
      {!tooltipDisabled && tooltipData && data.length > 0 && (
        <Box>
          <Tooltip
            top={margin.top + tooltipTop - 12}
            left={tooltipLeft + 12}
            style={tooltipStyles}
          >
            {`${millify(getValue(tooltipData))}`}
          </Tooltip>
          <Tooltip
            top={innerHeight + margin.top - 14}
            left={tooltipLeft}
            style={{
              ...defaultStyles,
              minWidth: 90,
              textAlign: "center",
              transform: "translateX(-50%)",
            }}
          >
            {formatDate(getDate(tooltipData))}
          </Tooltip>
        </Box>
      )}
    </Box>
  );
}

export default withTooltip(AreaChart);

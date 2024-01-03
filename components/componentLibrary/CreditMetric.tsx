import InfoIcon from '@mui/icons-material/Info';
import {
  Box,
  Skeleton,
  Tooltip,
  Typography,
  useMediaQuery,
} from '@mui/material';

type CreditMetricProps = {
  title: string;
  data: string;
  color?: string;
  titleSize?: string;
  dataSize?: string;
  titleWeight?: string;
  borderRadius?: string;
  boxShadow?: string;
  background?: string;
  backdropFilter?: string;
  width?: string;
  gradient?: string;
  opacity?: string;
  showCircle?: boolean;
  padding?: string;
  underlined?: boolean;
  center?: boolean;
  isLoading?: boolean;
  toolTipText?: string;
};
export default function CreditMetric({
  title = 'Available Assets',
  data = '$43.56M',
  color = '#B3F7F7',
  titleSize = '14px',
  dataSize = '24px',
  titleWeight = '500',
  borderRadius = '12px',
  boxShadow = '',
  background = 'auto',
  opacity = '0.6',
  gradient,
  showCircle = false,
  padding = '0px',
  underlined = true,
  center = false,
  isLoading = false,
  toolTipText = undefined,
}: CreditMetricProps) {
  const media465 = useMediaQuery('(max-width:465px)');
  return (
    <Box
      padding={padding}
      //  style={{ maxWidth: '20%', flex: '1' }}
      sx={{
        borderRadius,
        boxShadow,
        background,
      }}
      position={'relative'}
      width="100%"
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: center ? 'center' : 'flex-start',
          padding: '0',
          gap: '4px',
          width: '100%',
          textWrap: 'noWrap',
        }}
        width="100%"
        display="flex"
      >
        <Box
          display="flex"
          alignItems="center"
          gap="6px"
          width="100%"
          justifyContent={center ? 'center' : 'initial'}
          textOverflow={'ellipsis'}
          overflow="hidden"
        >
          {showCircle && (
            <Box
              style={{
                background: gradient,
                height: '8px',
                width: '8px',
                borderRadius: '50%',
                marginRight: '8px',
              }}
            />
          )}
          <Typography
            style={{
              fontSize: titleSize,
              fontWeight: titleWeight,
              lineHeight: '150%',
              color,
              opacity,
              textOverflow: 'ellipsis',
              textAlign: center ? 'center' : 'initial',
            }}
          >
            {title}
          </Typography>
          {toolTipText && (
            <Tooltip title={toolTipText} arrow>
              <InfoIcon
                sx={{
                  color: color,
                  cursor: 'pointer',
                  fontSize: media465 ? '10px' : '20px',
                }}
              />
            </Tooltip>
          )}
        </Box>
        <Box
          style={{
            fontFamily: "'Retron2000', 'sans-serif'",
            fontStyle: 'normal',
            fontWeight: '400',
            fontSize: dataSize,
            lineHeight: '32px',
            paddingBottom: '4px',
            borderBottom: underlined ? '1px dashed #ffffff' : 'unset',
            color: '#ffffff',
            textOverflow: 'ellipsis',
            width: isLoading ? '100%' : 'initial',
            height: '32px',
          }}
        >
          {isLoading ? (
            <Skeleton
              variant="rectangular"
              animation="wave"
              width={'100%'}
              height={'100%'}
            />
          ) : (
            data
          )}
        </Box>
      </Box>
    </Box>
  );
}

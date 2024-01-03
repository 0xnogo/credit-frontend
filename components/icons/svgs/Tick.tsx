import { SvgContainer } from './SvgContainer';

export const Tick = () => {
  return (
    <SvgContainer width="24px" height="24px">
      <>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 25"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect y="0.5" width="24" height="24" rx="12" fill="#253A3A" />
          <path
            d="M8.18164 12.5002L10.9089 15.2275L15.818 10.3184"
            stroke="#98FFFF"
            stroke-width="1.09091"
            strokeLinecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </>
    </SvgContainer>
  );
};

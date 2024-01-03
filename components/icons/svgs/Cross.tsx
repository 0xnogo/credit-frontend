import { SvgContainer } from './SvgContainer';

export const Cross = () => {
  return (
    <SvgContainer width="24px" height="24px">
      <>
        <svg
          width="24"
          height="25"
          viewBox="0 0 24 25"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect y="0.5" width="24" height="24" rx="12" fill="#36252F" />
          <path
            d="M14.9163 15.4173L9.08301 9.58398"
            stroke="#FF7E7E"
            stroke-width="1.04545"
            strokeLinecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M14.9163 9.58398L9.08301 15.4173"
            stroke="#FF7E7E"
            stroke-width="1.04545"
            strokeLinecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </>
    </SvgContainer>
  );
};

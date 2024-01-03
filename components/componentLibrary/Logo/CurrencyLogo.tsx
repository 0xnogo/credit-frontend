import React, { memo, FC } from 'react';

import Logo from './Logo';
import { Token } from 'types/assets';

type CurrencyLogoProps = { token: Token; size: number };

const CurrencyLogo: FC<CurrencyLogoProps> = memo(
  ({ token, size = 24 }: CurrencyLogoProps) => {
    return <Logo src={token?.logoURI} width={size} height={size} />;
  },
);

CurrencyLogo.displayName = 'CurrencyLogo';

export default CurrencyLogo;

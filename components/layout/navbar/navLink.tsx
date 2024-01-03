import { Box, Link, Typography } from '@mui/material';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import { useRouter } from 'next/router';

interface NavLinkProps {
  display: string;
  href: string;
  target?: '_blank' | '_self';
}

export function NavLink({ display, href, target = '_self' }: NavLinkProps) {
  const router = useRouter();

  const isActive = router.pathname.startsWith(href);
  return (
    <Link target={target} href={href} sx={{ textDecoration: 'unset' }}>
      <Box display="flex" flexDirection="row" alignItems="center" gap="6px">
        <Typography
          fontFamily="Retron2000"
          fontSize="12px"
          fontWeight="800"
          color={isActive ? 'white' : 'grey'}
        >
          {display}
        </Typography>
        {target === '_blank' && <ArrowOutwardIcon />}
      </Box>
    </Link>
  );
}

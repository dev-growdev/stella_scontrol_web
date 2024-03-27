import { Box } from '@mui/material';

interface PropsDefaultPage {
  children: React.ReactNode;
}

export function DefaultPage({ children }: PropsDefaultPage) {
  return (
    <Box className="p-32 mt-20">
      <Box className="mt-24 flex flex-col gap-10 py-16">{children}</Box>
    </Box>
  );
}

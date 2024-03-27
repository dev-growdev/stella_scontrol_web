import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { Button, Grid, Paper, Typography } from '@mui/material';
import { TFunction } from 'i18next';
import { useNavigate } from 'react-router';

interface PropsHeader {
  t: TFunction;
}

export function HeaderFormSupplier({ t }: PropsHeader) {
  const navigate = useNavigate();

  function handleRedirectToSuppliers() {
    navigate('/squality/suppliers');
  }
  return (
    <Grid container>
      <Grid item xs={12}>
        <Button
          className="mb-12"
          variant="text"
          startIcon={<FuseSvgIcon>material-twotone:arrow_back_ios</FuseSvgIcon>}
          onClick={handleRedirectToSuppliers}
        >
          {t('SUPPLIERS')}
        </Button>
      </Grid>
      <Grid item xs={12}>
        <Paper elevation={4} className="p-28">
          <Typography
            className="text-20 md:text-28"
            component="h1"
            variant="h4"
            fontWeight={500}
            color={theme => theme.palette.secondary.main}
          >
            {t('REGISTER_SUPPLIER')}
          </Typography>
        </Paper>
      </Grid>
    </Grid>
  );
}

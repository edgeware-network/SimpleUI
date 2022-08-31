// Copyright 2017-2021 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import styled from 'styled-components';

import { Badge, Icon } from '@polkadot/react-components';
import { Grid, Box } from '@mui/material';

import { useTranslation } from './translate';

interface Props {
  className?: string;
}

function Legend ({ className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  return (
    <Grid container
      sx={{ justifyContent: 'center' }}>
      <Box sx={{ '& span': { m: 2 }, maxWidth: '40%' }}>
        <div className={className}>
          <h4>
            Legend
          </h4>
          <span>
            <Badge
              color='blue'
              icon='chevron-right'
            />
            {t('Next session')}
          </span>
          <span>
            <Badge
              color='green'
              info='5'
            />
            {t('Produced blocks')}
          </span>
          <span>
            <Badge
              color='green'
              info={<Icon icon='envelope' />}
            />
            {t('Online message')}
          </span>
          <span>
            <Badge
              color='green'
              icon='hand-paper'
            />
            {t('Nominating')}
          </span>
          <span>
            <Badge
              color='red'
              icon='balance-scale-right'
            />
            {t('Oversubscribed')}
          </span>
          <span>
            <Badge
              color='red'
              icon='skull-crossbones'
            />
            {t('Slashed')}
          </span>
          <span>
            <Badge
              color='red'
              icon='user-slash'
            />
            {t('Blocks nominations')}
          </span>
        </div>
      </Box>
    </Grid>
  );
}

export default React.memo(styled(Legend)`
  font-size: 0.85rem;
  padding: 1rem 0.5rem;
  text-align: center;
  // flex: 40%;
  // max-width: 10;


  .ui--Badge {
    margin-right: 0.5rem;
  }

  span+span {
    margin-left: 1rem;
  }
`);

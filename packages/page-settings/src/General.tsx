// Copyright 2017-2021 @polkadot/app-settings authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Option } from '@polkadot/apps-config/settings/types';
import type { SettingsStruct } from '@polkadot/ui-settings/types';
import styled from 'styled-components';

import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { createLanguages, createSs58 } from '@polkadot/apps-config';
import { Button, Dropdown, MarkWarning } from '@polkadot/react-components';
import { useLedger } from '@polkadot/react-hooks';
import { settings } from '@polkadot/ui-settings';
import { Paper, Grid, Box } from "@mui/material";

import { useTranslation } from './translate';
import { createIdenticon, createOption, save, saveAndReload } from './util';

interface Props {
  className?: string;
}

const ledgerConnOptions = settings.availableLedgerConn;

function General ({ className = '' }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { isLedgerCapable } = useLedger();
  // tri-state: null = nothing changed, false = no reload, true = reload required
  const [changed, setChanged] = useState<boolean | null>(null);
  const [state, setSettings] = useState((): SettingsStruct => {
    const values = settings.get();

    return { ...values, uiTheme: values.uiTheme === 'dark' ? 'dark' : 'light' };
  });

  const iconOptions = useMemo(
    () => settings.availableIcons
      .map((o): Option => createIdenticon(o, ['default']))
      .concat(createIdenticon({ info: 'robohash', text: 'RoboHash', value: 'robohash' })),
    []
  );

  const prefixOptions = useMemo(
    () => createSs58(t).map((o): Option | React.ReactNode => createOption(o, ['default'])),
    [t]
  );

  const themeOptions = useMemo(
    () => [
      { text: t('Light theme (default)'), value: 'light' },
      { text: t('Dark theme (experimental, work-in-progress)'), value: 'dark' }
    ],
    [t]
  );

  const translateLanguages = useMemo(
    () => createLanguages(t),
    [t]
  );

  useEffect((): void => {
    const prev = settings.get() as unknown as Record<string, unknown>;
    const hasChanges = Object.entries(state).some(([key, value]) => prev[key] !== value);
    const needsReload = prev.apiUrl !== state.apiUrl || prev.prefix !== state.prefix;

    setChanged(
      hasChanges
        ? needsReload
        : null
    );
  }, [state]);

  const _handleChange = useCallback(
    (key: keyof SettingsStruct) => <T extends string | number>(value: T) =>
      setSettings((state) => ({ ...state, [key]: value })),
    []
  );

  const _saveAndReload = useCallback(
    () => saveAndReload(state),
    [state]
  );

  const _save = useCallback(
    (): void => {
      save(state);
      setChanged(null);
    },
    [state]
  );

  const { i18nLang, icon, ledgerConn, prefix, uiTheme } = state;

  return (
    <div className={className}>
      <Grid container
        sx={{ justifyContent: 'center' }}>
        <Paper className='paper'
          elevation={9}
          sx={{ maxWidth: '70%', minWidth: '40%' }}>
          <div className='ui--row'>
            <Dropdown
              defaultValue={prefix}
              help={t<string>('Override the default ss58 prefix for address generation')}
              label={t<string>('address prefix')}
              onChange={_handleChange('prefix')}
              options={prefixOptions}
            />
          </div>
          <div className='ui--row'>
            <Dropdown
              defaultValue={icon}
              help={t<string>('Override the default identity icon display with a specific theme')}
              label={t<string>('default icon theme')}
              onChange={_handleChange('icon')}
              options={iconOptions}
            />
          </div>
          <div className='ui--row'>
            <Dropdown
              defaultValue={uiTheme}
              label={t<string>('default interface theme')}
              onChange={_handleChange('uiTheme')}
              options={themeOptions}
            />
          </div>
          <div className='ui--row'>
            <Dropdown
              defaultValue={i18nLang}
              label={t<string>('default interface language')}
              onChange={_handleChange('i18nLang')}
              options={translateLanguages}
            />
          </div>
          {isLedgerCapable && (
            <>
              <div className='ui--row'>
                <Dropdown
                  defaultValue={ledgerConn}
                  help={t<string>('Manage your connection to Ledger S')}
                  label={t<string>('manage hardware connections')}
                  onChange={_handleChange('ledgerConn')}
                  options={ledgerConnOptions}
                />
              </div>
              {state.ledgerConn !== 'none' && (
                <div className='ui--row'>
                  <MarkWarning content={t<string>('Ledger support is still experimental and some issues may remain. Trust, but verify the addresses on your devices before transferring large amounts. There are some features that will not work, including batch calls (used extensively in staking and democracy) as well as any identity operations.')} />
                </div>
              )}
            </>
          )}
          <Button.Group>
            <Button
              icon='save'
              isDisabled={changed === null}
              label={
                changed
                  ? t<string>('Save & Reload')
                  : t<string>('Save')
              }
              onClick={
                changed
                  ? _saveAndReload
                  : _save
              }
            />
          </Button.Group>
        </Paper>
      </Grid>
    </div>
  );
}

export default React.memo(styled(General)`
  .paper {
    background: var(--bg-menu);
    color: var(--color-text);
    text-align: center;
    align-items: center;
  }
  .div {
    align-items: center;
  }
`);

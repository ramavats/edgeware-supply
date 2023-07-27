#!/usr/bin/env node

import { ApiPromise, WsProvider } from '@polkadot/api';
import { bnToBn } from '@polkadot/util';
import { u128 } from '@polkadot/types';

module.exports = async (req, res) => {
  const nodeUrl = 'wss://edgeware.jelliedowl.net';

  console.log(`Connecting to API for ${nodeUrl}...`);

  try {
    // Initialize the API
    const api = await ApiPromise.create({
      provider: new WsProvider(nodeUrl),
    });

    // Fetch the total issuance
    const issuance = await api.query.balances.totalIssuance();
    const properties = await api.rpc.system.properties();

    // Calculate issuance in human-readable format
    const tokenDecimals = properties.tokenDecimals.unwrap().toString(10);
    const issuanceStr = issuance.div(bnToBn(10).pow(bnToBn(tokenDecimals))).toString(10);

    // Return the total issuance
    res.setHeader('content-type', 'text/plain');
    res.status(200).send(issuanceStr);
  } catch (e) {
    console.error('Error fetching Edgeware total issuance:', e);
    res.setHeader('content-type', 'text/plain');
    res.status(500).send('Error fetching Edgeware total issuance');
  }
};

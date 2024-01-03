# CreditUI

## Run on localhost

### Forked arbitrum mainnet

#### Install anvil (one time only)

Follow instruction here: <https://github.com/foundry-rs/foundry/blob/master/anvil/README.md>

```bash
anvil --version # check if it's installed
```

#### Run a localhost network

Feel free to set the env variables as you wish

```bash
export ALCHEMY_API_KEY=test
anvil --fork-url https://arb-mainnet.g.alchemy.com/v2/$ALCHEMY_API_KEY  --chain-id 31337 --balance 1000000000 --fork-block-number 95587678 --accounts 102
```

#### Metamask

Add/connect the localhost network on Metamask and import the private key of the first account of the Hardhat network (or more if you want to test with multiple accounts).

### Contracts

#### Clone and install the 3xcaliCredit package

Dev branch is recommended to test the latest features.

```bash
git clone https://github.com/3six9-Financial/3xcaliCredit
git checkout dev
```

#### Deploy the protocol contracts

#### Install dependencies

```bash
cd 3xcaliCredit-contracts && yarn install && yarn build
```

#### Deploy the contracts

```bash
rm -rf deployments/localhost && yarn hardhat getUSDC --network localhost --user-index 0 && yarn hardhat distroUSDC --network localhost && yarn hardhat deploy --network localhost && yarn hardhat distributeCredit --network localhost && yarn hardhat createCreditPair --network localhost --asset "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8" --collateral "0x82af49447d8a07e3bd95bd0d56f35241523fbab1" --pool-id 0 && yarn hardhat newLiquidity --network localhost --pool-id 0 --asset-in 100 --debt-in 110 --collateral-in 1
```

Get the contracts address from the console output.

> For more convenient commands, check the notion doc: <https://www.notion.so/3six9/Setup-the-localhost-test-env-65849834bee64b6a84e8de9cadec3269?pvs=4>

#### Modify CreditUI config

- `constants/addresses.ts`: Modify lines with `TODO: modify for localhost` comment (potentially more if the file is updated - please keep track of changes with the same comment)

### Subgraph

#### Starting Graph Node locally (install docker first)

```bash
git clone https://github.com/graphprotocol/graph-node
cd graph-node/docker
docker-compose up
```

Remove the data from the subgraph if you want to start from scratch:

```bash
docker-compose down -v && sudo rm -rf data/ && docker-compose up
```

#### Initializing new subgraph

```bash
git clone https://github.com/3six9-Financial/credit-subgraph
```

Modify the config:

- `config/localhost.json`: Modify the `lending_factory.address` and the `convenience_address` values

Deploy the subgraph locally:

```bash
yarn
yarn prepare:local
yarn codegen
yarn create-local
yarn deploy-local
```

> Note: If the subgraph is throwing errors, you might notice `indexing-error` when querying the subgraph. One solution is to add `subgraphError: allow` in your graphql query. The other solution is to remove the data from the subgraph and restart the graph node (and potentially fix the issue in the mappings code).

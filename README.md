# juice-fees

**juice-fees** generates accounting CSVs for fees paid by every [Juicebox](https://juicebox.money) project, with fiat conversions in the currency of your choice.

Powered by [Node.js](https://nodejs.org/en/), the [Juicebox Subgraph](https://info.juicebox.money/dev/subgraph/), [graph-client](https://github.com/graphprotocol/graph-client), and [CoinGecko's v3 API](https://www.coingecko.com/en/api/documentation).

*[Juicebox](https://juicebox.money) helps people run programmable and community funded treasuries from startup to scale, openly on Ethereum.*

## Installation

First, clone with:

```bash
git clone https://github.com/filipvvv/juice-fees.git
```

```bash
cd juice-fees
```

Then, create a `.graphclient.yml` file by copying  `.example.graphclient.yml`:

```bash
cp .example.graphclient.yml .graphclient.yml
```

Optionally, you can use the free Juicebox Subgraph endpoint: replace the `endpoint` URL in your `.graphclient.yml` with `https://api.studio.thegraph.com/query/30654/mainnet-dev/0.5.0`. To learn more about configuring Juicebox Subgraph, read [the docs](https://info.juicebox.money/dev/subgraph/).

An example configuration looks like this (be sure to replace `<YOUR API KEY>` with your [Graph API key](https://thegraph.com/studio/apikeys/):

```yml
sources:
  - name: juicebox
    handler:
      graphql:
        endpoint: https://gateway.thegraph.com/api/<YOUR API KEY>/subgraphs/id/FVmuv3TndQDNd2BWARV8Y27yuKKukryKXPzvAS5E7htC
    transforms:
      - autoPagination:
          validateSchema: true

documents:
  - ./queries/*.graphql
```

Once your `graphclient.yml` is ready, run:

```bash
npm install
```

to install dependencies and build your queries.

## Run

```bash
npm run start
```

Your generated CSV files will be added to the `output` directory.

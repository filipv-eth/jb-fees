const { execute, v1DistributionsDocument, v2DistributionsDocument } = require('./.graphclient');
const { writeFile } = require('fs').promises;
const readline = require('readline');

async function main() {
  let Fiat = `${(await question('Fiat currency? '))}`;

  console.log("Retreiving historical price data . . .");
  const prices = (await apifetch(`https://api.coingecko.com/api/v3/coins/ethereum/market_chart?vs_currency=${Fiat}&days=max&interval=hourly`)).prices;
  
  console.log("Retreiving v1 distributions . . .");
  const v1Distributions = (await execute(v1DistributionsDocument, {})).data.tapEvents;
  for(const i in v1Distributions) {
    v1Distributions[i].timestamp *= 1000;
    v1Distributions[i].govFeeAmount /= 1000000000000000000;
    v1Distributions[i].govFeeAmountFiat = (await prices.find(el => el[0] >= v1Distributions[i].timestamp)[1])*v1Distributions[i].govFeeAmount;
    v1Distributions[i].date = new Date(v1Distributions[i].timestamp).toLocaleString();
  }
  writecsv("./output/v1-distributions.csv", array2csv(v1Distributions));
  
  console.log("Retreiving v2 distributions . . .");
  const v2Distributions = (await execute(v2DistributionsDocument, {})).data.distributePayoutsEvents;
  for(const i in v2Distributions) {
    v2Distributions[i].timestamp *= 1000;
    v2Distributions[i].fee /= 1000000000000000000;
    v2Distributions[i].feeFiat = (await prices.find(el => el[0] >= v2Distributions[i].timestamp)[1])*v2Distributions[i].fee;
    v2Distributions[i].date = new Date(v2Distributions[i].timestamp).toLocaleString();
  }
  writecsv("./output/v2-distributions.csv", array2csv(v2Distributions));

  console.log("\nComplete ✅");
}

function apifetch (url) {
  return new Promise(resolve => {
    require('https').get(url, (resp)=>{
      let data = '';
  
      // A chunk of data has been received.
      resp.on('data', (chunk) => {
        data += chunk;
      });
    
      // The whole response has been received. Resolve the result.
      resp.on('end', () => {
        resolve(JSON.parse(data));
      });
      
    }).on("error", (err) => {
        console.log("Error: " + err.message);
    });
  });
}

function question(query) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout, });

  return new Promise(resolve => rl.question(query, answer => {
    rl.close();
    resolve(answer);
  }));
}

function array2csv (data) {
  let csv = data.map(row => Object.values(row));
  csv.unshift(Object.keys(data[0]));
  return csv.join('\n');
}

async function writecsv (fileName, data) {
  try {
    await writeFile(fileName, data, 'utf8'); 
  } catch (e) {
    console.error(e);
  }
}

main().catch((e) => console.error(`Failed to run:`, e))

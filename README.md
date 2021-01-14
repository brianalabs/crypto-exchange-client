# Node.js Client for Upbit API

Node.js client for using Upbit API. TypeScript Supported.

## Installation

```bash
$ yarn add node-upbit
# npm i node-upbit
```

## Requirements

You have to get **Access key & Secret Key** signed by Upbit.com to use this client. 

Visit [here](https://upbit.com/service_center/open_api_guide?__cf_chl_jschl_tk__=31856d2ee790062dbeeaa899dc2004b6e4151f03-1610517296-0-AZCmpcATGeSJit9kxsrknwCYt-JMR9gevDl8qhEbW9HY7OEDeMrgO84seyCnlzzTp17Qk5A1-j5TnldZ6k1yFACDZRxeWazr9i2v60vMTh9RVDilI_CVV61oUbAvUe_ib67VXNNi4Y_WGbjVdW472b7FAKXI1CCoyWM0yYnkVV_FbTFNQ9bRZIvYoDL4tFFjZ-ERkgAVjperk6qfXKVVrCCCm3ymPgfPekB-nniwZT1P0CdduOYi14SebtQkoCTA_JyntwpS_81t1_ppgRezcoygm9dIwG-Tzx4JqrGTVRDjrkiN0quu02tXyyET-1il5Ni8GnvohV_8kshvcWjJ204) to get the keys.

## Usage

```js
import { Upbit } from 'node-upbit'
const upbit = new Upbit({ 
  access_key: '', // required
  secret_key: '', // required
})
upbit.Init()

const codes = await upbit.GetMarketCodes()
// [
//   { 
//     market: 'KRW-BTC', 
//     korean_name: '비트코인', 
//     english_name: 'Bitcoin'
//   },
//   ...
// ]
```

## API Limit
### Exchange API

- 주문: 초당 8회, 분당 200회
- 주문 외 API: 초당 30회, 분당 900회

### Quotation API

Coming soon

### References
- https://docs.upbit.com
# Javascript Client for Upbit API

Javascript client for using Upbit API. **TypeScript Supported**.

ES6+ Browser and Node.js both are supported.

## Installation

```bash
$ yarn add upbit-client
# npm i upbit-client
```

## Requirements

You have to get **Access key & Secret Key** signed by Upbit.com to use this client. 

Visit [here](https://upbit.com/service_center/open_api_guide?__cf_chl_jschl_tk__=31856d2ee790062dbeeaa899dc2004b6e4151f03-1610517296-0-AZCmpcATGeSJit9kxsrknwCYt-JMR9gevDl8qhEbW9HY7OEDeMrgO84seyCnlzzTp17Qk5A1-j5TnldZ6k1yFACDZRxeWazr9i2v60vMTh9RVDilI_CVV61oUbAvUe_ib67VXNNi4Y_WGbjVdW472b7FAKXI1CCoyWM0yYnkVV_FbTFNQ9bRZIvYoDL4tFFjZ-ERkgAVjperk6qfXKVVrCCCm3ymPgfPekB-nniwZT1P0CdduOYi14SebtQkoCTA_JyntwpS_81t1_ppgRezcoygm9dIwG-Tzx4JqrGTVRDjrkiN0quu02tXyyET-1il5Ni8GnvohV_8kshvcWjJ204) to get the keys.

## Usage

### HTTP Request

```js
import { Upbit } from 'upbit-client'
const upbit = new Upbit({ 
  access_key: '',
  secret_key: '',
})

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

### WebSocket

```js
import { UpbitWebSocket } from 'upbit-client'
const upbit_ws = new UpbitWebSocket()

upbit_ws.Open({ type: "ticker", codes: ["KRW-BTC"] }, () => {
  console.log("upbit socket connected.");
});

upbit_ws.OnClose(() => {
  console.log("closed.");
});

upbit_ws.OnMessage((data) => {
  console.log(data)
  // {
  //   ty: 'ticker',
  //   cd: 'KRW-BTC',
  //   op: 40008000,
  //   hp: 41000000,
  //   lp: 39674000,
  //   tp: 40441000,
  //   pcp: 40008000,
  //   atp: 256707458304.6534,
  //   c: 'RISE',
  //   cp: 433000,
  //   scp: 433000,
  //   cr: 0.0108228354,
  //   scr: 0.0108228354,
  //   ab: 'ASK',
  //   tv: 0.00416811,
  //   atv: 6379.30820304,
  //   tdt: '20210119',
  //   ttm: '133506',
  //   ttms: 1611063306000,
  //   aav: 3573.13708979,
  //   abv: 2806.17111325,
  //   h52wp: 48550000,
  //   h52wdt: '2021-01-08',
  //   l52wp: 5489000,
  //   l52wdt: '2020-03-13',
  //   ts: null,
  //   ms: 'ACTIVE',
  //   msfi: null,
  //   its: false,
  //   dd: null,
  //   mw: 'NONE',
  //   tms: 1611063306635,
  //   atp24h: 343031046559.8189,
  //   atv24h: 8541.35594639,
  //   st: 'REALTIME'
  // }
  // ]
});
```

## API Limit

Last updated by 2020-03-10

### Exchange API

주문

- 초당 8회, 분당 200회

주문 외

- 초당 30회, 분당 900회

### Quotation API

Websocket 연결 요청 수 제한

- 초당 5회, 분당 100회

REST API 요청 수 제한

- 분당 600회, 초당 10회 (종목, 캔들, 체결, 티커, 호가별)

----

References

- [Upbit.com Developer Center](https://docs.upbit.com)
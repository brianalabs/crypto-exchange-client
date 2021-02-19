import 'dotenv/config'
import { Upbit } from './src'
import dayjs from 'dayjs'
import { Table } from 'console-table-printer'

const Log = (data: any[]) => {
  const t = new Table()
  t.addRows(data, { color: 'green' })
  t.printTable()
}

async function Init() {
  try {
    const upbit = new Upbit({
      access_key: process.env.UPBIT_ACCESS_KEY as string,
      secret_key: process.env.UPBIT_SECRET_KEY as string
    })

    upbit.ws.Open({ type: 'ticker', codes: ['KRW-SRN'] }, () => {
      console.log('opened')
    })
    upbit.ws.OnMessage(data => {
      console.log(data)
    })

    // upbit.ws.Open({ type: 'ticker', codes: ['KRW-BTC'], isOnlySnapshot: true }, () => {
    //   console.log('upbit socket connected.')
    // })

    // upbit.ws.OnMessage(data => {
    //   console.log(data)
    // })

    // upbit.ws.OnClose(() => {
    //   console.log('closed.')
    // })

    /** Coin Addresses */
    // const coinAddresses = await upbit.GetDepositsCoinAddresses()
    // console.log(coinAddresses)

    /** Accounts */
    // const accounts = await upbit.GetAccounts()
    // console.log(accounts)

    /** Market Codes */
    // const marketCodes = await upbit.GetMarketCodes()
    // console.log(marketCodes)

    /** Order Chance */
    // const order = await upbit.GetOrderChance("KRW-BTC");
    // console.log(order);

    /** Wallet status */
    // const wallet = await upbit.GetStatusWallet()
    // console.log(wallet)

    /** Candle */
    // const candles = await upbit.GetCandleByMinute({ count: 200, unit: 15, market: 'KRW-BTC', to: dayjs().subtract(3, 'day').format('YYYY-MM-DDTHH:mm:ss.SSSZ') }) // '2021-01-01T09:00:00.000+00:00'
    // console.log(candles)
    // const candles = await upbit.GetCandleByMinute({
    //   market: 'KRW-BTC',
    //   unit: 1,
    //   count: 30
    //   // to: dayjs().format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
    // })
    // Log(candles)

    /** Order */
    // const order = await upbit.Order({ market: 'KRW-BTC', side: 'ask', volume: '10', ord_type: 'market' })
    // console.log(order)

    /** Get order info */
    // const order = await upbit.GetOrder('9ca023a5-851b-4fec-9f0a-48cd83c2eaae')
    // console.log(order)

    /** Get multiple order info */
    // const orders = await upbit.GetOrders({ state: 'done' })
    // console.log(orders)
    // await upbit.GetOrder('9ca023a5-851b-4fec-9f0a-48cd83c2eaae')
    // await upbit.GetOrders({ state: 'done' })
    // await upbit.GetTickers(['KRW-BTC', 'KRW-AHT'])

    /** Get tickers */
    // const tickers = await upbit.GetTickers(['KRW-BTC', 'KRW-AHT'])
    // console.log(tickers)

    /** Get Trades */
    // const trades = await upbit.GetTrades({ market: 'KRaW-AHT', count: 5 })
    // console.log(trades)
  } catch (err) {
    console.log(`[ERROR]`, err)
  }
}

Init()

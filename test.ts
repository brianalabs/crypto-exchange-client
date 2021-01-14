import 'dotenv/config'
import { Upbit, UpbitCandle } from './src'
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
      // slack_bot_user_oauth_access_token: process.env.SLACK_BOT_USER_OAUTH_ACCESS_TOKEN as string
    })

    /** Done */
    // const coinAddresses = await upbit.GetDepositsCoinAddresses()
    // const accounts = await upbit.GetAccounts()
    // const marketCodes = await upbit.GetMarketCodes()
    // const order = await upbit.GetOrderChance({ market: 'KRW-BTC' })
    // const wallet = await upbit.GetStatusWallet()
    const candles = await upbit.GetCandleByMinute({
      market: 'KRW-BTC',
      unit: 1,
      count: 30
      // to: dayjs().format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
    })
    Log(candles)

    // const order = await upbit.Order({ market: 'KRW-BTC', side: 'ask', volume: '10', ord_type: 'market' })
    // await upbit.GetOrder('9ca023a5-851b-4fec-9f0a-48cd83c2eaae')
    // await upbit.GetOrders({ state: 'done' })
    // await upbit.GetTickers(['KRW-BTC', 'KRW-AHT'])

    // await upbit.GetTrades({ market: 'KRaW-AHT', count: 5 })

    /** In Progress */
  } catch (err) {
    console.log(`[ERROR]`, err)
  }
}

Init()

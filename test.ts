import 'dotenv/config'
import { Upbit } from './src'
import dayjs from 'dayjs'

async function Init() {
  try {
    const { UPBIT_ACCESS_KEY, UPBIT_SECRET_KEY } = process.env
    const upbit = new Upbit({ access_key: UPBIT_ACCESS_KEY as string, secret_key: UPBIT_SECRET_KEY as string })

    /** Done */
    // const coinAddresses = await upbit.GetDepositsCoinAddresses()
    // const accounts = await upbit.GetAccounts()
    // const marketCodes = await upbit.GetMarketCodes()
    // const order = await upbit.GetOrderChance({ market: 'KRW-BTC' })
    // const wallet = await upbit.GetStatusWallet()
    // await upbit.GetCandleByMinute({ count: 200, unit: 15, market: 'KRW-BTC', to: dayjs().subtract(3, 'day').format('YYYY-MM-DDTHH:mm:ss.SSSZ') }) // '2021-01-01T09:00:00.000+00:00'

    // const order = await upbit.Order({ market: 'KRW-BTC', side: 'ask', volume: '10', ord_type: 'market' })
    await upbit.GetOrder('9ca023a5-851b-4fec-9f0a-48cd83c2eaae')
    // await upbit.GetOrders({ state: 'done' })
    // await upbit.GetTickers(['KRW-BTC', 'KRW-AHT'])

    // await upbit.GetTrades({ market: 'KRaW-AHT', count: 5 })

    /** In Progress */
  } catch (err) {
    console.log(`[ERROR]`, err)
  }
}

Init()
import 'dotenv/config'
import { Upbit } from './src'

async function Init() {
  try {
    const { UPBIT_ACCESS_KEY, UPBIT_SECRET_KEY } = process.env
    const upbit = new Upbit({ access_key: UPBIT_ACCESS_KEY as string, secret_key: UPBIT_SECRET_KEY as string })

    // const body = {
    //     market: 'KRW-BTC',
    //     side: 'bid',
    //     volume: '0.01',
    //     price: '100',
    //     ord_type: 'limit',
    // }

    const { data } = await upbit.GetCandle({ count: 10, unit: 3, market: 'KRW-BTC', to: '2021-01-01T09:00:00.000+00:00' })
    // const { data } = await upbit.Order({ market: 'KRW_BTC', side: 'bid', price:  '100', volumne: '0.01', ord_type: 'limit' })
    console.log({ data })
  } catch (err) {
    console.log(`[ERROR]`)
    console.log(err.response.data)
  }
}

Init()
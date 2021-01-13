import 'dotenv/config'
// import { Upbit } from './dist'
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

    /** Done */
    // const coinAddresses = await upbit.GetDepositsCoinAddresses()
    // const accounes = await upbit.GetAccounts()
    // const order = await upbit.GetOrderChance({ market: 'KRW-BTC' })
    
    // const wallet = await upbit.GetStatusWallet()
    
    // const { data } = await upbit.GetCandle({ count: 10, unit: 3, market: 'KRW-BTC', to: '2021-01-01T09:00:00.000+00:00' })
    // const { data } = await upbit.GetStatusWallet()
  
    // const order = await upbit.Order({ market: 'KRW-AHT', side: 'ask', volume: '10', ord_type: 'market' })
    
    // console.log(data.)
    // const { data } = await upbit.GetMarketCode()
    // data.forEach(item => console.log(item))

    /** In Progress */
    // console.log(data)
  } catch (err) {
    console.log(`[ERROR]`)
    console.log(err.response.data)
  }
}

Init()
import axios, { AxiosError, AxiosInstance, AxiosPromise, AxiosRequestConfig, AxiosResponse } from 'axios'
import jwt from 'jsonwebtoken'
import qs from 'querystring'
import crypto from 'crypto'
import { v4 as uuidv4 } from 'uuid'
import { UpbitSocket } from './socket'

interface UpbitTokenParams {
  access_key: string
  nonce: string
  query_hash?: string
  query_hash_alg?: 'SHA512'
}

export interface UpbitAccount {
  currency: string
  balance: string
  locked: string
  avg_buy_price: string
  avg_buy_price_medofied: boolean
  unit_currency: string
}

export interface UpbitMarketCode {
  market: string
  korean_name: string
  english_name: string
}
export interface UpbitWalletStatus {
  currency: string
  wallet_state: string
  block_state: string
  block_height: number
  block_updated_at: string
  block_elapsed_minutes: number
}

export interface UpbitDepositsCoinAddress {
  currency: string
  deposit_address: string
  secondary_address?: string
}

export interface UpbitOrderChance {
  bid_fee: string
  ask_fee: string
  maker_bid_fee: string
  maker_ask_fee: string
  market: {
    id: string
    name: string
    order_types: string[]
    order_sides: string[]
    bid: {
      currency: string
      price_unit?: string
      min_total: number
    }
    ask: {
      currency: string
      price_unit?: string
      min_total: number
    }
  }
  bid_account: {
    currency: string
    balance: string
    locked: string
    avg_buy_price: string
    avg_buy_price_modified: boolean
    unit_currency: string
  }
  ask_account: {
    currency: string
    balance: string
    locked: string
    avg_buy_price: string
    avg_buy_price_modified: boolean
    unit_currency: string
  }
}

export interface UpbitOrder {
  uuid: string
  side: string
  ord_type: string
  price: string
  state: string
  market: string
  created_at: string
  volume: string
  remaining_volume: string
  reserved_fee: string
  remaining_fee: string
  paid_fee: string
  locked: string
  executed_volume: string
  trades_count: number
}
export interface UpbitOrderDetail extends UpbitOrder {
  trades: [
    {
      market: string
      uuid: string
      price: string
      volume: string
      funds: string
      side: string
    }
  ]
}

export interface UpbitCandle {
  market: string
  candle_date_time_utc: string
  candle_date_time_kst: string
  opening_price: number
  high_price: number
  low_price: number
  trade_price: number
  timestamp: number
  candle_acc_trade_price: number
  candle_acc_trade_volume: number
  unit: number
}

export interface UpbitTrade {
  market: string
  trade_date_utc: string
  trade_time_utc: string
  timestamp: number
  trade_price: number
  trade_volume: number
  prev_closing_price: number
  change_price: number
  ask_bid: string
  sequential_id: number
}

export interface UpbitTicker {
  market: string
  trade_date: string
  trade_time: string
  trade_date_kst: string
  trade_time_kst: string
  trade_timestamp: number
  opening_price: number
  high_price: number
  low_price: number
  trade_price: number
  prev_closing_price: number
  change: string
  change_price: number
  change_rate: number
  signed_change_price: number
  signed_change_rate: number
  trade_volume: number
  acc_trade_price: number
  acc_trade_price_24h: number
  acc_trade_volume: number
  acc_trade_volume_24h: number
  highest_52_week_price: number
  highest_52_week_date: string
  lowest_52_week_price: number
  lowest_52_week_date: string
  timestamp: number
}

export class Upbit {
  private readonly access_key: string
  private readonly secret_key: string
  private http: AxiosInstance
  public ws: UpbitSocket

  constructor(auth: { access_key: string; secret_key: string }) {
    /** Keys */
    this.access_key = auth.access_key
    this.secret_key = auth.secret_key

    /** Web Socket */
    this.ws = new UpbitSocket()

    /** HTTP Request */
    this.http = axios.create({ baseURL: 'https://api.upbit.com' })
    this.http.interceptors.request.use((value: AxiosRequestConfig) => {
      const token = value.data ? this.GenerateToken(value.data) : this.GenerateToken()

      value.headers['Authorization'] = `Bearer ${token}`

      return value
    })
    this.http.interceptors.response.use(
      (res: AxiosResponse) => {
        if (res.headers['remaining-req']) {
          const remaining_req = res.headers['remaining-req']
        }

        return res.data
      },
      (err: AxiosError) => {
        if (err.response?.data) {
          throw err.response.data.error
        }

        throw err
      }
    )
  }

  private GenerateToken(data?: { [key: string]: any }): string {
    const payload: UpbitTokenParams = {
      access_key: this.access_key,
      nonce: uuidv4()
    }

    if (data) {
      const query = qs.stringify(data)
      const queryHash = crypto.createHash('sha512').update(query, 'utf-8').digest('hex')

      payload.query_hash = queryHash
      payload.query_hash_alg = 'SHA512'
    }

    return jwt.sign(payload, this.secret_key)
  }

  /**
   * @description API 키 리스트 조회 - API 키 목록 및 만료 일자를 조회합니다.
   * @example
   * const upbit = new Upbit({ ... })
   * const keys = await upbit.GetApiKeys()
   *
   */
  public GetApiKeys(): Promise<{ access_key: string; expire_at: string }[]> {
    return this.http.get('/v1/api_keys')
  }

  /**
   * @description 입출금 현황 - 입출금 현황 및 블록 상태를 조회합니다. 입출금 현황 API에서 제공하는 입출금 상태, 블록 상태 정보는 수 분 정도 지연되어 반영될 수 있습니다. 본 API는 참고용으로만 사용하시길 바라며 실제 입출금을 수행하기 전에는 반드시 업비트 공지사항 및 입출금 현황 페이지를 참고해주시기 바랍니다. 
   * @example
   * const upbit = new Upbit({ ... })
   * const wallets = await upbit.GetStatusWallet()
   * [
       {
         currency: 'BTC', 화폐를 의미하는 영문 대문자 코드
         wallet_state: 'working', 입출금 상태
         block_state: 'normal', 블록 상태
         block_height: 665700, block_height	블록 높이	Integer
         block_updated_at: '2021-01-01T09:00:00.000+00:00', block_updated_at	블록 갱신 시각
         block_elapsed_minutes: 20
       }
     ]
     입출금 상태
     - working : 입출금 가능
     - withdraw_only : 출금만 가능
     - deposit_only : 입금만 가능
     - paused : 입출금 중단
     - unsupported : 입출금 미지원
 
     블록 상태
     - normal : 정상
     - delayed : 지연
     - inactive : 비활성 (점검 등)
   */
  public GetStatusWallet(): Promise<UpbitWalletStatus[]> {
    return this.http.get('/v1/status/wallet')
  }

  /**
   * @description 전체 입금 주소 조회 - 내가 보유한 자산 리스트를 보여줍니다.
   * @example
   * const upbit = new Upbit({ ... })
   * const addresses = await upbit.GetDepositsCoinAddresses()
   * const address = await upbit.GetDepositsCoinAddresses({ currency: 'BTC' })
   *
   */
  public GetDepositsCoinAddresses(data?: { currency: string }): Promise<UpbitDepositsCoinAddress[]> {
    return this.http.get('/v1/deposits/coin_addresses?' + qs.stringify(data), {
      data
    })
  }

  /**
   * @description 전체 계좌 조회 - 내가 보유한 자산 리스트를 보여줍니다.
   * @example
   * const upbit = new Upbit({ ... })
   * const accounts = await upbit.GetAccounts()
   * 
   * currency - 화폐를 의미하는 영문 대문자 코드
   * 
     balance - 주문가능 금액/수량

     locked - 주문 중 묶여있는 금액/수량

     avg_buy_price - 매수평균가

     avg_buy_price_modified - 매수평균가 수정 여부

     unit_currency - 평단가 기준 화폐
   */
  public GetAccounts(): Promise<UpbitAccount[]> {
    return this.http.get('/v1/accounts')
  }

  /**
   * @description 업비트에서 거래 가능한 마켓 목록
   * @example
   * const upbit = new Upbit({ ... })
   * const accounts = await upbit.GetMarketCode()
   * [
   *   {
   *     market: 'KRW-BTC',
   *     korean_name: '비트코인',
   *     english_name: 'Bitcoin'
   *   }
   * ]
   *
   * market - 업비트에서 제공중인 시장 정보
   *
   * korean_name - 거래 대상 암호화폐 한글명
   *
   * english_name - 거래 대상 암호화폐 영문명
   */
  public GetMarketCodes(): Promise<UpbitMarketCode[]> {
    return this.http.get('/v1/market/all')
  }

  /**
   * @description 주문하기
   * const upbit = new Upbit({ ... })
   * const order = await upbit.Order({ market: 'KRW-BTC', side: 'ask', volume: '0.01', price: '100, ord_type: 'limit' })
   *
   */
  public Order(data: {
    market: string
    side: 'bid' | 'ask'
    volume: string
    price?: string
    ord_type: 'limit' | 'price' | 'market'
  }): Promise<UpbitOrder> {
    return this.http.post('/v1/orders', { data })
  }

  /** 
   *  @description 매도 가능 여부 조회하기
   *  @param market 마켓명
   *  @example
   *  const upbit = new Upbit({ ... })
   *  const chance = await upbit.GetOrderChance('KRW-BTC')
   * 
   * 
   *  bid_fee	매수 수수료 비율	NumberString
      ask_fee	매도 수수료 비율	NumberString
      market	마켓에 대한 정보	Object
      market.id	마켓의 유일 키	String
      market.name	마켓 이름	String
      market.order_types	지원 주문 방식	Array[String]
      market.order_sides	지원 주문 종류	Array[String]
      market.bid	매수 시 제약사항	Object
      market.bid.currency	화폐를 의미하는 영문 대문자 코드	String
      market.bit.price_unit	주문금액 단위	String
      market.bid.min_total	최소 매도/매수 금액	Number
      market.ask	매도 시 제약사항	Object
      market.ask.currency	화폐를 의미하는 영문 대문자 코드	String
      market.ask.price_unit	주문금액 단위	String
      market.ask.min_total	최소 매도/매수 금액	Number
      market.max_total	최대 매도/매수 금액	NumberString
      market.state	마켓 운영 상태	String
      bid_account	매수 시 사용하는 화폐의 계좌 상태	Object
      bid_account.currency	화폐를 의미하는 영문 대문자 코드	String
      bid_account.balance	주문가능 금액/수량	NumberString
      bid_account.locked	주문 중 묶여있는 금액/수량	NumberString
      bid_account.avg_buy_price	매수평균가	NumberString
      bid_account.avg_buy_price_modified	매수평균가 수정 여부	Boolean
      bid_account.unit_currency	평단가 기준 화폐	String
      ask_account	매도 시 사용하는 화폐의 계좌 상태	Object
      ask_account.currency	화폐를 의미하는 영문 대문자 코드	String
      ask_account.balance	주문가능 금액/수량	NumberString
      ask_account.locked	주문 중 묶여있는 금액/수량	NumberString
      ask_account.avg_buy_price	매수평균가	NumberString
      ask_account.avg_buy_price_modified	매수평균가 수정 여부	Boolean
      ask_account.unit_currency	평단가 기준 화폐	String
   */
  public GetOrderChance(market: string): Promise<UpbitOrderChance> {
    return this.http.get('/v1/orders/chance?' + qs.stringify({ market }), {
      data: { market }
    })
  }

  /**
   * @description 주문 정보 조회하기
   * @param uuid 주문했을 때 사용한 uuid.
   * @example
   * const upbit = new Upbit({ ... })
   * const order = await upbit.Order({ market: 'KRW-BTC', side: 'ask', volume: '0.01', price: '100, ord_type: 'limit' })
   */
  public GetOrder(uuid: string): Promise<UpbitOrderDetail> {
    return this.http.get(`/v1/order?` + qs.stringify({ uuid }), {
      data: { uuid }
    })
  }

  /**
   * 
   * @param uuids Name	설명	타입
   * @param state 
   * market	마켓 아이디	String
      uuids	주문 UUID의 목록	Array
      identifiers	주문 identifier의 목록	Array
      state	주문 상태
      - wait : 체결 대기 (default)
      - done : 전체 체결 완료
      - cancel : 주문 취소	String
      states	주문 상태의 목록	Array
      kind	주문 유형
      - normal : 일반 주문
      - watch : 예약 주문	String
      page	페이지 수, default: 1	Number
      limit	요청 개수, default: 100	Number
      order_by	정렬 방식
      - asc : 오름차순
      - desc : 내림차순 (default)	String
   */
  public GetOrders(data?: {
    /** uuids?: string[], */ state?: 'wait' | 'done' | 'cancel'
    kind?: 'normal' | 'watch'
    page?: number
    limit?: number
    order_by?: 'asc' | 'desc'
  }): Promise<UpbitOrder> {
    return this.http.get('/v1/orders?' + qs.stringify(data), { data })
  }

  public GetCandleByMinute(data: { market: string; unit?: number; to?: string; count?: number }): Promise<UpbitCandle[]> {
    const payload: { [key: string]: any } = {
      market: data.market,
      count: data.count || 1
    }
    switch (data?.unit) {
      case 1:
      case 3:
      case 5:
      case 10:
      case 15:
      case 30:
      case 60:
      case 240:
        break
      default:
        throw new Error('Invalid unit.')
    }
    if (data.count) {
      if (data.count > 200) {
        throw new Error('Invalid count.')
      }
    }
    if (data.to) [(payload.to = data.to)]

    return this.http.get(`/v1/candles/minutes/${data.unit || 1}?${qs.stringify(data)}`, { data })
  }

  /**
   * @description 최근 체결 내역
   */
  public GetTrades(data: { market: string; count?: number }): Promise<UpbitTrade[]> {
    return this.http.get('/v1/trades/ticks?' + qs.stringify(data), { data })
  }

  /**
   * @description 현재가 정보 - 요청 당시 종목의 스냅샷을 반환한다.
   * @param markets 마켓명의 배열
   * @example
   *
   */
  public GetTickers(markets: string[]): Promise<UpbitTicker[]> {
    return this.http.get(`/v1/ticker?markets=${markets.join()}`, {
      data: { markets: markets.join() }
    })
  }
}

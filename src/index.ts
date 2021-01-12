import axios, { AxiosInstance, AxiosPromise, AxiosRequestConfig } from 'axios'
import jwt from 'jsonwebtoken'
import qs, { stringify } from 'querystring'
import crypto from 'crypto'
import { v4 as uuidv4 } from 'uuid'
import request from 'request'

interface UpbitTokenPayload {
  access_key: string
  nonce: string
  query_hash?: string
  query_hash_alg?: 'SHA512'
}

export class Upbit {
  private readonly access_key: string
  private readonly secret_key: string
  private http: AxiosInstance

  constructor(auth: { access_key: string, secret_key: string }) {
    this.access_key = auth.access_key
    this.secret_key = auth.secret_key
    
    // this.http = axios.create({ headers: { 'Content-Type': 'application/json' }, baseURL: 'https://api.upbit.com'})
    this.http = axios.create({ baseURL: 'https://api.upbit.com' })
    this.http.interceptors.request.use((value: AxiosRequestConfig) => {
      // const body = {
      //     market: 'KRW-BTC',
      //     side: 'bid',
      //     volume: '0.01',
      //     price: '100',
      //     ord_type: 'limit',
      // }

      // const query = queryEncode(body)

      // const hash = crypto.createHash('sha512')
      // const queryHash = hash.update(query, 'utf-8').digest('hex')

      // const payload = {
      //     access_key: access_key,
      //     nonce: uuidv4(),
      //     query_hash: queryHash,
      //     query_hash_alg: 'SHA512',
      // }

      // const token = sign(payload, secret_key)

      // const options = {
      //     method: "POST",
      //     url: server_url + "/v1/orders",
      //     headers: {Authorization: `Bearer ${token}`},
      //     json: body
      // }

      if (value.data) {
        console.log(1)
        value.headers['Authorization'] = `Bearer ${this.GenerateToken(value.data)}`
        value.params = value.data
        // value.params = qs.encode(value.data)
        // @ts-ignore
        // value.json = value.data
        delete value.data
        // value.data = qs.stringify(value.data)
      }
      else {
        value.headers['Authorization'] = `Bearer ${this.GenerateToken()}`
      }

      console.log(value)

      return value
    })
  }

  private GenerateToken(data?: { [key: string]: any }): string {
    // const query = queryEncode(body)

    // const hash = crypto.createHash('sha512')
    // const queryHash = hash.update(query, 'utf-8').digest('hex')

    // const payload = {
    //     access_key: access_key,
    //     nonce: uuidv4(),
    //     query_hash: queryHash,
    //     query_hash_alg: 'SHA512',
    // }

    // const token = sign(payload, secret_key)

    // const options = {
    //     method: "GET",
    //     url: server_url + "/v1/deposits/coin_address?" + query,
    //     headers: {Authorization: `Bearer ${token}`},
    //     json: body
    // }
  
    const payload: UpbitTokenPayload = {
      access_key: this.access_key,
      nonce: uuidv4(),
    }

    if (data) {
      console.log({
        encode: qs.encode(data),
        stringify: qs.stringify(data)
      })
      const query = qs.encode(data)
      console.log({query})
      const queryHash = crypto.createHash('sha512').update(query, 'utf-8').digest('hex')

      payload.query_hash = queryHash
      payload.query_hash_alg = 'SHA512'
    }

    console.log(payload)

    return jwt.sign(payload, this.secret_key)
  }

  /**
   * @description API 키 리스트 조회 - API 키 목록 및 만료 일자를 조회합니다.
   * @example
   * [
       {
         access_key: '...',
         expire_at: '2022-01-01T12:00:00+09:00'
       }
     ]
   */
  GetApiKeys() {
    return this.http.get('/v1/api_keys')
  }
  
  /**
   * @description 입출금 현황 - 입출금 현황 및 블록 상태를 조회합니다.
   * @example
   * [
       {
         currency: 'BTC',
         wallet_state: 'working',
         block_state: 'normal',
         block_height: 665700,
         block_updated_at: '2021-01-01T09:00:00.000+00:00',
         block_elapsed_minutes: 20
       }
     ]
   */
  GetStatusWallet() {
    return this.http.get('/v1/status/wallet')
  }
  
  /**
   * @description 전체 입금 주소 조회 - 내가 보유한 자산 리스트를 보여줍니다.
   */
  GetDepositsCoinAddresses() {
    const body = {
      currency: 'BTC',
    }

    return this.http.get('/v1/deposits/coin_address?currency=BTC', { data: body })
    // return this.http.get('/v1/deposits/coin_addresses')
  }

  /**
   * @description 전체 계좌 조회 - 내가 보유한 자산 리스트를 보여줍니다.
   * @example
   * [
   *   {
         currency:" BTC",
         balance:" 2.0",
         locked:" 0.0",
         avg_buy_price:" 101000",
         avg_buy_price_modified: false,
         unit_currency: "KRW",
       }
     ]
   * 
   * currency - 화폐를 의미하는 영문 대문자 코드
   * 
     balance - 주문가능 금액/수량

     locked - 주문 중 묶여있는 금액/수량

     avg_buy_price - 매수평균가

     avg_buy_price_modified - 매수평균가 수정 여부

     unit_currency - 평단가 기준 화폐
   */
  public GetAccounts() {
    return this.http.get('/v1/accounts')
  }

   /**
    * @description 업비트에서 거래 가능한 마켓 목록
    * @example 
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
  public GetMarketCode(): AxiosPromise<{ market: string, korean_name: string, english_name: string }[]> { 
    return this.http.get('/v1/market/all')
  }

  public Order(payload: { market: string, side: 'bid' | 'ask', volumne: string, price: string | null, ord_type: 'limit' | 'price' | 'market' }) {
    return this.http({
      method: 'POST',
      url: '/v1/orders',
      data: payload
    })
  }

  public GetCandle(data: { market: string, unit?: number | string, to?: string, count?: number | string }) {
    const unit = data.unit || 1

    const payload: { [key: string]: any } = {
      market: data.market,
      count: data.count || 1
    }
    if (data.unit) {
      switch (data.unit) {
        case 1:
        case 3:
        case 5:
        case 10:
        case 30:
        case 60:
        case 240:
          break
        default:
          throw new Error('Invalid unit.')
      }
    }
    if (data.count) {
      if (data.count > 200) {
        throw new Error('Invalid count.')
      }
    }
    if (data.to) [
      payload.to = data.to
    ]

    const query = qs.stringify(payload)

    return this.http.get(`/v1/candles/minutes/${unit}?${query}`)
  }
}
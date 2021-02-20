import { v4 as uuidv4 } from 'uuid'
import { isBrowser, isNode } from 'browser-or-node'
import WebSocket from 'isomorphic-ws'

export interface UpbitSocketPayload {
  type: 'ticker' | 'trade' | 'orderbook'
  codes: string[]
  isOnlySnapshot?: boolean
  isOnlyRealtime?: boolean
  // format?: 'DEFAULT' | 'SIMPLE'
}
export interface UpbitSocketDefaultResponse {
  type: string
  code: string
  opening_price: number
  high_price: number
  low_price: number
  trade_price: number
  prev_closing_price: number
  acc_trade_price: number
  change: string
  change_price: number
  signed_change_price: number
  change_rate: number
  signed_change_rate: number
  ask_bid: string
  trade_volume: number
  acc_trade_volume: number
  trade_date: string
  trade_time: string
  trade_timestamp: number
  acc_ask_volume: number
  acc_bid_volume: number
  highest_52_week_price: number
  highest_52_week_date: string
  lowest_52_week_price: number
  lowest_52_week_date: string
  trade_status: null
  market_state: string
  market_state_for_ios: null
  is_trading_suspended: false
  delisting_date: null
  market_warning: string
  timestamp: number
  acc_trade_price_24h: number
  acc_trade_volume_24h: number
  stream_type: string

}
export interface UpbitSocketSimpleResponse {
  ty: string
  cd: string
  op: number
  hp: number
  lp: number
  tp: number
  pcp: number
  atp: number
  c: string
  cp: number
  scp: number
  cr: number
  scr: number
  ab: string
  tv: number
  atv: number
  tdt: string
  ttm: string
  ttms: number
  aav: number
  abv: number
  h52wp: number
  h52wdt: string
  l52wp: number
  l52wdt: string
  ts: null
  ms: string
  msfi: null
  its: false
  dd: null
  mw: string
  tms: number
  atp24h: number
  atv24h: number
  st: string
}

/**
 * @description 
 * WebSocket을 이용하여 수신할 수 있는 정보는 다음과 같습니다.

  현재가 (스냅샷, 실시간 정보 제공)
  체결 (스냅샷, 실시간 정보 제공)
  호가 (스냅샷, 실시간 정보 제공)
 */

export class UpbitWebSocket {
  public ws: WebSocket

  constructor() {
    this.ws = new WebSocket('wss://api.upbit.com/websocket/v1')
  }

  public Open(payload: UpbitSocketPayload, cb?: Function) {
    this.ws.onopen = (e) => {
      this.ws.send(`${JSON.stringify([{ ticket: uuidv4() }, { ...payload }, { format: 'SIMPLE' }])}`)

      if (cb) {
        cb()
      }
    }
  }

  public Close() {
    this.ws.close()
  }

  public OnClose(cb: Function) {
    this.ws.onclose = () => {
      cb()
    }
  }

  public OnMessage(cb: (data: UpbitSocketSimpleResponse) => void) {
    this.ws.onmessage = async payload => {
      if (isBrowser) {
        const response = await new Response(payload.data as unknown as Blob).json()
        cb(response)
      }
      else if (isNode) {
        const response = JSON.parse(payload.data.toString('utf-8'))
        cb(response)
      }
      else {
        throw Error('Invalid environment.')
      }
    }
  }
}

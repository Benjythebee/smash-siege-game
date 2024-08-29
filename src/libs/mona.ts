import { create } from "zustand"
import { persist } from "zustand/middleware"
import { setUser } from "../components/userStore"

const api = import.meta.env.VITE_MONA_APP_ID

export type TokenAnimatable = Token & {animation:AnimationResponse}

export class MonaAPI {
    static key= api
    static bearer=''
    static refreshToken = ''

    constructor(){
        usePersistedMonaAuth.subscribe(this.automaticallyLogin)
    }

    automaticallyLogin = async ({refreshToken}:{refreshToken:string})=>{
        if(refreshToken && !MonaAPI.refreshToken){
            MonaAPI.refreshToken = refreshToken
            await this.OTP_Refresh()
            const user = await this.getUser()
            if('username' in user){
                setUser(user)
            }
        }
    }

    OTP_Generate = async (email:string) => {
        return await this._fetch<any>('https://api.monaverse.com/public/auth/otp/generate', {
            method: 'POST',
            body: JSON.stringify({email})
        })
    }

    OTP_Verify = async (email:string,otp:string) => {
        const isVerified= await this._fetch<{access:string,refresh:string}>('https://api.monaverse.com/public/auth/otp/verify', {
            method: 'POST',
            body: JSON.stringify({email,otp})
        })
        if('access' in isVerified){
            MonaAPI.bearer = isVerified.access
            MonaAPI.refreshToken = isVerified.refresh
            usePersistedMonaAuth.setState({refreshToken:isVerified.refresh})
            return {success:true}
        }else {
            console.error(isVerified)
            return {success:false}
        }
    }

    OTP_Refresh = async () => {
        const isRefreshed= await this._fetch<{access:string,refresh:string}>('https://api.monaverse.com/public/auth/token/refresh', {
            method: 'POST',
            body: JSON.stringify({refresh:MonaAPI.refreshToken})
        })
        if('access' in isRefreshed){
            MonaAPI.bearer = isRefreshed.access
            MonaAPI.refreshToken = isRefreshed.refresh
            usePersistedMonaAuth.setState({refreshToken:isRefreshed.refresh})
            return {success:true}
        }else {
            console.error(isRefreshed)
            return {success:false}
        }
    }

    getUser = async () => {
        const user = await this._fetch<MonaUser,InvalidBearerToken>('https://api.monaverse.com/public/user/',{
            method:'GET'
        })

        if('error' in user){
            return {error:'Could not get user'}
        }else{
            return user
        }
    }


    getTokens = async ({chain_id,address,queryKey}:{chain_id:number,address:string,queryKey?:string}) => {

        let url= `https://api.monaverse.com/public/user/${chain_id}/${address}/tokens?includeLastSale=false&includeAttributes=true`

        if(queryKey){
            url += `&continuation=${queryKey}`
        }

        const tokens = await this._fetch<{tokens:Token[],continuation:string|null},InvalidBearerToken>(url,{
            method:'GET'
        })

        if('error' in tokens){
            console.error(tokens)
            return {tokens:[] as TokenAnimatable[]}
        }else{
            const animatable = []
            for(const token of tokens.tokens){
                const animation = await this.getAnimation(token);
                if(animation){
                    (token as TokenAnimatable).animation = animation
                    animatable.push(token as TokenAnimatable)
                }
            }

            return {tokens:animatable,continuation:tokens.continuation}
        }
    }

    getAnimation = async (token:Token) => {
        const animation = await this._fetch<AnimationResponse,InvalidBearerToken>(`https://api.monaverse.com/public/tokens/${token.chainId}/${token.contract}/${token.tokenId}/animation`,{
            method:'GET'
        })

        if('error' in animation){
            console.error(animation)
            return null
        }else{
            return animation
        }
    }

    logout = () => {
        MonaAPI.bearer = ''
        MonaAPI.refreshToken = ''
        usePersistedMonaAuth.setState({refreshToken:''})
    }

    private _fetch = async <Data extends any,E extends OTPMIssingError | InvalidBearerToken | InvalidWallet = never>(url: string, options: RequestInit) => {
        const opt = {
            ...options,
            headers: {
                ...options.headers,
                'Content-Type': 'application/json',
                'X-Mona-Application-Id': MonaAPI.key,
                ...(MonaAPI.bearer?{Authorization:`Bearer ${MonaAPI.bearer}`}:{})
            }
        }
        try{
            const response = await fetch(url, opt)

            if(response.status === 400){
                const e = await response.text()
                return {error:e}
            }else if (response.status === 401){
                const e = await response.json() as E
                return {error:e}
            }
            return await response.json() as Data
        }catch(e){
            console.error(e)
            return {error:'Network Error'}
        }
    }
}

export const usePersistedMonaAuth = create<{
    refreshToken:string
}>()(persist(() => ({
    refreshToken: MonaAPI.refreshToken,
}),{
    name:'mona-auth',
    skipHydration: true,
}))

const Mona = new MonaAPI()
export default Mona

type MissingParam = {
    "type": "missing",
    "loc": string[]
    "msg": string
    }

type OTPMIssingError = {
    "detail": MissingParam[]
    }

type InvalidBearerToken = {
    detail:string
    code:string
    messages: {
        token_class: string
        token_type: string
        message: string
    }[]
    }

type InvalidWallet={
    "detail": string
  }

export type MonaUser = {
    "wallets": string[],
    "email": string,
    "username": string,
    "name": string
  }


  export type Token = {
    "chainId": number,
    "contract": string,
    "tokenId": string,
    "kind": "erc721" | "erc1155",
    "name": string,
    "image": string,
    "imageSmall": string,
    "imageLarge": string,
    "metadata": any,
    "description": string,
    "rarityScore": number,
    "rarityRank": number,
    "supply": number,
    "media": any,
    "collection": {
      "id": string,
      "name": string,
      "slug": string,
      "symbol": string,
      "imageUrl": string,
      "tokenCount": number,
      "contractDeployedAt": string
    },
    "floorAsk": {
      "id": string | null,
      "price": {
        "amount": number | null,
        "netAmount": number | null,
        "currency": string | null
      },
      "maker": string | null,
      "validFrom": string | null,
      "validUntil": string | null,
      "quantityFilled": number | null,
      "quantityRemaining": number | null,
      "source": string | null
    },
    "topBid": {
      "id": string | null,
      "price": {
        "amount": number | null,
        "netAmount": number | null,
        "currency": string | null
      },
      "maker": string | null,
      "validFrom": string | null,
      "validUntil": string | null,
      "quantityFilled": number | null,
      "quantityRemaining": number | null,
      "source": string | null
    },
    "files": any[],
    "attributes": {
      "key": string,
      "kind": "string" | "number",
      "value": string | number,
      "tokenCount": number
    }[]
}

export type AnimationResponse = {
    "animationUrl": string,
    "animationType": "avatar"|string,
    "animationFiletype": "vrm"|string
  }

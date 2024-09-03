import { setUser } from "../components/userStore"
import { MonaAPI } from "mona-js-sdk";

const api = import.meta.env.VITE_MONA_APP_ID

const Mona = new MonaAPI({
    apiKey: api,
    autoLogin: {
        enabled: true,
        callbackOnLogin:setUser
    }
})
export default Mona

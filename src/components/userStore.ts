import { create } from "zustand";
import { MonaUser, TokenAnimatable } from 'mona-js-sdk';


export const useUserStore = create<{
    user: MonaUser | null
    inventory: TokenAnimatable[]
}>(()=>({
    user: null,
    inventory: [],
}))

export const setUser = (user:MonaUser)=>{
    useUserStore.setState({user})
}

export const setInventory = (inventory:TokenAnimatable[])=>{
    useUserStore.setState({inventory})
}

export const resetUser = ()=>{
    useUserStore.setState({user:null,inventory:[]})
}
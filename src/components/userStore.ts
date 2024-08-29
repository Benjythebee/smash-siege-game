import { create } from "zustand";
import { MonaAPI, MonaUser, TokenAnimatable } from "../libs/mona";


export const useUserStore = create<{
    user: MonaUser | null
    inventory: TokenAnimatable[]
}>((set)=>({
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
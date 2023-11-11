import { makeAutoObservable, runInAction } from "mobx";
import { User, UserFormValues } from "../Models/user";
import agents from "../API/agent";
import { store } from "./store";
import { router } from "../router/Routes";

export default class UserStore {
    user: User | null = null;

    constructor() {
        makeAutoObservable(this)
    }

    get isLoggedIn() {
        return !!this.user
    }

    login = async (creds: UserFormValues) => {
        try {
            const user = await agents.Account.login(creds)
            store.commonStore.setToken(user.token)
            runInAction(() => this.user = user)

            router.navigate('/activities')
            store.modalStore.closeModal()
        }
        catch (error) {

        }
    }

    register = async (creds: UserFormValues) => {
        try {
            const user = await agents.Account.register(creds)
            store.commonStore.setToken(user.token)
            runInAction(() => this.user = user)

            router.navigate('/activities')
            store.modalStore.closeModal()
        }
        catch (error) {

        }
    }

    logout = () => {
        store.commonStore.setToken(null)
        this.user = null

        router.navigate('/')
    }

    getUser = async () => {
        try {
            const user = await agents.Account.currentUser();

            runInAction(() => {
                this.user = user
            })
        }
        catch (error) {
            console.log(error)
        }
    }

}
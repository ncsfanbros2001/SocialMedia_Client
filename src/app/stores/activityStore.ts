import { makeAutoObservable, runInAction } from "mobx"
import { Activity, ActivityFormValues } from "../Models/activity"
import agents from "../API/agent";
import { format } from "date-fns";
import { store } from "./store";
import { Profile } from "../Models/profile";

export default class ActivityStore {
    activityRegistry = new Map<string, Activity>();
    selectedActivity: Activity | undefined = undefined;
    editMode = false;
    loading = false;
    loadingInitial = false;

    constructor() {
        makeAutoObservable(this)
    }

    setLoadingInitial = (value: boolean) => {
        this.loadingInitial = value
    }

    setLoading = (value: boolean) => {
        this.loading = value
    }

    setEditMode = (value: boolean) => {
        this.editMode = value
    }

    setSelectedActivity = (value: any) => {
        this.selectedActivity = value
    }

    get activitiesByDate() {
        return Array.from(this.activityRegistry.values()).sort((a, b) => a.date!.getTime() - b.date!.getTime())
    }

    get groupedActivities() {
        return Object.entries(
            this.activitiesByDate.reduce((activities, activity) => {
                const date = format(activity.date!, 'dd MMM yyyy')
                activities[date] = activities[date] ? [...activities[date], activity] : [activity]

                return activities
            }, {} as { [key: string]: Activity[] })
        )
    }

    loadActivities = async () => {
        this.setLoadingInitial(true)
        try {
            const activityList = await agents.Activities.list();
            runInAction(() => {
                activityList.forEach(activity => {
                    const user = store.userStore.user;
                    if (user) {
                        activity.isGoing = activity.attendees!.some(a => a.username === user.username);
                        activity.isHost = activity.hostUsername === user.username;
                        activity.host = activity.attendees?.find(x => x.username === activity.hostUsername);
                    }

                    activity.date = new Date(activity.date!)
                    this.activityRegistry.set(activity.id, activity);
                })
            })
            this.setLoadingInitial(false)
        }
        catch (error) {
            console.log(error);
            this.setLoadingInitial(false)
        }
    }

    loadSingleActivity = async (id: string) => {
        let activity = this.activityRegistry.get(id);

        if (activity) {
            this.setSelectedActivity(activity);

            return activity;
        }
        else {
            this.setLoadingInitial(true)
            try {
                activity = await agents.Activities.details(id);

                activity.date = new Date(activity.date!)
                this.activityRegistry.set(activity.id, activity);

                this.setSelectedActivity(activity);
                this.setLoadingInitial(false)

                return activity;
            }
            catch (error) {
                console.log(error)
                this.setLoadingInitial(false)
            }
        }
    }

    createActivity = async (activity: ActivityFormValues) => {
        const user = store.userStore.user;
        const attendee = new Profile(user!)

        try {
            await agents.Activities.create(activity);
            const newActivity = new Activity(activity);
            newActivity.hostUsername = user!.username;
            newActivity.attendees = [attendee];
            this.setSelectedActivity(newActivity)

            runInAction(() => {
                this.setSelectedActivity(newActivity);
            })
        }
        catch (error) {
            console.log(error)
        }
    }

    updateActivity = async (activity: ActivityFormValues) => {
        try {
            await agents.Activities.update(activity);

            runInAction(() => {
                if (activity.id) {
                    let updatedActivity = {
                        ...this.activityRegistry.get(activity.id),
                        ...activity
                    }

                    this.activityRegistry.set(activity.id, updatedActivity as Activity)
                    this.setSelectedActivity(activity)
                }
            })
        }
        catch (error) {
            console.log(error)
        }
    }

    deleteActivity = async (id: string) => {
        this.setLoading(true)

        try {
            await agents.Activities.delete(id);
            this.activityRegistry.delete(id)
            this.setLoading(false)
        }
        catch (error) {
            console.log(error)
            this.setLoading(false)
        }
    }

    updateAttendant = async () => {
        const user = store.userStore.user;
        this.setLoading(true);

        try {
            await agents.Activities.attend(this.selectedActivity!.id);
            runInAction(() => {
                if (this.selectedActivity?.isGoing) {
                    this.selectedActivity.attendees = this.selectedActivity.attendees?.filter(a => a.username !== user?.username)
                    this.selectedActivity.isGoing = false
                }
                else {
                    const attendee = new Profile(user!);
                    this.selectedActivity?.attendees?.push(attendee)
                    this.selectedActivity!.isGoing = true
                }

                this.activityRegistry.set(this.selectedActivity!.id, this.selectedActivity!)
            })
        }
        catch (error) {
            console.log(error)
        }
        finally {
            this.setLoading(false)
        }
    }

    cancelActivityToggle = async () => {
        this.setLoading(true)

        try {
            await agents.Activities.attend(this.selectedActivity!.id)
            runInAction(() => {
                this.selectedActivity!.isCancelled = !this.selectedActivity?.isCancelled;
                this.activityRegistry.set(this.selectedActivity!.id, this.selectedActivity!)
            })
        }
        catch (error) {
            console.log(error)
        }
        finally {
            this.setLoading(false)
        }
    }
}
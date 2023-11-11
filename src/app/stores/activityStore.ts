import { makeAutoObservable, runInAction } from "mobx"
import { Activity } from "../Models/activity"
import agents from "../API/agent";
import { v4 as uuid } from 'uuid';
import { format } from "date-fns";

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

    createActivity = async (activity: Activity) => {
        this.setLoading(true)
        activity.id = uuid();

        try {
            await agents.Activities.create(activity);
            this.activityRegistry.set(activity.id, activity)
            this.setSelectedActivity(activity);
            this.setLoading(false)
        }
        catch (error) {
            console.log(error)
            this.setLoading(false)
        }
    }

    updateActivity = async (activity: Activity) => {
        this.setLoading(true)

        try {
            await agents.Activities.update(activity);

            this.activityRegistry.set(activity.id, activity)
            this.setSelectedActivity(activity)
            this.setEditMode(false)
            this.setLoading(false)
        }
        catch (error) {
            console.log(error)
            this.setLoading(false)
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
}
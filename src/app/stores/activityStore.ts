import { makeAutoObservable, runInAction } from "mobx"
import { Activity } from "../Models/activity"
import agents from "../API/agent";
import { v4 as uuid } from 'uuid';

export default class ActivityStore {
    activityRegistry = new Map<string, Activity>();
    selectedActivity: Activity | undefined = undefined;
    editMode = false;
    loading = false;
    loadingInitial = false;

    constructor() {
        makeAutoObservable(this)
    }

    get activitiesByDate() {
        return Array.from(this.activityRegistry.values()).sort((a, b) => Date.parse(a.date) - Date.parse(b.date))
    }

    get groupedActivities() {
        return Object.entries(
            this.activitiesByDate.reduce((activities, activity) => {
                const date = activity.date
                activities[date] = activities[date] ? [...activities[date], activity] : [activity]

                return activities
            }, {} as { [key: string]: Activity[] })
        )
    }

    loadActivities = () => {
        runInAction(async () => {
            this.loadingInitial = true
            try {
                const activityList = await agents.Activities.list();
                activityList.forEach(activity => {
                    activity.date = activity.date.split('T')[0];
                    this.activityRegistry.set(activity.id, activity);
                })
                this.loadingInitial = false;
            }
            catch (error) {
                console.log(error);
                this.loadingInitial = false;
            }
        })
    }

    loadSingleActivity = async (id: string) => {
        let activity = this.activityRegistry.get(id);

        if (activity) {
            runInAction(() => {
                this.selectedActivity = activity;
                console.log('Activity is exist')
            })

            return activity;
        }
        else {
            this.loadingInitial = true
            try {
                runInAction(async () => {
                    activity = await agents.Activities.details(id);

                    activity.date = activity.date.split('T')[0];
                    this.activityRegistry.set(activity.id, activity);

                    this.selectedActivity = activity;
                    this.loadingInitial = false;
                })

                return activity;
            }
            catch (error) {
                console.log(error)
                runInAction(() => {
                    this.loadingInitial = false
                })
            }
        }
    }

    createActivity = async (activity: Activity) => {
        runInAction(() => {
            this.loading = true
        })
        activity.id = uuid();

        try {
            await agents.Activities.create(activity);
            runInAction(() => {
                this.activityRegistry.set(activity.id, activity)
                this.selectedActivity = activity;
                //this.editMode = false
                this.loading = false
            })
        }
        catch (error) {
            console.log(error)
            runInAction(() => {
                this.loading = false
            })
        }
    }

    updateActivity = async (activity: Activity) => {
        runInAction(() => {
            this.loading = true;
        })

        try {
            await agents.Activities.update(activity);
            runInAction(() => {
                this.activityRegistry.set(activity.id, activity)
                this.selectedActivity = activity
                this.editMode = false
                this.loading = false
            })
        }
        catch (error) {
            console.log(error)
            runInAction(() => {
                this.loading = false
            })
        }
    }

    deleteActivity = async (id: string) => {
        runInAction(() => {
            this.loading = true
        })

        try {
            await agents.Activities.delete(id);
            runInAction(() => {
                this.activityRegistry.delete(id)
                this.loading = false
            })
        }
        catch (error) {
            console.log(error)
            runInAction(() => {
                this.loading = false
            })
        }
    }
}
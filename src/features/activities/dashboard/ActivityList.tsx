import { observer } from "mobx-react-lite";
import { Fragment } from "react";
import { Header } from "semantic-ui-react";
import { Activity } from "../../../app/Models/activity";
import { useStore } from "../../../app/stores/store";
import ActivityListItem from "./ActivityListItem";


const ActivityList = () => {
    const { activityStore } = useStore()
    const { groupedActivities } = activityStore

    return (
        <>
            {groupedActivities.map(([group, activities]) => (
                <Fragment key={group}>
                    <Header sub color="teal">
                        {group}
                    </Header>
                    {activities.map((activity: Activity) => (
                        <ActivityListItem key={activity.id} activity={activity} />
                    ))}
                </Fragment>
            ))}
        </>
    )
}

export default observer(ActivityList)
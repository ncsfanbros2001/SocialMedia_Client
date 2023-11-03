import { observer } from "mobx-react-lite"
import { useEffect } from "react"
import { useParams } from "react-router-dom"
import { Grid } from "semantic-ui-react"
import LoadingComponent from "../../../app/layout/LoadingComponent"
import { useStore } from "../../../app/stores/store"
import ActivityDetailsChat from "./ActivityDetailsChat"
import ActivityDetailsHeader from "./ActivityDetailsHeader"
import ActivityDetailsInfo from "./ActivityDetailsInfo"
import ActivityDetailsSidebar from "./ActivityDetailsSidebar"


const ActivityDetails = () => {
    const { activityStore } = useStore()
    const { selectedActivity, loadSingleActivity, loadingInitial } = activityStore

    const { id } = useParams()

    useEffect(() => {
        if (id) {
            loadSingleActivity(id)
        }
    }, [id, loadSingleActivity])

    if (!selectedActivity || loadingInitial) {
        return <LoadingComponent content='Now Loading...' />
    }

    return (
        <Grid>
            <Grid.Column width={10}>
                <ActivityDetailsHeader activity={selectedActivity} />
                <ActivityDetailsInfo activity={selectedActivity} />
                <ActivityDetailsChat />
            </Grid.Column>

            <Grid.Column width={6}>
                <ActivityDetailsSidebar />
            </Grid.Column>
        </Grid>
    )
}

export default observer(ActivityDetails)
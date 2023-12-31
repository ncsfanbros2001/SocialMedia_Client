import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { Grid } from 'semantic-ui-react';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { useStore } from '../../../app/stores/store';
import ActivityList from './ActivityList';
import ActivityFilter from './ActivityFilter';


const ActivityDashboard = () => {
    const { activityStore } = useStore();
    const { loadActivities, activityRegistry } = activityStore

    useEffect(() => {
        if (activityRegistry.size <= 1) {
            loadActivities()
        }
    }, [loadActivities, activityRegistry.size])


    if (activityStore.loadingInitial) {
        return <LoadingComponent content='Now Loading...' />
    }

    return (
        <>
            <Grid>
                <Grid.Column width={10}>
                    <ActivityList />
                </Grid.Column>

                <Grid.Column width={6}>
                    <ActivityFilter />
                </Grid.Column>
            </Grid>
        </>
    )
}

export default observer(ActivityDashboard)
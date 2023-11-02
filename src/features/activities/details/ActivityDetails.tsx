import { Button, Card, Image } from "semantic-ui-react"
import { useStore } from "../../../app/stores/store"
import LoadingComponent from "../../../app/layout/LoadingComponent"
import { observer } from "mobx-react-lite"
import { Link, useParams } from "react-router-dom"
import { useEffect } from "react"


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
        <Card fluid>
            <Image src={`../../../../public/categoryImages/${selectedActivity.category}.jpg`} />
            <Card.Content>
                <Card.Header>{selectedActivity.title}</Card.Header>

                <Card.Meta>
                    <span>{selectedActivity.date}</span>
                </Card.Meta>

                <Card.Description>
                    {selectedActivity.description}
                </Card.Description>

                <Card.Content extra>
                    <Button.Group widths={2}>
                        <Button basic content='Edit' color='blue' as={Link} to={`/manage/${selectedActivity.id}`} />
                        <Button basic content='Cancel' color='red' as={Link} to={'/activities'} />
                    </Button.Group>
                </Card.Content>
            </Card.Content>
        </Card>
    )
}

export default observer(ActivityDetails)
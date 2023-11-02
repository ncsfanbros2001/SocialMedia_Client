import { observer } from "mobx-react-lite";
import { SyntheticEvent, useState } from "react";
import { Button, Item, Label, Segment } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";
import { Link } from "react-router-dom";


const ActivityList = () => {
    const [target, setTarget] = useState('')

    const { activityStore } = useStore()
    const { deleteActivity, activitiesByDate, loading } = activityStore


    const handleActivityDelete = (e: SyntheticEvent<HTMLButtonElement>, id: string) => {
        setTarget(e.currentTarget.name)
        deleteActivity(id);
    }

    return (
        <Segment>
            <Item.Group divided>
                {activitiesByDate && activitiesByDate.map((item, key) => (
                    <Item key={key}>
                        <Item.Content>
                            <Item.Header as='a'>{item.title}</Item.Header>
                            <Item.Meta>{item.date}</Item.Meta>
                            <Item.Description>
                                <div>{item.description}</div>
                                <div>{item.venue}, {item.city}</div>
                            </Item.Description>
                            <Item.Extra>
                                <Button floated="right" content='View' color="blue" as={Link} to={`/activities/${item.id}`} />

                                <Button loading={loading && target === item.id} name={item.id}
                                    floated="right" content='Delete' color="red" onClick={(e) => handleActivityDelete(e, item.id)} />
                                <Label content={item.category} />
                            </Item.Extra>
                        </Item.Content>
                    </Item>
                ))}
            </Item.Group>
        </Segment>
    )
}

export default observer(ActivityList)
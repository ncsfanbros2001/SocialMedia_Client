import { ChangeEvent, useEffect, useState } from 'react';
import { Button, Form, Segment } from 'semantic-ui-react';
import { useStore } from '../../../app/stores/store';
import { observer } from 'mobx-react-lite';
import { Link, useNavigate, useParams } from 'react-router-dom';
import LoadingComponent from '../../../app/layout/LoadingComponent';

const ActivityForm = () => {
    const { activityStore } = useStore();
    const { createActivity, updateActivity, loading, loadSingleActivity, loadingInitial } = activityStore;

    const navigate = useNavigate();
    const { id } = useParams();

    const [activity, setActivity] = useState<any>({
        id: '',
        title: '',
        category: '',
        description: '',
        date: '',
        city: '',
        venue: ''
    });

    useEffect(() => {
        if (id) {
            loadSingleActivity(id).then((activity: any) => setActivity(activity))
        }
    }, [])

    const handleSubmit = () => {
        if (activity.id) {
            updateActivity(activity).then(() => navigate(`/activities/${activity.id}`))
        }
        else {
            createActivity(activity).then(() => navigate(`/activities/${activity.id}`))
        }
    }

    const handleInputChange = (event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = event.target
        setActivity({
            ...activity,
            [name]: value
        })
    }

    if (loadingInitial) {
        return <LoadingComponent content='Now Loading...' />
    }

    return (
        <Segment clearing>
            <h1>{id ? 'Update' : 'Create New'} Activity</h1>
            <Form onSubmit={handleSubmit} autoComplete="off">

                <Form.Input placeholder='Title' value={activity.title} name='title' onChange={handleInputChange} />
                <Form.TextArea placeholder='Description' value={activity.description} name='description' onChange={handleInputChange} />
                <Form.Input placeholder='Category' value={activity.category} name='category' onChange={handleInputChange} />
                <Form.Input type='date' placeholder='Date' value={activity.date} name='date' onChange={handleInputChange} />
                <Form.Input placeholder='City' value={activity.city} name='city' onChange={handleInputChange} />
                <Form.Input placeholder='Venue' value={activity.venue} name='venue' onChange={handleInputChange} />

                <Button loading={loading} floated='right' type='submit' positive content='Submit' />
                <Button floated='right' type='button' content='Cancel' as={Link} to='/activities' />
            </Form>
        </Segment>
    )
}

export default observer(ActivityForm)
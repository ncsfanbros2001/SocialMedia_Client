import { Form, Formik } from 'formik';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Header, Segment } from 'semantic-ui-react';
import * as Yup from 'yup';
import { Activity } from '../../../app/Models/activity';
import MyDateInput from '../../../app/common/form/MyDateInput';
import MySelectInput from '../../../app/common/form/MySelectInput';
import MyTextArea from '../../../app/common/form/MyTextArea';
import MyTextInput from '../../../app/common/form/MyTextInput';
import { categoryOptions } from '../../../app/common/options/categoryOptions';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { useStore } from '../../../app/stores/store';

const ActivityForm = () => {
    const { activityStore } = useStore();
    const { createActivity, updateActivity, loading, loadSingleActivity, loadingInitial } = activityStore;

    const navigate = useNavigate();
    const { id } = useParams();

    const [activity, setActivity] = useState<Activity>({
        id: '',
        title: '',
        category: '',
        description: '',
        date: null,
        city: '',
        venue: ''
    });

    const validationSchema = Yup.object({
        title: Yup.string().required("Activity title is required"),
        description: Yup.string().required("Activity description is required"),
        date: Yup.string().required("Date is required").nullable(),
        category: Yup.string().required(),
        venue: Yup.string().required(),
        city: Yup.string().required()
    })

    useEffect(() => {
        if (id) {
            loadSingleActivity(id).then((activity) => setActivity(activity!))
        }
    }, [])

    const handleFormSubmit = (activity: Activity) => {
        if (activity.id) {
            updateActivity(activity).then(() => navigate(`/activities/${activity.id}`))
        }
        else {
            createActivity(activity).then(() => navigate(`/activities/${activity.id}`))
        }
    }

    if (loadingInitial) {
        return <LoadingComponent content='Now Loading...' />
    }

    return (
        <Segment clearing>
            <Header content='Activity Details' sub color='teal' />

            <Formik validationSchema={validationSchema}
                enableReinitialize initialValues={activity}
                onSubmit={values => handleFormSubmit(values)}>

                {({ handleSubmit, isSubmitting, isValid, dirty }) => (
                    <Form className='ui form' onSubmit={handleSubmit} autoComplete="off">
                        <MyTextInput name='title' placeholder='Title' />


                        <MyTextArea placeholder='Description' name='description' row={3} />
                        <MySelectInput options={categoryOptions} placeholder='Category' name='category' />
                        <MyDateInput placeholderText='Date' name='date' showTimeSelect timeCaption='time'
                            dateFormat='MMMM d, yyyy h:mm aa' />

                        <Header content='Location Details' sub color='teal' />
                        <MyTextInput placeholder='City' name='city' />
                        <MyTextInput placeholder='Venue' name='venue' />

                        <Button
                            disabled={isSubmitting || !dirty || !isValid}
                            loading={loading}
                            floated='right'
                            type='submit'
                            positive
                            content='Submit' />

                        <Button floated='right' type='button' content='Cancel' as={Link} to='/activities' />
                    </Form>
                )}

            </Formik>
        </Segment>
    )
}

export default observer(ActivityForm)
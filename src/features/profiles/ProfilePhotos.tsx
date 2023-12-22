import { observer } from 'mobx-react-lite'
import { Button, Card, Grid, Header, Image, Tab } from 'semantic-ui-react'
import { Photo, Profile } from '../../app/Models/profile'
import { useStore } from '../../app/stores/store'
import { SyntheticEvent, useState } from 'react'
import PhotoUploadWidget from '../../app/common/imageUpload/PhotoUploadWidget'

interface Props {
    profile: Profile
}

const ProfilePhotos = ({ profile }: Props) => {
    const { profileStore: { isCurrentUser, uploadPhoto, uploading, loading, setMainPhoto, deletePhoto } } = useStore();
    const [addPhotoMode, setAddPhotoMode] = useState(false);

    const [target, setTarget] = useState('');

    const handlePhotoUpload = (file: Blob) => {
        uploadPhoto(file).then(() => setAddPhotoMode(false))
    }

    const handleDeletePhoto = (photo: Photo, e: SyntheticEvent<HTMLButtonElement>) => {
        setTarget(e.currentTarget.name)
        deletePhoto(photo)
    }

    const handleSetMainPhoto = (photo: Photo, e: SyntheticEvent<HTMLButtonElement>) => {
        setTarget(e.currentTarget.name)
        setMainPhoto(photo)
    }

    return (
        <Tab.Pane>
            <Grid>
                <Grid.Column width={16}>
                    <Header floated='left' icon='image' content='Photos' />
                    {isCurrentUser && (
                        <Button floated='right' basic content={addPhotoMode ? 'Cancel' : 'Add Photo'}
                            onClick={() => setAddPhotoMode(!addPhotoMode)} />
                    )}
                </Grid.Column>

                <Grid.Column width={16}>
                    {addPhotoMode ? (
                        <PhotoUploadWidget uploadPhoto={handlePhotoUpload} loading={uploading} />
                    ) : (
                        <Card.Group itemsPerRow={5}>
                            {profile.photos?.map((photo) => (
                                <Card key={photo.id}>
                                    <Image src={photo.url} />
                                    {isCurrentUser && (
                                        <Button.Group fluid widths={2}>
                                            <Button
                                                color='green'
                                                basic
                                                content='Main'
                                                name={'main' + photo.id}
                                                disabled={photo.isMain}
                                                onClick={(e) => handleSetMainPhoto(photo, e)}
                                                loading={target === 'main' + photo.id && loading} />

                                            <Button
                                                color='red'
                                                basic
                                                icon='trash'
                                                loading={target === photo.id && loading}
                                                onClick={(e) => handleDeletePhoto(photo, e)}
                                                disabled={photo.isMain}
                                                name={photo.id} />
                                        </Button.Group>
                                    )}
                                </Card>
                            ))}
                        </Card.Group>
                    )}
                </Grid.Column>
            </Grid>
        </Tab.Pane>
    )
}

export default observer(ProfilePhotos)
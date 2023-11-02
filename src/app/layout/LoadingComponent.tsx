import { Dimmer, Loader } from "semantic-ui-react";

interface Props {
    inverted?: boolean;
    content: string;
}

const LoadingComponent = ({ inverted = true, content = 'Now Loading...' }: Props) => {
    return (
        <Dimmer active={true} inverted={inverted}>
            <Loader content={content} />
        </Dimmer>
    )
}

export default LoadingComponent
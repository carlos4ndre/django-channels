import React from "react"
import { Dimmer, Loader } from "semantic-ui-react"

const LoadingIcon = () => (
    <Dimmer active>
      <Loader size='large'>Loading</Loader>
    </Dimmer>
);

export default LoadingIcon;

import React from "react";
import PropTypes from "prop-types";

import {
  PersonaSectionContent,
  PersonaSectionSide
} from "./persona-section.style";

export const PersonaSection = ({ children, colour }) => (
  <React.Fragment>
    <PersonaSectionSide item xs={false} sm={3} colour={colour} />
    <PersonaSectionContent
      item
      xs={12}
      sm={6}
      container
      direction="column"
      colour={colour}
    >
      {children}
    </PersonaSectionContent>
    <PersonaSectionSide item xs={false} sm={3} colour={colour} />
  </React.Fragment>
);

PersonaSection.propTypes = {
  children: PropTypes.node,
  colour: PropTypes.string
};

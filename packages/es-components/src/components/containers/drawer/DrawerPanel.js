import React, { useImperativeHandle, useRef, useContext } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';

import Heading from '../heading/Heading';
import { DrawerContext } from './DrawerContext';
import {
  useDrawerItemContext,
  DrawerItem,
  DrawerItemBody,
  DrawerItemOpener
} from './DrawerItem';
import Icon from '../../base/icons/Icon';
import useUniqueId from '../../util/useUniqueId';

const PanelWrapper = styled.div`
  border-bottom: 1px solid ${props => props.theme.colors.gray3};
`;

const PanelButton = styled.button`
  background: none;
  border: 0;
  color: ${props => props.theme.colors.primary};
  cursor: pointer;
  display: flex;
  font-size: 18px;
  justify-content: space-between;
  padding: 10px 15px;
  width: 100%;

  @media (hover: hover), (-ms-high-contrast: none) {
    &:hover {
      background-color: ${props => props.theme.colors.gray2};
      color: ${props => props.theme.brandColors.brandPrimary1};
    }
  }
`;

const PanelIcon = styled(props => {
  const { open } = useDrawerItemContext();
  const { openedIconName, closedIconName } = useContext(DrawerContext);
  return <Icon name={open ? openedIconName : closedIconName} {...props} />;
})`
  margin-right: 0.4em;
  position: relative;
  top: -2px;
`;

const styledDrawerItemBody = () => {
  const panelBodyStyle = css`
    background-color: ${props => props.theme.colors.white};
    color: ${props => props.theme.colors.gray9};

    > div {
      border-bottom: 4px solid ${props => props.theme.colors.gray3};
      padding: ${props => (props.noPadding ? '0' : '10px 10px 10px 40px')};
    }
  `;
  const styledBody = styled(DrawerItemBody);

  // handle styled-components v5
  if (styledBody.withConfig)
    return styled(DrawerItemBody).withConfig({
      shouldForwardProp: prop => prop !== 'noPadding'
    })`
      ${panelBodyStyle}
    `;

  return styledBody`${panelBodyStyle}`;
};

const PanelBody = styledDrawerItemBody();

const DrawerPanel = React.forwardRef(function DrawerPanel(props, ref) {
  const {
    children,
    noPadding,
    title,
    titleAside,
    headingLevel,
    ...other
  } = props;

  const buttonRef = useRef();
  useImperativeHandle(ref, () => ({
    focusHeaderButton: () => buttonRef.current.focus()
  }));
  const panelId = useUniqueId(other.id);
  const headingAriaId = `${panelId}-heading`;

  return (
    <DrawerItem id={panelId}>
      <PanelWrapper {...other}>
        <div id={headingAriaId} role="heading" aria-level={headingLevel}>
          <DrawerItemOpener>
            <PanelButton ref={buttonRef}>
              <span>
                <PanelIcon />
                {title}
              </span>
              {titleAside && <aside>{titleAside}</aside>}
            </PanelButton>
          </DrawerItemOpener>
        </div>
        <PanelBody aria-labelledby={headingAriaId} noPadding={noPadding}>
          {children}
        </PanelBody>
      </PanelWrapper>
    </DrawerItem>
  );
});

DrawerPanel.propTypes = {
  children: PropTypes.any.isRequired,
  /** Title text displayed next to the open/close icon */
  title: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.node
  ]).isRequired,
  /** Aside text/content displayed on the right side of the panel title */
  titleAside: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  /** Removes the default padding from the panel body */
  noPadding: PropTypes.bool,
  /** Set desired aria-level for heading */
  headingLevel: Heading.propTypes.level
};

DrawerPanel.defaultProps = {
  noPadding: false,
  titleAside: undefined,
  headingLevel: 2
};

export default DrawerPanel;

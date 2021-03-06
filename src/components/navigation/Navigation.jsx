import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import UserControls from '../user-controls/UserControls';
import NavigationContent from './NavigationContent';
import Icon from '../icon/Icon';

import './Navigation.scss';

import { dummyUser } from '../../data';

class Navigation extends Component {
  constructor(props) {
    super(props);

    this.handleToggleMenu = this.handleToggleMenu.bind(this);

    this.user = dummyUser;

    this.state = {
      showMenu: false
    };
  }

  handleToggleMenu() {
    this.setState(({ showMenu }) => ({ showMenu: !showMenu }));
  }

  render() {
    const { desktopOnly, intl } = this.props;
    const { showMenu } = this.state;
    const { user } = this;
    if (user.role.isPropertyManager !== 'true') {
      return (
        <div className="navigation">
          {desktopOnly && (
            <div className="frontmatter">
              <NavigationContent intl={intl} type="desktop" user={user} />
              <UserControls type="desktop" />
            </div>
          )}
          {!showMenu &&
            !desktopOnly && (
              <div className="actions">
                <button
                  type="button"
                  aria-label="Show Menu"
                  className="menu__btn action action--right"
                  onClick={this.handleToggleMenu}>
                  <Icon icon="menu" />
                </button>
              </div>
            )}

          {showMenu &&
            !desktopOnly && (
              <NavigationContent
                handleToggleMenu={this.handleToggleMenu}
                intl={intl}
                user={user}
              />
            )}
        </div>
      );
    }

    return null;
  }
}

Navigation.propTypes = {
  desktopOnly: PropTypes.bool,
  intl: intlShape.isRequired
};

Navigation.defaultProps = {
  desktopOnly: false
};

export default injectIntl(Navigation);

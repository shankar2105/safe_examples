// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Base from './_Base';

export default class Initialisation extends Component {
  constructor() {
    super();
  }

  componentDidMount() {
    this.props.initialiseApp();
  }

  componentDidUpdate() {

  }

  render() {
    const {
      loading,
      connected,
      fetchedAccessInfo,
      fetchedPublicNames,
      fetchedPublicContainer,
      fetchedServices,
      error } = this.props;

    const connectedCn = classNames('i', {
      done: connected,
      loading: !connected && loading
    });

    const accessCntrCn = classNames('i', {
      done: fetchedAccessInfo,
      loading: !fetchedAccessInfo && loading
    });

    const publicNamesCn = classNames('i', {
      done: fetchedPublicNames,
      loading: !fetchedPublicNames && loading
    });

    const publicCntrCn = classNames('i', {
      done: fetchedPublicContainer,
      loading: !fetchedPublicContainer && loading
    });

    const serviceCn = classNames('i', {
      done: fetchedServices,
      loading: !fetchedServices && loading
    });

    return (
      <Base>
        <div className="card">
          <div className="card-b">
            <h3 className="h type-center">Initialising Application</h3>
            <div className="cntr">
              <div className="init-apps">
                <div className="b">
                  <div className={connectedCn}>Connecting to SAFE Network</div>
                  <div className={accessCntrCn}>Fetching Access Container</div>
                  <div className={publicNamesCn}>Fetching Public Names Container</div>
                  <div className={publicCntrCn}>Fetching _public Container</div>
                  <div className={serviceCn}>Preparing Application</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Base>
    );
  }
}

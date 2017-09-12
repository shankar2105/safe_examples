// @flow
import fs from 'fs';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Base from './_Base';
import WizardNav from './WizardNav';

export default class WithTemplate extends Component {
  constructor() {
    super();
    this.state = {
      editTitle: false,
      editDesc: false,
      title: 'Safe Network sample site',
      description: 'This is a sample website to at Safe Network'
    };
  }

  handlePublish(e) {
    e.preventDefault();
    const { params } = this.props.match;

    const publicName = params.publicName;
    const serviceName = params.serviceName;
    const templateDir = `${__dirname}/components/template`;
    const templateFilePath = `${templateDir}/_index.html`;
    const indexFilePath = `${templateDir}/index.html`;
    try {
      const indexFile = fs.readFileSync(templateFilePath);
      const updatedContent = indexFile.toString().replace('%pt', this.state.title).replace('%t', this.state.title).replace('%d', this.state.description);
      console.log('index', updatedContent);
      fs.writeFileSync(indexFilePath, updatedContent);

    } catch (e) {
      console.error('err', e)
    }
  }
  render() {
    const { params } = this.props.match;

    const publicName = params.publicName;

    return (
      <Base>
        <WizardNav history={this.props.history} />
        <div className="template">
          <div className="banner">
            <div className="title">
              {
                this.state.editTitle ? (<input
                    type="text"
                    value={this.state.title}
                    onChange={(e) => {
                      const value = e.target.value;
                      this.setState({
                        title: value
                      })
                    }}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        this.setState({
                          editTitle: false
                        });
                      }
                    }}
                  />) : (<h3 onClick={(e) => {
                    this.setState({
                      editTitle: true
                    });
                  }}>{this.state.title}</h3>)
              }
            </div>
          </div>
          <div className="context">
            {
              this.state.editDesc ? (<input
                    type="text"
                    value={this.state.description}
                    onChange={(e) => {
                      const value = e.target.value;
                      this.setState({
                        description: value
                      })
                    }}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        this.setState({
                          editDesc: false
                        });
                      }
                    }}
                  />) : (<h3 onClick={(e) => {
                  this.setState({
                    editDesc: true
                  });
                }}>{this.state.description}</h3>)
            }
          </div>
        </div>
        <div className="card">
          <div className="card-b">
            <div className="opts">
              <div className="opt">
                <button
                  type="button"
                  className="btn flat"
                  onClick={(e) => {
                    e.preventDefault();
                    this.props.history.push(`/newWebSite/${publicName}`);
                  }}
                >Cancel</button>
              </div>
              <div className="opt">
                <button
                  type="button"
                  className="btn flat primary"
                  onClick={this.handlePublish.bind(this)}
                >Publish</button>
              </div>
            </div>
          </div>
        </div>
      </Base>
    );
  }
}

WithTemplate.propTypes = {

};

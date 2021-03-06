import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import Header from '../../components/header/Header';
import Input from '../../components/input/Input';
import ConfirmationModal from '../../components/confirmation-modal/ConfirmationModal';
import SuccessModal from '../../components/success-modal/SuccessModal';
import Navigation from '../../components/navigation/Navigation';
import { propertyManagers } from '../../data';
import { creatingProperty } from '../../dux/properties';
import Search from '../../components/search/Search';
import './NewPropertyForm.scss';

class NewPropertyForm extends Component {
  constructor(props) {
    super(props);

    this.handleSelectionFromSearch = this.handleSelectionFromSearch.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.toggleConfirmationModal = this.toggleConfirmationModal.bind(this);
    this.isSaveEnabled = this.isSaveEnabled.bind(this);
    this.addAnotherProperty = this.addAnotherProperty.bind(this);
    this.redirectHome = this.redirectHome.bind(this);

    this.state = {
      confirmingSubmit: false,
      showModal: false,
      propertyManagerSelected: "",
      properties: {
        name: "",
        addressOne: "",
        addressTwo: "",
        city: "",
        state: "",
        zipCode: "",
        numberOfUnits: ""
      }
    };
  }

  handleChange(event) {
    const { target } = event;
    const { name } = target;
    const { value } = target;
    this.setState(prevState => ({
      properties: { ...prevState.properties, [name]: value}
    }));
  }

  handleSelectionFromSearch(nameSearched) {
    if
    (Object.keys(nameSearched).includes('name')) {
      this.setState({ propertyManagerSelected: nameSearched });
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    const { dispatch } = this.props;
    const { name, addressOne, addressTwo, city, state, zipCode, numberOfUnits } = this.state.properties;
    dispatch(creatingProperty({
      name, addressOne, addressTwo, city, state, zipCode, numberOfUnits
    }));
    this.setState(prevState => ({
      confirmingSubmit: !prevState.confirmingSubmit
    }))
    this.state.properties.name = "";
    this.state.properties.addressOne = "";
    this.state.properties.city = "";
    this.state.properties.state = "";
    this.state.properties.zipCode = "";
    this.state.properties.numberOfUnits = "";
    this.state.propertyManagerSelected = "";
  }

  isSaveEnabled() {
    const propertyName = this.state.properties.name;
    const propertyAddress = this.state.properties.addressOne;
    const propertyCity = this.state.properties.city;
    const propertyState = this.state.properties.state;
    const propertyZipCode = this.state.properties.zipCode;
    const propertyUnits = this.state.properties.numberOfUnits;
    if(propertyName && propertyAddress && propertyCity && propertyState && propertyZipCode && propertyUnits){
      return true;
    }
    return false;
  }

  addAnotherProperty(event) {
    event.preventDefault();
    this.setState(prevState => ({
      confirmingSubmit: !prevState.confirmingSubmit,
    }));
    this.toggleConfirmationModal(event);
  }

  redirectHome() {
    this.props.history.push('/');
  }

  toggleConfirmationModal(event) {
    event.preventDefault();
    this.setState(prevState => ({
      showModal: !prevState.showModal,
    }));
  }

  render() {
    const isEnabled = this.isSaveEnabled();

    return (
      <div className="admin page">
        <Header>
          {() => (
            <div>
              <Navigation />
              <Header.Label
                label="JOIN Messenger Administration"
                type="basic"
                />
            </div>
          )}
        </Header>
        <div>
          <div className="width-wrapper">
            <h2 className="admin--header align--left">
              Add a New Property
            </h2>
            <form id="newPropertyForm">
              <section className="newPropertyFormSection">
                <h2 className="newPropertyFormHeading">Property Information</h2>
                <Input
                  id="name"
                  name="name"
                  label="Name"
                  type="text"
                  value={this.state.properties.name}
                  placeholder="Property Name"
                  onChange={this.handleChange}
                  />
                <Input
                  id="addressOne"
                  name="addressOne"
                  label="Address"
                  type="text"
                  value={this.state.properties.addressOne}
                  placeholder="Property Address"
                  onChange={this.handleChange}
                  />
                <Input
                  id="city"
                  name="city"
                  label="City"
                  type="text"
                  value={this.state.properties.city}
                  placeholder="City"
                  onChange={this.handleChange}
                  />
                <Input
                  id="state"
                  name="state"
                  label="State"
                  type="text"
                  value={this.state.properties.state}
                  placeholder="State"
                  onChange={this.handleChange}
                  />
                <Input
                  id="zipCode"
                  name="zipCode"
                  label="Zipcode"
                  type="text"
                  value={this.state.properties.zipCode}
                  placeholder="Zip"
                  onChange={this.handleChange}
                  />
                <Input
                  id="numberOfUnits"
                  name="numberOfUnits"
                  label="Units"
                  type="text"
                  value={this.state.properties.numberOfUnits}
                  placeholder="Units"
                  onChange={this.handleChange}
                  />
              </section>
              <section className="newPropertyFormSection">
                <h2 className="newPropertyFormManagerHeading">Assign Property Managers</h2>
                <fieldset>
                  <Search
                    searchData={propertyManagers}
                    value={this.state.propertyManagerSelected}
                    placeholder= "Search Property Managers"
                    filterSubset={['firstName', 'lastName', 'name']}
                    onSearchSelection={this.handleSelectionFromSearch}
                    multiple
                    />
                </fieldset>
              </section>
              <section className="newPropertyFormSection">
                <button
                  onClick={this.toggleConfirmationModal}
                  disabled={!isEnabled}
                  type="submit"
                  className="btn">
                  Save
                </button>
              </section>
            </form>
          </div>
        </div>
        {!this.state.confirmingSubmit && (
          <ConfirmationModal
            show={this.state.showModal}
            onClose={this.toggleConfirmationModal}
            onSubmit={this.handleSubmit}>
            Are you sure you want to save {this.state.properties.name}, {this.state.properties.addressOne} {this.state.properties.city}, {this.state.properties.state} {this.state.properties.zipCode}
            ?
          </ConfirmationModal>
        )
      }
      {this.state.confirmingSubmit && (
        <SuccessModal
          show={this.state.showModal}
          onClick={this.addAnotherProperty}
          onClose={this.redirectHome}>
          Property Created Successfully!
        </SuccessModal>
      )
    }
  </div>
);
}
}

NewPropertyForm.propTypes = {
  dispatch: PropTypes.func.isRequired,
  history: PropTypes.string.isRequired
}

const mapStateToProps = state => ({
  properties: state.properties
})

export default withRouter(injectIntl(connect(mapStateToProps)(NewPropertyForm)));

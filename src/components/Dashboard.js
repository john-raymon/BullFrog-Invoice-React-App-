import React, { Component } from 'react'
import { connect } from 'react-redux'

// Selectors
import getInvoicesToDo from '../state/selectors/getInvoicesToDo'
import getCustomerSearchResults from '../state/selectors/getCustomerSearchResults'

// Views
import ListButton from '../views/ListButton'

// Images
import searchIcon from '../images/search-icon.png';

// Dashboard Actions
import { fetchKnackCustomers } from '../state/actions/dashboardActions'


class Dashboard extends Component {
  constructor(props) {
    super(props)
    this.handleSearchChange = this.handleSearchChange.bind(this)
    this.state = {
      searchQuery: ''
    }
  }

  handleSearchChange(e) {
    this.setState({
      [e.target.name] : e.target.value
    })
    this.props.fetchKnackCustomers(this.state.searchQuery)
  }

  render() {
    const { props, state } = this
    const invoicesToDo = () => {
      if (props.isLoading.invoicesToDo) {
        return (<p>Loading ... </p>)
      }
      if (props.isError.invoicesToDo) {
        return (<p>There seems to be an error</p>)
      }
      console.log('these are the invoices to do', props.invoicesToDo)
      return props.invoicesToDo.map((invoice, index) => {
        return (
          <li key={index}>
            <div className="flex flex-row items-center bb b--light-gray pv1">
              <p className="dinLabel near-black f7 ma0 w-25 tracked-mega">
                { invoice.date }
              </p>
              <p className="dinLabel near-black f7 ma0 w-50 tracked-mega small-caps">
                { invoice.customer.name || 'No Name' }
              </p>
              <ListButton>
                CREATE INVOICE
              </ListButton >
            </div>
          </li>
        )
      })
    }
    const customerSearchResults = () => {
      if (props.isLoading.customers) {
        return (<p>Loading</p>)
      }
      if (props.isError.customers) {
        return (<p>There seems to be an error</p>)
      }
      if (!props.customers.length && this.state.searchQuery.trim()) {
        return (
          <p>We could find any customers on Knack relating to your search.</p>
        )
      }
      return props.customers.map((customer, index) => {
        return (
          <li key={index}>
            <div className="flex flex-row justify-between items-center bb b--light-gray pv1">
              <p className="dinLabel near-black f7 ma0 w-50 tracked-mega small-caps">
                {customer.customerName}
              </p>
              <ListButton>
                CREATE INVOICE
              </ListButton >
            </div>
          </li>
        )
      })
    }
    return(
      <div className="flex flex-column w-100 measure-80 center pt5 ph3 mb4">
        <div className="flex flex-row w-100 items-start">
          <div className="w-50">
            <p className="dinTitle tl mid-gray pa0 ma0">
              Hello,
              <br/>
              get started now and
              <br/>
              <span className="blue lh-title b--blue bb bw2 pointer dim">create an invoice.</span>
            </p>
          </div>

          <div className="w-50 ba b--light-gray bw1 h5 br3 ph4 pt1 shadow-custom">
            <p className="dinLabel tr mid-gray mb0">
              Invoices To Do ({props.invoicesToDo.length ||`0`})
            </p>
            <div className="w-100">
              <div className="flex flex-row items-center bb b--light-gray bw1 pb1">
                <p className="dinLabel mid-gray f7 ma0 w-25 tracked-mega">
                  DATE
                </p>
                <p className="dinLabel mid-gray f7 ma0 w-50 tracked-mega">
                  CUSTOMER
                </p>
              </div>
              <ul className="list ma0 pa0 overflow-scroll h4">
                { invoicesToDo() }
              </ul>
            </div>
          </div>
        </div>
        <div className="flex flex-row w-100 items-start pt4">
         <div className="w-50 pr4">
            <div className="w-100 ba b--light-gray bw1 h6 br3 ph4 pt1 shadow-custom">
              <p className="dinLabel tl mid-gray mb0">
                Previous Estimates ({`0`})
              </p>
              <div className="w-100 mt2">
                <ul className="list ma0 pa0 overflow-scroll h4">
                  <li>
                    <div className="flex flex-row items-center bb b--light-gray pv1">
                      <p className="dinLabel near-black f7 ma0 w-25 tracked-mega">
                        03/16/19
                      </p>
                      <p className="dinLabel near-black f7 ma0 w-50 tracked-mega small-caps">
                        Alexson Wilson
                      </p>
                      <ListButton>
                        CREATE INVOICE
                      </ListButton >
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="w-50">
            <div className="w-100 ba b--light-gray bw1 h6 br3 ph4 pt1 shadow-custom">
              <div className="flex flex-row items-center bt- bl-0 br-0 bb b--light-gray mt3 mb2 w-70 pv1">
                <span>
                  <img src={searchIcon} width="16" height="auto" />
                </span>
                <input
                  onChange={this.handleSearchChange}
                  className="dinLabel pa0 ml2 tl mid-gray input-reset bn outline-0 flex-grow-1"
                  type="text"
                  name="searchQuery"
                  placeholder="Find a Customer"
                  value={this.state.searchQuery}
                  />
              </div>
              <ul className="list mt2 mb0 mh0 pa0 overflow-scroll h5">
                {customerSearchResults()}
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  const { status, errors} = state
  const { dashboard: dashboardStatus } = status
  const { dashboard: dashboardErrors } = errors
  return {
    isLoading: {
      invoicesToDo: dashboardStatus.invoicesToDo,
      customers: dashboardStatus.customers
    },
    isError: {
      invoicesToDo: dashboardErrors.invoicesToDo,
      customers: dashboardErrors.customers
    },
    invoicesToDo: !(dashboardErrors.invoicesToDo && dashboardStatus.invoicesToDo) ? getInvoicesToDo(state) : [],
    customers: !(dashboardErrors.customers && dashboardStatus.customers) ? getCustomerSearchResults(state) : []
  }
}

export default connect(mapStateToProps, { fetchKnackCustomers })(Dashboard)

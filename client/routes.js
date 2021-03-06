import React, {Component} from 'react'
import {connect} from 'react-redux'
import {withRouter, Route, Switch} from 'react-router-dom'
import PropTypes from 'prop-types'
import {Login, Signup, UserHome} from './components'
import {me} from './store'
import AllShovelsView from './components/allShovels'
import Checkout from './components/checkout'
import SingleShovel from './components/singleShovel'
import CartView from './components/cart'
import MyAccount from './components/myAccount'
import Orders from './components/orders'
import AdminPortal from './components/adminPortal'
import AdminShovels from './components/adminShovels'
import AdminEditShovel from './components/adminEditShovel'
import AdminUsers from './components/adminUsers'
import {getCartThunk} from './store/cart'
import ResetPassword from './components/resetPassword'
import AllOrders from './components/adminOrders'
import NotFound from './components/notFound'
import Pirate from './components/pirate'
import MediaQuery from 'react-responsive'
import Splash from './components/Splash'
import SplashTest from './components/SplashPara'
import SplashScroll from './components/SplashScroll'
import styled from 'styled-components'
import {getBrandsThunk} from './store/brands'

//IF YOU DELETE THIS LOOK AT LOTS OF PAGES AND MAKE SURE THE NAV BAR ISNT BLOCKING PARTS OF THE SITE
const MarginDiv = styled.div`
  padding-top: 104px;
  @media (min-width: 337px) {
    padding-top: 77px;
  }
`
/**
 * COMPONENT
 */
class Routes extends Component {
  componentDidMount() {
    this.props.loadInitialData()
  }

  render() {
    const {isLoggedIn} = this.props
    const passwordResetCheck = this.props.user.needPasswordReset
    console.log(this.props)
    return (
      <MarginDiv>
        <Switch>
          {/* Routes placed here are available to all visitors */}
          <Route path="/home" component={UserHome} />
          <Route path="/login" component={Login} />
          <Route path="/signup" component={Signup} />
          <Route exact path="/checkout" component={Checkout} />

          {!passwordResetCheck && (
            <Switch>
              {/* Routes placed here are only available after logging in */}
              <Route exact path="/home" component={UserHome} />
              <Route exact path="/" component={SplashTest} />
              <Route exact path="/shovels" component={AllShovelsView} />
              <Route path="/shovels/:shovelId" component={SingleShovel} />
              <Route exact path="/cart" component={CartView} />
              <Route exact path="/myAccount" component={MyAccount} />
              <Route exact path="/myAccount/orders" component={Orders} />
              {this.props.user.isAdmin && (
                <Route exact path="/adminPortal" component={AdminPortal} />
              )}
              <Route path="/adminPortal/allShovels" component={AdminShovels} />
              {this.props.user.isAdmin && (
                <Route
                  path="/adminPortal/editShovel/:shovelId"
                  component={AdminEditShovel}
                />
              )}
              <Route path="/adminPortal/allUsers" component={AdminUsers} />
              {this.props.user.isAdmin && (
                <Route path="/adminPortal/allOrders" component={AllOrders} />
              )}
              <Route path="/pirate" component={Pirate} />
              <Route path="/" component={NotFound} />
            </Switch>
          )}

          {isLoggedIn && passwordResetCheck && <ResetPassword />}
        </Switch>
      </MarginDiv>
    )
  }
}

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    // Being 'logged in' for our purposes will be defined has having a state.user that has a truthy id.
    // Otherwise, state.user will be an empty object, and state.user.id will be falsey
    isLoggedIn: !!state.user.id,
    user: state.user
  }
}

const mapDispatch = dispatch => {
  return {
    loadInitialData() {
      dispatch(me())
      dispatch(getCartThunk())
      dispatch(getBrandsThunk())
    }
  }
}

// The `withRouter` wrapper makes sure that updates are not blocked
// when the url changes
export default withRouter(connect(mapState, mapDispatch)(Routes))

/**
 * PROP TYPES
 */
Routes.propTypes = {
  loadInitialData: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired
}

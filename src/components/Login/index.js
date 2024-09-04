import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

class Login extends Component {
  state = {userId: '', userPin: '', errMsg: '', showSubmitErr: false}

  handleUserId = event => {
    this.setState({userId: event.target.value})
  }

  handlePin = event => {
    this.setState({userPin: event.target.value})
  }

  loginSuccess = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    history.replace('/')
  }

  loginFailure = errorMsg => {
    this.setState({errMsg: errorMsg, showSubmitErr: true})
  }

  handleFormSubmit = async event => {
    event.preventDefault()
    const {userId, userPin} = this.state
    const url = 'https://apis.ccbp.in/ebank/login'
    const options = {
      method: 'POST',
      body: JSON.stringify({
        user_id: userId,
        pin: userPin,
      }),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok) {
      this.loginSuccess(data.jwt_token)
    } else {
      this.loginFailure(data.error_msg)
    }
  }

  render() {
    const token = Cookies.get('jwt_token')
    if (token !== undefined) {
      return <Redirect to="/" />
    }
    const {errMsg, showSubmitErr} = this.state

    return (
      <div className="login-main-container">
        <div className="login-sub-container">
          <div className="login-img-container">
            <img
              src="https://assets.ccbp.in/frontend/react-js/ebank-login-img.png"
              alt="website login"
            />
          </div>
          <form
            className="form-main-container"
            onSubmit={this.handleFormSubmit}
          >
            <h1 className="form-heading">Welcome Back!</h1>
            <label className="form-label" htmlFor="userId">
              User ID
            </label>
            <input
              onChange={this.handleUserId}
              placeholder="Enter User ID"
              className="form-input"
              id="userId"
              type="text"
            />
            <label className="form-label" htmlFor="pin">
              PIN
            </label>
            <input
              onChange={this.handlePin}
              placeholder="Enter PIN"
              className="form-input"
              id="pin"
              type="password"
            />
            <div className="login-btn-container">
              <button type="submit">Login</button>
            </div>
            {showSubmitErr ? <p className="err-msg-para">{errMsg}</p> : ''}
          </form>
        </div>
      </div>
    )
  }
}

export default Login

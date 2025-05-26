import axios from 'axios'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import Button from '../components/Button'
import Input from '../components/Input'
import ButtonLink from '../components/ButtonLink'
import { 
  updateDetails, 
  resetDetails, 
  setErrorMsg,
} from '../redux/authSlice'

function RegisterPage({ isUsernameValid, jwtKey }) {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const registerDetails = useSelector(state => state.authUser.signupDetails)
  const errorMsg = useSelector(state => state.authUser.errorMsg)

  function isPasswordValid() {
    const { password, confirmPassword } = registerDetails

    const MIN_PASSWORD_LEN = 10
    const specialCharRegexPattern = /[^a-zA-Z0-9]/
    const numberRegexPattern = /\d/

    const hasNumber = numberRegexPattern.test(password)
    const hasSpecialChar = specialCharRegexPattern.test(password)

    let passwordErrorMsg = ''

    if (password.length < MIN_PASSWORD_LEN) {
      passwordErrorMsg = `Password too short, minimum length must be ${MIN_PASSWORD_LEN} NOT ${password.length}.`
    } else if (password !== confirmPassword) {
      passwordErrorMsg = 'Passwords do not match.'
    } else if (!hasSpecialChar) {
      passwordErrorMsg = 'Password needs at least one special character.'
    } else if (!hasNumber) {
      passwordErrorMsg = 'Password needs at least one number.'
    }

    const isValid = passwordErrorMsg.length === 0

    if (!isValid) {
      dispatch(setErrorMsg(passwordErrorMsg))
    }

    return isValid
  }

  function isEmailValid() {
    const email = registerDetails.email
    const emailRegexPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    const valid = emailRegexPattern.test(email)

    if (!valid) {
      dispatch(setErrorMsg('Invalid email format.'))
    }

    return valid
  }

  async function validateRegisterDetails(event) {
    event.preventDefault()

    dispatch(setErrorMsg(""))

    if (!isUsernameValid(registerDetails.username, msg => dispatch(setErrorMsg(msg)))) {
      dispatch(resetDetails(['username']))
      return -1
    }

    if (!isEmailValid()) {
      dispatch(resetDetails(['email']))
      return -1
    }

    if (!isPasswordValid()) {
      dispatch(resetDetails(['password', 'confirmPassword']))
      return -1
    }

    try {
      const response = await axios.post('http://localhost:5000/user/register', registerDetails)
      const status = response.status

      if (status === 400) {
        // handle user/email exists errors here if backend differentiates them
        dispatch(setErrorMsg('User or email already exists.'))
        return -1
      }

      if (status >= 200 && status < 300) {
        dispatch(resetDetails(Object.keys(registerDetails))) // reset all signup fields
        dispatch(setErrorMsg(""))
        navigate('/login')
      }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <>
      <ButtonLink destination={'/'}>Back</ButtonLink>

      <form onSubmit={validateRegisterDetails}>
        <Input
          type='text'
          placeholder='username...'
          value={registerDetails.username}
          maxLength={30}
          onChange={(e) => dispatch(updateDetails({ field: 'username', value: e.target.value }))}
        />

        <Input
          type='email'
          placeholder='email...'
          value={registerDetails.email}
          maxLength={254}
          onChange={(e) => dispatch(updateDetails({ field: 'email', value: e.target.value }))}
        />

        <Input
          type='password'
          placeholder='password...'
          value={registerDetails.password}
          onChange={(e) => dispatch(updateDetails({ field: 'password', value: e.target.value }))}
        />

        <Input
          type='password'
          placeholder='confirm password...'
          value={registerDetails.confirmPassword}
          onChange={(e) => dispatch(updateDetails({ field: 'confirmPassword', value: e.target.value }))}
        />

        <Button type='submit'>Register</Button>
      </form>

      <h3>
        Already have an account? <ButtonLink destination={'/login'}>Login</ButtonLink>
      </h3>

      <h1>{registerDetails.email}</h1>
      <h1>{registerDetails.password}</h1>
      <h1>{registerDetails.confirmPassword}</h1>
      <h1>{errorMsg}</h1>
    </>
  )
}

export default RegisterPage

import FormLogin from '../components/login/FormLogin'
import FormRegister from '../components/login/FormRegister'
import '../styles/login.css'

export default function Login () {
  return (
    <div className="container-forms">
      <input type="checkbox" name="change-form" id="change-form" />
      <div className="forms">
        <FormLogin />

        <FormRegister />
      </div>
    </div>
  )
}

import React, {Component} from 'react';
import Input from '../../components/UI/Input/Input'
import Button from '../../components/UI/Button/Button'
import Spinner from '../../components/UI/Spinner/Spinner'
import classes from './Auth.css'
import {connect} from 'react-redux'
import * as actions from "../../store/actions/index";
import {Redirect} from 'react-router-dom'

class Auth extends Component {
    state = {
        controls: {
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'email',
                    placeholder: 'Your Email'
                },
                value: '',
                validation: {
                    required: true,
                    isEmail: true

                },
                valid: false,
                touched: false
            },
            password: {
                elementType: 'input',
                elementConfig: {
                    type: 'password',
                    placeholder: 'Password'
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 6

                },
                valid: false,
                touched: false
            }
        },
        isSignUp: true
    }

    componentDidMount() {
        if (!this.props.buildingBurger && this.props.authRedirectPath !== "/") {
            this.props.onSetAuthRedirectPath();
        }
    }
    checkValidity = (value, rules) => {


        let isValid = true;

        if (rules.required) {
            isValid = value.trim() !== '' && isValid
        }

        if (rules.minLength) {
            isValid = value.length >= rules.minLength && isValid
        }

        if (rules.maxLength) {
            isValid = value.length <= rules.maxLength && isValid
        }


        if (rules.isEmail) {
            let pattern = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
            isValid = pattern.test(value) && isValid;
        }

        return isValid;


    }


    inputChangeHandler = (event, controlName) => {
        const updatedControls = {
            ...this.state.controls,
            [controlName]: {
                ...this.state.controls[controlName],
                value: event.target.value,
                valid: this.checkValidity(event.target.value, this.state.controls[controlName].validation),
                touched: true
            }
        }
        this.setState({
            controls: updatedControls
        })
    }

    submitHandler = (event) => {
        event.preventDefault();
        this.props.onAuth(this.state.controls.email.value, this.state.controls.password.value, this.state.isSignUp)
    }

    switchAuthModeHandler = () => {
        this.setState(prevState => {
            return {
                isSignUp: !prevState.isSignUp
            }
        })
    }

    render() {
        const formElementsArray = [];
        for (let key in this.state.controls) {
            formElementsArray.push(
                {id: key, config: this.state.controls[key]}
            )

        }
        let form = formElementsArray.map(element => {
            return (<Input key={element.id} elementType={element.config.elementType}
                           elementConfig={element.config.elementConfig}
                           value={element.config.value}
                           shouldValidate={element.config.validation}
                           invalid={!element.config.valid}
                           touched={element.config.touched}
                           changed={(event) => this.inputChangeHandler(event, element.id)}
            />)
        })

        if (this.props.loading) {
            form = <Spinner/>
        }

        let errorMessage = null;

        if (this.props.error) {
            errorMessage = (<p>{this.props.error.message}</p>)
        }

        let authRedirect = null;
        if (this.props.isAuthenticated) {
            authRedirect = <Redirect to={this.props.authRedirectPath}/>
        }

        return (
            <div className={classes.Auth}>
                {authRedirect}
                {errorMessage}
                <form onSubmit={this.submitHandler}>
                    {form}
                    <Button btnType="Success">
                        Submit
                    </Button>

                </form>
                <Button btnType="Danger" clicked={this.switchAuthModeHandler}>
                    Switch to {this.state.isSignUp ? 'signin' : 'signup'}

                </Button>
            </div>
        );
    }


}

const mapStateToProps = (state) => {
    return {
        loading: state.auth.loading,
        error: state.auth.error,
        isAuthenticated: state.auth.token !== null,
        buildingBurger: state.burgerBuilder.building,
        authRedirectPath: state.auth.authRedirectPath
    }
}


const mapDispatchToProps = (dispatch) => {
    return {
        onAuth: (email, password, isSignUp) => dispatch(actions.auth(email, password, isSignUp)),
        onSetAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath("/"))
    }

}

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
import React, {Component} from 'react';
import Button from '../../../components/UI/Button/Button'
import classes from './ContactData.css'
import axios from '../../../axios-orders'
import Spinner from '../../../components/UI/Spinner/Spinner'
import Input from '../../../components/UI/Input/Input'
import {connect} from 'react-redux'
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler'
import * as actions from "../../../store/actions/index";

class ContactData extends Component {
    state = {
        orderForm: {

            name: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Your Name'
                },
                value: '',
                validation: {
                    required: true

                },
                valid: false,
                touched: false
            },// 'Samuel David',

            street: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Street'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            zipCode: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Zip Code'
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 5,
                    maxLength: 5
                },
                valid: false,
                touched: false
            },
            country: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Country'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },

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
            deliveryMethod: {
                elementType: 'select',
                elementConfig: {
                    options: [
                        {value: 'fastest', displayValue: 'Fastest'},
                        {value: 'cheapest', displayValue: 'Cheapest'}
                    ]
                },
                value: 'fastest',
                validation: {},
                valid: true
            }
        },
        formIsValid: false
    };
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
    orderHandler = (event) => {
        event.preventDefault();


        // this.setState({ loading: true })
        const formData = {};

        for (let formElemenetId in this.state.orderForm) {
            formData[formElemenetId] = this.state.orderForm[formElemenetId].value
        }

        const order = {
            ingredients: this.props.ings,
            price: this.props.price,
            orderData: formData

        }

        this.props.onOrderBurger(order);



    };

    inputChangedHandler = (event, inputId) => {
        const updatedOrderForm = {
            ...this.state.orderForm
        };
        const updatedFormElement = {...updatedOrderForm[inputId]};
        //console.log(event.target.value)

        updatedFormElement.value = event.target.value;
        updatedFormElement.valid = this.checkValidity(updatedFormElement.value, updatedFormElement.validation)
        updatedFormElement.touched = true
        console.log(updatedFormElement)
        updatedOrderForm[inputId] = updatedFormElement;


        let formIsValid = true


        for (let inputId in updatedOrderForm) {

            formIsValid = updatedOrderForm[inputId].valid && formIsValid
        }


        this.setState({orderForm: updatedOrderForm, formIsValid: formIsValid});
    };

    render() {
        const formElementsArray = [];
        for (let key in this.state.orderForm) {
            formElementsArray.push(
                {id: key, config: this.state.orderForm[key]}
            )

        }

        let form = (
            <form onSubmit={this.orderHandler}>

                {formElementsArray.map((formElement) => {
                    return (<Input key={formElement.id} elementType={formElement.config.elementType}
                                   elementConfig={formElement.config.elementConfig}
                                   value={formElement.config.value}
                                   shouldValidate={formElement.config.validation}
                                   invalid={!formElement.config.valid}
                                   touched={formElement.config.touched}
                                   changed={(event) => this.inputChangedHandler(event, formElement.id)}
                    />)
                })

                }
                <Button btnType="Success" disabled={!this.state.formIsValid}> ORDER </Button>
            </form>);

        if (this.props.loading) {
            form = <Spinner />
        }
        return (<div className={classes.ContactData}>
            <h4>Enter your contact data </h4>
            {form}
        </div>);
    }

}


const mapStateToProps = (state) => {

    return {
        ings: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        loading: state.order.loading

    }

};

const mapDispatchToProps = (dispatch) => {
    return {
        onOrderBurger: (orderData) => dispatch(actions.purchaseBurger(orderData))
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(ContactData, axios));
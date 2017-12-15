import React, { Component } from 'react';
import Aux from '../../hoc/Aux/Aux'
import Burger from '../../components/Burger/Burger'
import BuildControls from '../../components/Burger/BuildControls/BuildControls'
import Modal from '../../components/UI/Modal/Modal'
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary'
import axios from '../../axios-orders'
import Spinner from '../../components/UI/Spinner/Spinner'
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'


import {connect} from 'react-redux'
import * as actions from "../../store/actions/index";



class BurgerBuilder extends Component {
    state = {

        purchasing: false,

    }
    componentDidMount() {
        /*
        axios.get('https://react-burger-builder-d2639.firebaseio.com/ingredients.json').then(response => {
            const ingredients = response.data;

            this.setState({ ingredients: ingredients })

        }).catch( err => {
            this.setState({ error: true })
            
        })
        */
        this.props.onInitIngredietns();
    }


    updatePurchaseState(ingredients) {

        const sum = Object.keys(ingredients)
            .map(igkey => {
                return ingredients[igkey];
            }).reduce((sum, el) => {
                return sum + el;
            }, 0)
        return sum > 0
    }


    purchaseHandler = () => {
        if (this.props.isAuthenticated) {
            this.setState({purchasing: true})
        } else {
            this.props.onSetAuthRedirectPath('/checkout');
            this.props.history.push('/auth')
        }


    }
    purchaseCancelHander = () => {
        this.setState({ purchasing: false })
    }

    purchaseContinueHandler = () => {
        /*
                const queryParams = [];

                for(let i in this.props.ings){
                    queryParams.push( encodeURIComponent( i) + "="+encodeURIComponent(this.props.ings[i])  )
                }
                queryParams.push('price='+this.props.price)
                const queryString = queryParams.join('&')
                 this.props.history.push({pathname:'/checkout',search:'?'+queryString  })
                */
        this.props.onInitPurchase()
        this.props.history.push('/checkout');


    }



    render() {
        const disabledInfo = {
            ...this.props.ings
        };
        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0;
        }

        let orderSummary = null;
        let burger = this.props.error ? <p>Ingredients couldn't be loaded</p> : <Spinner/>;


        if (this.props.ings) {

            burger = (
                <Aux>
                    <Burger ingredients={this.props.ings}/>
                    <BuildControls

                        ingredientAdded={this.props.onIngredientAdded}
                        ingredientRemoved={this.props.onIngredientRemoved}
                        disabled={disabledInfo}
                        purchasable={this.updatePurchaseState(this.props.ings)}
                        price={this.props.price}
                        ordered={this.purchaseHandler}
                        isAuth={this.props.isAuthenticated}
                    />
                </Aux>
            )
            orderSummary = <OrderSummary
                ingredients={this.props.ings}
                price={this.props.price}
                purchaseCancelled={this.purchaseCancelHander}
                purchaseContinued={this.purchaseContinueHandler} />
        }




        return (

            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHander}>
                    {orderSummary}
                </Modal>
                    {burger}
            </Aux>

        );
    }

}

const mapStateToProps = (state) => {

    return {
        ings: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        error: state.burgerBuilder.error,
        isAuthenticated: state.auth.token !== null
    }

}

const mapDispatchToProps = (dispatch) => {
    return {
        onIngredientAdded: (ingName) => dispatch(actions.addIngredient(ingName)),
        onIngredientRemoved: (ingName) => dispatch(actions.removeIngredient(ingName)),
        onInitIngredietns: () => dispatch(actions.initIngredients()),
        onInitPurchase: () => dispatch(actions.purchaseInit()),
        onSetAuthRedirectPath: (path) => dispatch(actions.setAuthRedirectPath(path))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));
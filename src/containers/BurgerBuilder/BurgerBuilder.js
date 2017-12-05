import React, { Component } from 'react';
import Aux from '../../hoc/Aux/Aux'
import Burger from '../../components/Burger/Burger'
import BuildControls from '../../components/Burger/BuildControls/BuildControls'
import Modal from '../../components/UI/Modal/Modal'
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary'
import axios from '../../axios-orders'
import Spinner from '../../components/UI/Spinner/Spinner'
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'
const INGREDIENT_PRICES = {
    salad: 0.5,
    bacon: 0.7,
    cheese: 0.4,
    meat: 1.3
}
class BurgerBuilder extends Component {
    state = {
        ingredients: null,
        totalPrice: 4,
        purchasable: false,
        purchasing: false,
        loading: false,
        error:false
    }
    componentDidMount() {
        axios.get('https://react-burger-builder-d2639.firebaseio.com/ingredients.json').then(response => {
            const ingredients = response.data;

            this.setState({ ingredients: ingredients })

        }).catch( err => {
            this.setState({ error: true })
            
        })
    }


    updatePurchaseState(ingredients) {

        const sum = Object.keys(ingredients)
            .map(igkey => {
                return ingredients[igkey];
            }).reduce((sum, el) => {
                return sum + el;
            }, 0)
        this.setState({ purchasable: sum > 0 })
    }
    addIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        const updatedCounted = oldCount + 1;

        const updatedIngredients = {
            ...this.state.ingredients
        }

        updatedIngredients[type] = updatedCounted;
        const priceAddition = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice + priceAddition;
        this.setState({ totalPrice: newPrice, ingredients: updatedIngredients })
        this.updatePurchaseState(updatedIngredients);
    }
    removeIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];

        if (oldCount <= 0) {
            return;
        }

        const updatedCounted = oldCount - 1;

        const updatedIngredients = {
            ...this.state.ingredients
        }

        updatedIngredients[type] = updatedCounted;
        const priceDeduction = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice - priceDeduction;
        this.setState({ totalPrice: newPrice, ingredients: updatedIngredients })
        this.updatePurchaseState(updatedIngredients);
    }

    purchaseHandler = () => {
        this.setState({ purchasing: true })
    }
    purchaseCancelHander = () => {
        this.setState({ purchasing: false })
    }

    purchaseContinueHandler = () => {
        // alert("you continued!")
        this.setState({ loading: true })
        const order = {
            ingredients: this.state.ingredients,
            price: this.state.totalPrice,
            customer: {
                name: 'Samuel David',
                address: {
                    street: 'TestStreet 1',
                    zipCode: '11122',
                    country: 'Dominican Republic'
                },
                email: 'test@test.com'
            },
            deliveryMethod: 'le fast'
        }

        axios.post('/orders.json', order).then((response) => {

            this.setState({ loading: false, purchasing: false })
        }).catch((error) => {
            this.setState({ loading: false, purchasing: false })
        })

    }



    render() {
        const disabledInfo = {
            ...this.state.ingredients
        };
        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0;
        }

        let orderSummary = null;
        let burger = this.state.error?<p>Ingredients couldn't be loaded</p>:<Spinner />;


        if (this.state.ingredients) {
            burger = (
                <Aux>
                    <Burger ingredients={this.state.ingredients} />
                    <BuildControls

                        ingredientAdded={this.addIngredientHandler}
                        ingredientRemoved={this.removeIngredientHandler}
                        disabled={disabledInfo}
                        purchasable={this.state.purchasable}
                        price={this.state.totalPrice}
                        ordered={this.purchaseHandler}
                    />
                </Aux>
            )
            orderSummary = <OrderSummary
            ingredients={this.state.ingredients}
            price={this.state.totalPrice}
            purchaseCancelled={this.purchaseCancelHander}
            purchaseContinued={this.purchaseContinueHandler} />
        }

        if (this.state.loading) {
            orderSummary = <Spinner />;
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

export default withErrorHandler(BurgerBuilder, axios);
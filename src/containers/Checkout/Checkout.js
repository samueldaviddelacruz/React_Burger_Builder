import React,{Component} from 'react';
import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary'
import {Route} from 'react-router-dom'
import {connect} from 'react-redux'
import ContactData from './ContactData/ContactData'
class Checkout extends Component{


    /*
      state ={
            ingredients:null,
            totalPrice:0
        }
        componentWillMount(){
            const query = new URLSearchParams(this.props.location.search);
            const ingredients = {

            };
            let price = 0
            for (let param of query.entries()){

                if(param[0] !== 'price'){
                    ingredients[param[0]] = +param[1];
                }else{
                    price = +param[1]
                }

            }
            this.setState({ingredients:ingredients,totalPrice:price});

        }
        */

    checkoutCancelledHandler = () =>{
        this.props.history.goBack();
    }
    checkoutContinuedHandler = () =>{
        this.props.history.replace('/checkout/contact-data');
    }

        render(){
            return (
                <div>
                    <CheckoutSummary
                        checkoutCancelled={this.checkoutCancelledHandler}
                        checkoutContinued={this.checkoutContinuedHandler}
                        ingredients={this.props.ings}/>
                    <Route path={this.props.match.path + '/contact-data'} component={ContactData}/>
                 </div>
            );
        }


}

const mapStateToProps = (state) => {

    return {
        ings: state.ingredients

    }

};


export default connect(mapStateToProps)(Checkout);
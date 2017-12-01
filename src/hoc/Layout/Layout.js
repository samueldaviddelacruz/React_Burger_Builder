import React,{Component} from 'react'
import Aux from '../Aux/Aux'
import classes from './layout.css'
import Toolbar from '../../components/Navigation/Toolbar/Toolbar'
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer'

class Layout extends Component {
    state = {
        showSideDrawer : false
    }
    sideDrawerClosedHandler = () => {
        this.setState({showSideDrawer:false});
    }

    sideDrawerToggleHandler = () =>{

        this.setState((prevState)  =>{

            return { showSideDrawer: !prevState.showSideDrawer }
        })
        //this.setState();
        
    }

    render(){
        return (

            <Aux>
            <Toolbar drawerToggleClicked={this.sideDrawerToggleHandler}/>
            <SideDrawer open={this.state.showSideDrawer} closed={this.sideDrawerClosedHandler}/>
            <div>Toolbar,SideDrawer,Backdrop </div>
    
            <main className={classes.Content}>
                {this.props.children}
            </main>
        </Aux>



        )
    }
  
}

export default Layout;

import React from 'react'
import Aux from '../../hoc/Aux'
import classes from './layout.css'
import Toolbar from '../Navigation/Toolbar/Toolbar'
const layout = (props) => (
    <Aux>
        <Toolbar />
        <div>Toolbar,SideDrawer,Backdrop </div>

        <main className={classes.Content}>
            {props.children}
        </main>
    </Aux>
)

export default layout;

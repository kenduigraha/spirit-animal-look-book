import React, { Component } from 'react';
import { auth, database } from './firebase';
import CurrentUser from './CurrentUser';
import SignIn from './SignIn';
import ProfileCard from './ProfileCard';
import pick from 'lodash/pick' ;
import map from 'lodash/map';
import './Application.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.usersRef = null;
    this.userRef = null;
    this.state = {
      user: null,
      users: {}
    };

    this._handleSignOut = this._handleSignOut.bind(this)
  }

  _handleSignOut () {
    console.log('sign out')
    
    this.setState({ user: null })
    
    return auth.signOut()
  }

  componentDidMount(){
    auth.onAuthStateChanged(user => {
      if (user) {
        this.setState({ user })
        // console.log(this.state.user)

        this.usersRef = database.ref('/users')
        // console.log(this.usersRef)
        this.userRef = this.usersRef.child(user.uid)
        // console.log(this.userRef)

        this.userRef
            .once('value')
            .then(snapshot => {
              if (snapshot.val()) {
                console.log('ada')
                return
              }

              const userData = pick(user, ['displayName', 'photoURL', 'email'])
              console.log(userData)
              this.userRef.set(userData)
            })
        
        this.usersRef
            .on('value', snapshot => {
              if (snapshot.val()) {
                this.setState({
                  users : snapshot.val()
                })
              }
            })
      }
    })
  }

  render() {
    const { user, users } = this.state;

    return (
      <div className="App">
        <header className="App--header">
          <h1>Social Animals</h1>
        </header>
        {
          user
          ?
            <div>
              <CurrentUser user={ user } handleSignOut={ this._handleSignOut } />
            </div>
          :
            <SignIn />
        }
      </div>
    );
  }
}

export default App;

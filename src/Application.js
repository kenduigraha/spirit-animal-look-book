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
  }

  componentDidMount(){
    auth.onAuthStateChanged(user => {
      if (user) {
        this.setState({ user })
        console.log(this.state.user)

        this.usersRef = database.ref('/users')
        console.log(this.usersRef)
        this.userRef = this.usersRef.child(user.uid)
        console.log(this.userRef)

        this.userRef
            .once('value')
            .then(snapshot => {
              if (snapshot.val()) {
                console.log('ada')
                return
              }

              const userData = pick(snapshot.val(), ['displayName', 'photoURL', 'email'])

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
              <CurrentUser user={ user } />
            </div>
          :
            <SignIn />
        }
      </div>
    );
  }
}

export default App;

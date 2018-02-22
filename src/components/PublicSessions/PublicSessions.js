import React, { Component } from 'react';
import Session from '../Session/Session';
import fire from '../../fire';

class PublicSessions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sessions: {}
    }
  }
  componentWillMount() {
          let refSessions = fire.database().ref('sessions').orderByChild('public').equalTo(true);
          refSessions.on('child_added', snapshot => {
              let session = {
                title: snapshot.val().title,
                id: snapshot.key,
                closed: snapshot.val().closed,
                url: "/session?uid=" + snapshot.key,
                public: snapshot.val().public,
                photo: snapshot.val().creator_photoURL,
                name: snapshot.val().creator_displayName,
                creatorUid: snapshot.val().creator_uid
              };
              let sessions = this.state.sessions;
              if (!session.closed) {
                sessions[snapshot.key] = session;
              }
              this.setState({ sessions });
          });
          refSessions.on('child_removed', snapshot => {
              let sessions = this.state.sessions;
              delete sessions[snapshot.key];
              this.setState({ sessions });
          });
  }
  render() {
    return(
      <ul className="collection with-header">
          <li className="collection-header grey lighten-4"><h4>Public</h4></li>
          {
              Object.values(this.state.sessions).map(session =>
                  <Session sessionObject={session} />
              )
          }
      </ul>
    );
  }
}
export default PublicSessions;

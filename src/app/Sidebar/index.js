import _ from 'lodash';
import React from 'react';
import { FormattedDate } from 'react-intl';
import { Route, Switch } from 'react-router-dom';

import api from '../../steemAPI';
import Topics from '../../components/Sidebar/Topics';
import Sidenav from '../../components/Navigation/Sidenav';
import InterestingPeople from '../../components/Sidebar/InterestingPeople';
import StartNow from '../../components/Sidebar/StartNow';
import Action from '../../components/Button/Action';
import { jsonParse } from '../../helpers/formatter';

class SidebarWithTopics extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isFetching: true,
      isLoaded: false,
      categories: [],
      props: {},
      menu: 'categories'
    };
  }

  componentWillMount() {
    console.log('api', api);
    api.getState('trending/busy', (err, result) => {
      let categories =
        (result.category_idx && result.category_idx.trending) ||
        (result.tag_idx && result.tag_idx.trending);
      categories = categories.filter(Boolean);
      this.setState({
        isFetching: false,
        isLoaded: true,
        categories,
        props: result.props
      });
    });
  }

  render() {
    return <Topics title="Trending topics" topics={this.state.categories} />;
  }
}
export const SidebarWrapper = ({ children }) => (
  <div>
    {children}
  </div>);

const InterestingPeopleWithData = () =>
  (<InterestingPeople
    users={[
      { name: 'liondani', about: 'Inch by Inch, Play by Play' },
      {
        name: 'good-karma',
        about: '"Action expresses priorities!" / Witness - Developer of eSteem…'
      },
      {
        name: 'furion',
        about: 'I’ve developed SteemData and SteemSports. All things Python…'
      }
    ]}
  />);

export const LeftSidebar = ({ auth }) =>
  (<Switch>
    <Route
      path="/@:name"
      render={() =>
        (<SidebarWrapper>
          {auth.user.name && // TODO (nil151) fetch profile based on route and show
            <div>
              {_.get(jsonParse(auth.user.json_metadata), 'profile.about')}<br />
              Joined
              {' '}
              <FormattedDate value={auth.user.created} year="numeric" month="long" day="numeric" />
            </div>}
          {auth.user.name && <Action text="Transfer" />}
          {auth.user.name && <Action text="Message" />}
        </SidebarWrapper>)}
    />
    <Route path="/:category/@:author/:permlink" render={() => <div />} />
    <Route
      path="/"
      render={() =>
        (<SidebarWrapper>
          <Sidenav username={auth.user.name} />
          <SidebarWithTopics />
        </SidebarWrapper>)}
    />
  </Switch>);

export const RightSidebar = ({ auth }) =>
  auth.user.name !== undefined
    ? <Switch>
      <Route
        path="/@:name"
        render={() =>
            (<SidebarWrapper>
              <InterestingPeopleWithData />
            </SidebarWrapper>)}
      />
      <Route
        path="/"
        render={() =>
            (<SidebarWrapper>
              <div style={{ maxWidth: 260 }}>
                <StartNow />
                <InterestingPeopleWithData />
              </div>
            </SidebarWrapper>)}
      />
    </Switch>
    : <SidebarWrapper />;

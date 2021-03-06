import { useDeps } from 'react-simple-di';
import { composeWithTracker, merge } from '/client/api';
import UsersList from '../components/users_list';

export const composer = ({ context }, onData) => {
  const { Meteor, Collections, Roles } = context();
  const { Users, Invitations } = Collections;

  if (Meteor.subscribe('accounts-management').ready()) {
    const users = Users.find().fetch();
    const invites = Invitations.find().fetch();

    const currentUserId = Meteor.userId();
    const isAdmin = Roles.userIsInRole(currentUserId, 'superuser');

    const canDelete = (userId) => {
      return isAdmin && userId !== currentUserId;
    };

    onData(null, { users, invites, canDelete });
  }
};

export const depsMapper = (context, actions) => ({
  context: () => context,
  deleteUser: actions.users.deleteUser
});

export default merge(
  composeWithTracker(composer),
  useDeps(depsMapper)
)(UsersList);

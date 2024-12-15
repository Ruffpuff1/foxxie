import { AuthContext, Context } from '@providers/AuthProvider';
import { useContext } from 'react';

export function useAuth(): [Context['user'], Context['props']] {
    const { user, props } = useContext(AuthContext);
    return [user, props];
}

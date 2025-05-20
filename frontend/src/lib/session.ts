import keycloak from './keycloak';

export const getCurrentUserId = (): string | null => {
    if (!keycloak.authenticated || !keycloak.tokenParsed?.sub) {
        return null;
    }
    return keycloak.tokenParsed.sub;
};

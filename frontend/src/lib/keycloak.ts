import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
    url: 'http://localhost:8080',
    realm: 'whiteboard-app',
    clientId: 'whiteboard-frontend',
});

export default keycloak;

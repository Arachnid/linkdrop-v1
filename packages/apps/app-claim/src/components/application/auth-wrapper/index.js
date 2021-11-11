import React from "react";
import { Auth0Provider } from "@auth0/auth0-react";
import { auth0ClientId, auth0Domain, auth0RedirectUrl } from 'app.config.js'

export default ({ children }) => <Auth0Provider
  domain={auth0Domain}
  clientId={auth0ClientId}
  redirectUri={auth0RedirectUrl}
>
  {children}
</Auth0Provider>

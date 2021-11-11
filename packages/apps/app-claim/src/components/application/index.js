import React from 'react'
import { Provider } from 'react-redux'
import { Web3ReactProvider } from "@web3-react/core"
import RouterProvider from './router-provider'
import store from 'data/store'
import { ethers } from 'ethers'

function getLibrary (provider) {
  const ethersProvider = new ethers.providers.Web3Provider(provider)
  return ethersProvider
}

class Application extends React.Component {
  render () {
    return <Web3ReactProvider
      getLibrary={getLibrary}
    >
      <Provider store={store()}>
        <RouterProvider />
      </Provider>
    </Web3ReactProvider>
  }
}
export default Application

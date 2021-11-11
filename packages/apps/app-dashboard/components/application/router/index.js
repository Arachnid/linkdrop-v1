import React from 'react'
import i18next from 'i18next'
import { Route, Switch } from 'react-router-dom'
import {
  Main,
  Page,
  NotFound,
  CampaignCreateManual,
  CampaignCreateERC721,
  CampaignCreateERC721Manual,
  CampaignCreate,
  CampaignInfo,
  Campaigns
} from 'components/pages'
import './styles'

import { actions } from 'decorators'
@actions(({ user }) => ({
  locale: (user || {}).locale
}))
class AppRouter extends React.Component {
  componentWillReceiveProps ({ locale }) {
    const { locale: prevLocale } = this.props
    if (locale === prevLocale) { return }
    i18next.changeLanguage(locale)
  }

  render () {
    return <Page>
      <Switch>
        <Route path='/campaigns/create-erc721' exact component={CampaignCreateERC721} />
        <Route path='/campaigns/create-erc20' exact component={CampaignCreate} />
        <Route path='/campaigns/create-erc20-manual' exact component={CampaignCreateManual} />
        <Route path='/campaigns/create-erc721-manual' exact component={CampaignCreateERC721Manual} />
        <Route path='/campaigns/:id' exact component={CampaignInfo} />
        <Route path='/campaigns' exact component={Campaigns} />
        <Route path='/' exact component={Main} />
        <Route path='*' component={NotFound} />
      </Switch>
    </Page>
  }
}

export default AppRouter

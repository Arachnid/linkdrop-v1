import React from 'react'
import { actions, translate } from 'decorators'
import styles from './styles.module'
import { ProgressBar } from 'components/common'

@actions(({
  user: {
    currentAddress,
    chainId
  },
  campaigns: {
    ethAmount,
    tokenAmount,
    linksAmount,
    tokenSymbol,
    tokenType,
    links,
    tokenIds
  }
}) => ({
  ethAmount,
  currentAddress,
  tokenAmount,
  linksAmount,
  links,
  tokenSymbol,
  chainId,
  tokenType,
  tokenIds
}))
@translate('pages.campaignCreate')
class Step4 extends React.Component {
  componentDidMount () {
    const { chainId, currentAddress, tokenType, tokenIds, linksAmount } = this.props
    if (tokenType === 'eth') {
      this.actions().tokens.generateETHLink({ chainId, currentAddress })
    } else if (tokenType === 'erc20') {
      this.actions().tokens.generateERC20Link({ chainId, currentAddress })
    } else if (tokenType === 'erc721') {
      this.actions().tokens.generateERC721Link({ chainId, currentAddress, tokenId: tokenIds[0] })
    } else {
      this.actions().tokens.generateERC1155Link({ chainId, currentAddress, tokenId: linksAmount[0] })
    }
  }

  componentWillReceiveProps ({ links }) {
    const {
      linksAmount,
      links: prevLinks,
      chainId,
      currentAddress,
      tokenType,
      tokenIds
    } = this.props
    // save campaign when links ready
    if (tokenType === 'eth' || tokenType === 'erc20') {
      if (links.length === linksAmount) {
        return this.actions().campaigns.save({ links })
      }
      if (links && links.length > 0 && links.length > prevLinks.length && links.length < linksAmount) {
        if (tokenType === 'eth') {
          this.actions().tokens.generateETHLink({ chainId, currentAddress })
        } else if (tokenType === 'erc20') {
          this.actions().tokens.generateERC20Link({ chainId, currentAddress })
        }
      }
    }

    if (tokenType === 'erc721') {
      if (links.length === tokenIds.length) {
        return this.actions().campaigns.save({ links })
      }
      if (links && links.length > 0 && links.length > prevLinks.length && links.length < linksAmount) {
        this.actions().tokens.generateERC721Link({ chainId, currentAddress, tokenId: tokenIds[links.length] })
      }
    }


    if (tokenType === 'erc1155') {
      if (links.length === linksAmount.length) {
        return this.actions().campaigns.save({ links })
      }
      if (links && links.length > 0 && links.length > prevLinks.length && links.length < linksAmount.length) {
        this.actions().tokens.generateERC1155Link({
          chainId,
          currentAddress,
          tokenId: linksAmount[links.length]
        })
      }
    }
  }

  render () {
    const { linksAmount, links, tokenType } = this.props
    const totalLinks = tokenType === 'erc1155' ? linksAmount.length : linksAmount
    return <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.title}>{this.t('titles.generatingLinks')}</div>
        <div className={styles.subtitle} dangerouslySetInnerHTML={{ __html: this.t('titles.loadingProcess') }} />
        <ProgressBar current={links.length} max={totalLinks} />
      </div>
    </div>
  }
}

export default Step4

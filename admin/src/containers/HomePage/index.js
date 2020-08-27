
import React, { useEffect, useState } from 'react'
import pluginId from '../../pluginId'
import { request } from 'strapi-helper-plugin'
// import styled from 'styled-components'
import { List, Button } from '@buffetjs/core'
import { Link } from 'react-router-dom'
import { useConfirm } from '../ConfirmModal'
import { useIntl } from 'react-intl'

/*

*/
const normalizeStrapiNewsletterToTheAcousticShape = (strapiNewsletter) => {
  // TODO: add data normalization for compatible shape with the IBM
  return strapiNewsletter
  /*
  return {
      "currencyOnePair": strapiNewsletter.currencyOnePair,
      "currencyOneText": strapiNewsletter.currencyOnePair
      "currencyTwoPair": strapiNewsletter.currencyOnePair
      "currencyTwoText": strapiNewsletter.currencyOnePair
      "newsletterDailyMessages": [
        {
          "country": strapiNewsletter.currencyOnePair
          "estimated": strapiNewsletter.currencyOnePair
          "previous": string
          "subject": string
          "time": string
        }
      ],
      "newsletterFreeMessages": [
        {
          "subject": string
          "text": string
        }
      ],
      "published": string,
      "signature": {
        "address": string
        "email": string
        "name": string
        "phone": string
        "photo": string
        "position": string
        "url": string
      },
      "subject": string
    }
    */
}

const detailPath = '/plugins/content-manager/collectionType/plugins::acoustic-newsletters.newsletter'
const locationPath = '/plugins/newsletters'

const HomePage = () => {
  const [newsletters, setNewsletters] = useState([])
  const { confirmModal } = useConfirm()
  const { formatMessage } = useIntl()

  useEffect(() => {
    const fetchData = async () => {
      const data = await request(`/${pluginId}/`)
      console.log('Component did mount', data)
      setNewsletters(data)
    }
    fetchData()
  }, [])

  const sendNewsletter = async (newsletterId) => {
    const shouldSend = await confirmModal(
      'acoustic-newsletters.homepage.list.item.confirm.title',
      'acoustic-newsletters.homepage.list.item.confirm.message'
    )

    if (!shouldSend) {
      return
    }

    const newsletter = newsletters.find(({ id }) => id === newsletterId)
    const newsletterToSend = normalizeStrapiNewsletterToTheAcousticShape(newsletter)

    const data = normalizeStrapiNewsletterToTheAcousticShape(newsletterToSend)

    console.log('__data__')
    console.log(data)

    // normalize data into acoustic shape
    // read acoustic IBM URL from the configuration
    // send dat to the acoustic
    window.alert('not supported yet')
  }

  return (
    <div>
      <h1>
        {formatMessage({ id: 'acoustic-newsletters.homepage.title' })}
      </h1>

      <List
        items={newsletters.map(newsletter => ({
          id: newsletter.id,
          text: newsletter.text1,
          updateNewsletter: (
            <Link
              to={`${detailPath}/${newsletter.id}?redirectUrl=${locationPath}`}
            >
              <Button color='secondary'>
                {formatMessage({ id: 'acoustic-newsletters.homepage.edit.button' })}
              </Button>
            </Link>
          ),
          sendNewsletter: (
            <Button
              onClick={() => sendNewsletter(newsletter.id)}
              color='primary'
            >
              {formatMessage({ id: 'acoustic-newsletters.homepage.sendNewsletter.button' })}
            </Button>
          )
        }))}
      />
    </div>
  )
}

export default HomePage

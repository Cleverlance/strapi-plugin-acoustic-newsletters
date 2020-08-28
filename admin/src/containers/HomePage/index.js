
import React, { useEffect, useState } from 'react'
import pluginId from '../../pluginId'
import { request } from 'strapi-helper-plugin'
// import styled from 'styled-components'
import { List, Button } from '@buffetjs/core'
import { Link } from 'react-router-dom'
import { useConfirm } from '../ConfirmModal'
import { useIntl } from 'react-intl'

const normalizeStrapiNewsletterToTheAcousticShape = (strapiNewsletter) => {
//   return strapiNewsletter
// }
  // TODO: add data normalization for compatible shape with the IBM
  return {
    currencyOnePair: strapiNewsletter.currencyOnePair,
    currencyOneText: strapiNewsletter.currencyOneText,
    currencyTwoPair: strapiNewsletter.currencyTwoPair,
    currencyTwoText: strapiNewsletter.currencyTwoText,
    newsletterDailyMessages: strapiNewsletter.newsletterDailyMessages.map(n => ({
      country: n.country,
      estimated: n.estimated,
      previous: n.previous,
      subject: n.subject,
      time: n.time
    })),
    newsletterFreeMessages: strapiNewsletter.newsletterFreeMessages.map(n => ({
      subject: n.subject,
      text: n.text
    })),
    published: strapiNewsletter.published,
    signature: {
      address: strapiNewsletter.address,
      email: strapiNewsletter.email,
      name: strapiNewsletter.name,
      phone: strapiNewsletter.phone,
      photo: strapiNewsletter.photo,
      position: strapiNewsletter.position,
      url: strapiNewsletter.url
    },
    subject: strapiNewsletter.subject
  }
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

    // show preview =>
    console.log(newsletterToSend)

    // normalize data into acoustic shape
    // read acoustic IBM URL from the configuration
    // send dat to the acoustic
    window.alert('not supported yet')
  }

  const showPreview = async (newsletterId) => {
    const newsletter = newsletters.find(({ id }) => id === newsletterId)
    const newsletterToSend = normalizeStrapiNewsletterToTheAcousticShape(newsletter)
    try {
      const res = await window.fetch(
        'https://clevercmssit.creditas.cleverlance.com/capi/newsletter/create', {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          method: 'POST',
          body: JSON.stringify(
            newsletterToSend
            // {
            //   currencyOnePair: 'EUR / CZK',
            //   currencyOneText: 'Koruna se pred dnesnim zasedani...',
            //   currencyTwoPair: 'EUR / USD',
            //   currencyTwoText: 'Predbeny pruzkumy prezidentskych voleb v USA...',
            //   newsletterDailyMessages: [
            //     {
            //       country: 'CZ',
            //       estimated: 'string',
            //       previous: 'string',
            //       subject: 'CNB Interest Rate',
            //       time: '14:30',
            //       unit: '10'
            //     }
            //   ],
            //   newsletterFreeMessages: [
            //     {
            //       subject: 'string',
            //       text: 'string'
            //     }
            //   ],
            //   published: '24. 6. 2020',
            //   signature: {
            //     address: 'Brno-mesto',
            //     email: 'test%40cleverlance.com',
            //     name: 'Jan Novak',
            //     phone: '+420 777 777 777',
            //     photo: 'http://www.cleverlance.com',
            //     position: 'Vedouci',
            //     url: 'http://www.cleverlance.com'
            //   },
            //   subject: 'Vyvoj na devizovem trhu'
            // }
          )
        })

      const data = await res.json()
      console.log(data)

      window.open(data.previewLink)
      // window.open(data.url)
    } catch (err) {
      console.error(err)
    }
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
              {formatMessage({ id: 'acoustic-newsletters.homepage.newsletter.send.button' })}
            </Button>
          ),
          showPreview: (
            <Button
              onClick={() => showPreview(newsletter.id)}
              color='primary'
            >
              {formatMessage({ id: 'acoustic-newsletters.homepage.newsletter.showPreview.button' })}
            </Button>
          )
        }))}
      />
    </div>
  )
}

export default HomePage

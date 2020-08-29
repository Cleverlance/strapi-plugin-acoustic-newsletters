import React, { useEffect, useState } from 'react'
import pluginId from '../../pluginId'
import { request } from 'strapi-helper-plugin'
import { List, Button } from '@buffetjs/core'
import { Link } from 'react-router-dom'
import { useConfirm } from '../ConfirmModal'
import { useIntl } from 'react-intl'
import styled from 'styled-components'

const normalizeStrapiNewsletterToTheAcousticShape = (strapiNewsletter) => {
  // return strapiNewsletter
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
      address: strapiNewsletter.signature.address,
      email: strapiNewsletter.signature.email,
      name: strapiNewsletter.signature.name,
      phone: strapiNewsletter.signature.phone,
      photo: strapiNewsletter.signature.photo,
      position: strapiNewsletter.signature.position,
      url: strapiNewsletter.signature.url
    },
    subject: strapiNewsletter.subject
  }
}

const detailPath = '/plugins/content-manager/collectionType/plugins::acoustic-newsletters.newsletter'
const locationPath = '/plugins/newsletters'

const DivList = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

const DivRow = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  background: white;
  padding: 1rem;
  border-bottom: 1px solid #EEE;
`

const HomePage = ({ newsletterUrl }) => {
  const [newsletters, setNewsletters] = useState([])
  const { confirmModal } = useConfirm()
  const { formatMessage } = useIntl()

  useEffect(() => {
    const fetchData = async () => {
      const data = await request(`/${pluginId}/`)
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

    // const newsletter = newsletters.find(({ id }) => id === newsletterId)
    // const newsletterToSend = normalizeStrapiNewsletterToTheAcousticShape(newsletter)

    // show preview =>
    // console.log(newsletterToSend)

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
        `${newsletterUrl}/create`, {
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

      <DivList>
        {
          newsletters.map(newsletter => (
            <DivRow key={newsletter.id}>
              <div style={{ width: '50%' }}>{newsletter.subject}</div>
              <div>
                <Link
                  to={`${detailPath}/${newsletter.id}?redirectUrl=${locationPath}`}
                >
                  <Button color='secondary'>
                    {formatMessage({ id: 'acoustic-newsletters.homepage.edit.button' })}
                  </Button>
                </Link>
              </div>
              <div>
                <Button
                  onClick={() => sendNewsletter(newsletter.id)}
                  color='primary'
                >
                  {formatMessage({ id: 'acoustic-newsletters.homepage.newsletter.send.button' })}
                </Button>
              </div>
              <div>
                <Button
                  onClick={() => showPreview(newsletter.id)}
                  color='primary'
                >
                  {formatMessage({ id: 'acoustic-newsletters.homepage.newsletter.showPreview.button' })}
                </Button>
              </div>
            </DivRow>
          ))
        }
      </DivList>

    </div>
  )
}

export default HomePage

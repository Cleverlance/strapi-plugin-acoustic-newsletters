import React, { useEffect, useState } from 'react'
import pluginId from '../../pluginId'
import { request } from 'strapi-helper-plugin'
import { Button } from '@buffetjs/core'
import { Link } from 'react-router-dom'
import { useConfirm } from '../ConfirmModal'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { CheckPermissions } from 'strapi-helper-plugin';
import pluginPermissions from '../../permissions';

// service layer
const setNewsletterSended = async (newsletterId) => (
  request(
    `/${pluginId}/setIsSended`,
    {
      method: 'POST',
      body: {
        id: newsletterId
      }
    }
  )
)

const normalizeStrapiNewsletterToTheAcousticShape = (strapiNewsletter) => {
  // return strapiNewsletter
  // TODO: add data normalization for compatible shape with the IBM
  try {
    const data = {
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
    return data
  } catch (err) {
    window.alert('invalid newsletter data')
    return null
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
  const [loading, setLoading] = useState(false)
  const { confirmModal } = useConfirm()
  const { formatMessage } = useIntl()

  useEffect(() => {
    const fetchData = async () => {
      const data = await request(`/${pluginId}/`)
      setNewsletters(Array.isArray(data) ? data : [])
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

    const newsletterData = await createPreview(newsletterId)
    if (!newsletterData) {
      window.alert('error while creating newsletter ')
    }

    setLoading(true)
    try {
      // https://clevercmssit.creditas.cleverlance.com/capi/swagger-ui.html#!/Newsletter/sendNewsletterUsingPOST
      await window.fetch(
        `${newsletterUrl}/send`, {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          method: 'POST',
          body: JSON.stringify({
            mailingId: newsletterData.mailingId
          })
        })

      await setNewsletterSended(newsletterId)
      window.alert('Newsletter odeslán')
      setNewsletters(newsletters => newsletters.map(n => n.id === newsletterId
        ? { ...n, isSended: true }
        : n)
      )
    } catch (err) {
      console.error(err)
      window.alert(err)
    }
    setLoading(false)

    // normalize data into acoustic shape
    // read acoustic IBM URL from the configuration
    // send dat to the acoustic
  }

  const createPreview = async (newsletterId) => {
    const newsletter = newsletters.find(({ id }) => id === newsletterId)
    const newsletterToSend = normalizeStrapiNewsletterToTheAcousticShape(newsletter)
    if (!newsletterToSend) {
      return
    }
    setLoading(true)
    try {
      // https://clevercmssit.creditas.cleverlance.com/capi/swagger-ui.html#!/Newsletter/createNewsletterUsingPOST
      const res = await window.fetch(
        `${newsletterUrl}/create`, {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          method: 'POST',
          body: JSON.stringify(
            newsletterToSend
          )
        })

      const data = await res.json()
      setLoading(false)
      return data
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
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
              <CheckPermissions permissions={pluginPermissions.editPermission}>
                <div>
                  <Link
                    to={`${detailPath}/${newsletter.id}?redirectUrl=${locationPath}`}
                  >
                    <Button color='secondary'>
                      {formatMessage({ id: 'acoustic-newsletters.homepage.edit.button' })}
                    </Button>
                  </Link>
                </div>
              </CheckPermissions>

              <div>
                <Button
                  onClick={async () => {
                    const newsletterData = await createPreview(newsletter.id)
                    if (newsletterData) {
                      window.open(newsletterData.previewLink)
                    }
                  }}
                  color='primary'
                >
                  {formatMessage({ id: 'acoustic-newsletters.homepage.newsletter.showPreview.button' })}
                </Button>
              </div>

              <CheckPermissions permissions={pluginPermissions.sendPermission}>
                <div>
                  <Button
                    onClick={() => sendNewsletter(newsletter.id)}
                    color='primary'
                    disabled={newsletter.isSended || loading}
                  >
                    {formatMessage({ id: 'acoustic-newsletters.homepage.newsletter.send.button' })}
                  </Button>
                </div>
              </CheckPermissions>
            </DivRow>
          ))
        }
      </DivList>

    </div>
  )
}

export default HomePage

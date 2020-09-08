import { LoadingIndicatorPage, request, NotFound } from 'strapi-helper-plugin'
import React, { useState, useEffect } from 'react'
import { Switch, Route } from 'react-router-dom'
import pluginId from '../../pluginId'
import HomePage from '../HomePage'
import { ConfirmModalProvider } from '../ConfirmModal'

const App = () => {
  const [loading, setLoading] = useState(true)
  const [newsletterUrl, setNewsletterUrl] = useState(null)
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    const fetchConfig = async () => {
      setLoading(true)
      try {
        const data = await request(`/${pluginId}/getAcousticNewsletterConfig`)
        setNewsletterUrl(data.url)
      } catch (err) {
        console.error(err)
        setIsError(true)
      }

      setLoading(false)
    }
    fetchConfig()
  }, [])

  if (loading) {
    return <LoadingIndicatorPage />
  }
  if (isError) {
    return <div>There is an error while loading plugin configuration</div>
  }

  return (
    <div>
      <ConfirmModalProvider>
        <Switch>
          <Route path={`/plugins/${pluginId}`} render={() => <HomePage newsletterUrl={newsletterUrl} />} exact />
          <Route component={NotFound} />
        </Switch>
      </ConfirmModalProvider>
    </div>
  )
}

export default App

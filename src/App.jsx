import { useState, useEffect } from 'react'
import SelectPage from './pages/SelectPage'
import DashboardPage from './pages/DashboardPage'
import { fetchAdminList } from './services/api'

export default function App() {
  const [config, setConfig] = useState(null)
  const [adminList, setAdminList] = useState([])
  const [adminsLoading, setAdminsLoading] = useState(true)
  const [adminsError, setAdminsError] = useState('')

  useEffect(() => {
    fetchAdminList()
      .then(({ admins }) => {
        setAdminList(admins)
        setAdminsError('')
      })
      .catch((err) => {
        setAdminList([])
        setAdminsError(err instanceof Error ? err.message : 'Failed to load admins from server')
      })
      .finally(() => {
        setAdminsLoading(false)
      })
  }, [])

  if (!config) {
    return (
      <SelectPage
        onContinue={setConfig}
        adminList={adminList}
        adminsLoading={adminsLoading}
        adminsError={adminsError}
      />
    )
  }

  return <DashboardPage config={config} adminList={adminList} />
}

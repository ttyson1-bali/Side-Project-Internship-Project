import './App.css'
import { useEffect, useState } from 'react'

// ==========================================
// Types
// ==========================================

type Application = {
  id: number
  company: string
  status: string
  position: string
}

type ApplicationCardProps = Application & {
  onDelete: (id: number) => void
  onUpdate: (id: number, status: string) => void
}

// ==========================================
// Application Card Component
// ==========================================

function ApplicationCard(props: ApplicationCardProps) {
  return (
    <div className="title_card">

      <div>
        <h2>{props.company}</h2>
        <p className="status">Status: {props.status}</p>
        <p>{props.position}</p>
      </div>

      <select
        className="update_application"
        value={props.status}
        onChange={(event) => {
          props.onUpdate(props.id, event.target.value)
        }}
      >
        <option value="Application Submitted">Application Submitted</option>
        <option value="Interviewing">Interviewing</option>
        <option value="Offer">Offer</option>
        <option value="Rejected">Rejected</option>
        <option value="Withdrawn">Withdrawn</option>
      </select>

      <button onClick={() => props.onDelete(props.id)}>
        Delete Application
      </button>
    </div>
  )
}

// ==========================================
// Main Application
// ==========================================

function App() {

  // ----------------------------------------
  // State
  // ----------------------------------------

  const [companyInput, setCompanyInput] = useState('')
  const [statusInput, setStatusInput] = useState('Interviewing')
  const[positionInput, setPositionInput] = useState("")
  const [applications, setApplications] = useState<Application[]>([])
  const [statusFilter, setStatusFilter] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredApplications = applications.filter((application) => {
    const matchesStatus =
      statusFilter === 'All' || application.status === statusFilter
  
    const matchesSearch =
      application.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      application.position.toLowerCase().includes(searchQuery.toLowerCase())
  
    return matchesStatus && matchesSearch
  })
// ----------------------------------------
// Dashboard Statistics
// ----------------------------------------

const stats = {
  total: applications.length,

  submitted: applications.filter(
    (app) => app.status === 'Application Submitted'
  ).length,

  interviewing: applications.filter(
    (app) => app.status === 'Interviewing'
  ).length,

  offers: applications.filter(
    (app) => app.status === 'Offer'
  ).length,

  rejected: applications.filter(
    (app) => app.status === 'Rejected'
  ).length
}
  // ----------------------------------------
  // GET: Fetch Applications
  // ----------------------------------------

  async function getApplications() {
    try {
      const response = await fetch(
        'http://127.0.0.1:8000/applications'
      )

      if (!response.ok) {
        throw new Error('Failed to fetch applications')
      }

      const data = await response.json()
      setApplications(data)

    } catch (error) {
      console.error('GET FAILED:', error)
    }
  }

  // ----------------------------------------
  // POST: Create Application
  // ----------------------------------------

  async function addApplication() {
    if (!companyInput.trim()) {
      return
    }

    try {
      const response = await fetch(
        'http://127.0.0.1:8000/applications',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            company: companyInput,
            status: statusInput,
            position: positionInput
          })
        }
      )

      if (!response.ok) {
        throw new Error('Failed to add application')
      }

      const data = await response.json()

      setApplications((previousApplications) => [
        ...previousApplications,
        {
          id: data.id,
          company: companyInput,
          status: statusInput,
          position: positionInput
        }
      ])

    } catch (error) {
      console.error('POST FAILED:', error)
    }
  }

  // ----------------------------------------
  // PATCH: Update Application Status
  // ----------------------------------------

  async function updateApplication(id: number, status: string) {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/applications/${id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            status: status
          })
        }
      )

      if (!response.ok) {
        throw new Error('Failed to update application')
      }

      setApplications((previousApplications) =>
        previousApplications.map((application) => {
          if (application.id === id) {
            return {
              ...application,
              status: status
            }
          }

          return application
        })
      )

    } catch (error) {
      console.error('PATCH FAILED:', error)
    }
  }

  // ----------------------------------------
  // DELETE: Remove Application
  // ----------------------------------------

  async function deleteApplication(id: number) {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/applications/${id}`,
        {
          method: 'DELETE'
        }
      )

      if (!response.ok) {
        throw new Error('Failed to delete application')
      }

      setApplications((previousApplications) =>
        previousApplications.filter(
          (application) => application.id !== id
        )
      )

    } catch (error) {
      console.error('DELETE FAILED:', error)
    }
  }

  // ----------------------------------------
  // Load Applications on Mount
  // ----------------------------------------

  useEffect(() => {
    getApplications()
  }, [])

  // ----------------------------------------
  // User Interface
  // ----------------------------------------

  return (
    <div className="Applications_class_map">
      {/* Dashboard Header */}

<div className="dashboard_header">
  <h1>Internship Tracker</h1>
  <p>Your internship application dashboard</p>
</div>

{/* Dashboard Statistics */}

      <div className="stats_container">

        <div className="stat_card">
          <h3>Total Applications</h3>
          <p>{stats.total}</p>
        </div>

        <div className="stat_card">
          <h3>Submitted</h3>
          <p>{stats.submitted}</p>
        </div>

        <div className="stat_card">
          <h3>Interviews</h3>
          <p>{stats.interviewing}</p>
        </div>

        <div className="stat_card">
          <h3>Offers</h3>
          <p>{stats.offers}</p>
        </div>

        <div className="stat_card">
          <h3>Rejected</h3>
          <p>{stats.rejected}</p>
        </div>

      </div>
      <div className ="search_bar"> 
        
        <input type="text" 
        placeholder='Search Applications'
        value={searchQuery}
        onChange={(event) => setSearchQuery(event.target.value)}
        />

      <select
        value={statusFilter}
        onChange={(event) => setStatusFilter(event.target.value)}
      >
        <option value="All">All Applications</option>
        <option value="Application Submitted">Submitted</option>
        <option value="Interviewing">Interviewing</option>
        <option value="Offer">Offers</option>
        <option value="Rejected">Rejected</option>
        <option value="Withdrawn">Withdrawn</option>
      </select>
      </div>

      {/* Application Cards */}

      {filteredApplications.map((application) => (
        <ApplicationCard
          key={application.id}
          id={application.id}
          company={application.company}
          status={application.status}
          position={application.position}
          onDelete={deleteApplication}
          onUpdate={updateApplication}
        />
      ))}

      {/* Add Application Form */}

      <div>
        <h2>Add New Applications Here:</h2>

        <input
          type="text"
          placeholder="Company"
          value={companyInput}
          onChange={(event) => {
            setCompanyInput(event.target.value)
          }}
        />

        <select
          value={statusInput}
          onChange={(event) => {
            setStatusInput(event.target.value)
          }}
        >
          <option value="Application Submitted">Application Submitted</option>
          <option value="Interviewing">Interviewing</option>
          <option value="Offer">Offer</option>
          <option value="Rejected">Rejected</option>
          <option value="Withdrawn">Withdrawn</option>
        </select>
        <input
          type="text"
          placeholder="Position"
          value={positionInput}
          onChange={(event) => {
            setPositionInput(event.target.value)
          }}
        />

        <button onClick={addApplication}>
          Add Application
        </button>

      </div>

    </div>
  )
}

export default App
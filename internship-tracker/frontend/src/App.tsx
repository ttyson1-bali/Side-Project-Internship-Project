import './App.css'
import { useEffect, useState } from 'react'

// ==========================================
// Types
// ==========================================

type Application = {
  id: number
  company: string
  status: string
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
      <h1>Internship Tracker</h1>

      <div>
        <h2>Company: {props.company}</h2>
        <p className="status">Status: {props.status}</p>
        <p>Software Engineering Summer Scholar</p>
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
  const [applications, setApplications] = useState<Application[]>([])

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
            status: statusInput
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
          status: statusInput
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

      {/* Application Cards */}

      {applications.map((application) => (
        <ApplicationCard
          key={application.id}
          id={application.id}
          company={application.company}
          status={application.status}
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

        <br />

        <button onClick={addApplication}>
          Add Application
        </button>

        <p>{statusInput}</p>
      </div>

    </div>
  )
}

export default App
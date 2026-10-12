import './App.css'
import { useEffect, useState } from 'react'

// Types
type Application = {
  id: number
  company: string
  status: string
}

type ApplicationCardProps = Application & {
  onDelete: (id: number) => void
}

// Application Card Component
function ApplicationCard(props: ApplicationCardProps) {
  return (
    <div className="title_card">
      <h1>Internship Tracker</h1>

      <div>
        <h2>Company: {props.company}</h2>
        <p className="status">Status: {props.status}</p>
        <p>Software Engineering Summer Scholar</p>
      </div>

      <button>View Application</button>

      <button onClick={() => props.onDelete(props.id)}>
        Delete Application
      </button>
    </div>
  )
}

// Main Application
function App() {
  // State
  const [companyInput, setCompanyInput] = useState('')
  const [statusInput, setStatusInput] = useState('Interviewing')
  const [applications, setApplications] = useState<Application[]>([])

  // GET: Fetch Applications
  async function getApplications() {
    try {
      const response = await fetch(
        'http://127.0.0.1:8000/applications'
      )

      if (!response.ok) {
        throw new Error('Failed to fetch applications')
      }

      const data = await response.json()
  
      console.log("APPLICATION DATA:", data)
  
      setApplications(data)
    } catch (error) {
      console.error('FETCH FAILED:', error)
    }
  }

  // POST: Create Application
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

  // DELETE: Remove Application (Local State Only)
  function deleteApplication(id: number) {
    setApplications((previousApplications) =>
      previousApplications.filter(
        (application) => application.id !== id
      )
    )
  }

  async function deleteData(id: number){
    const response = await fetch(
      `http://127.0.0.1:8000/applications/${id}`, {
        method: "DELETE"
      }
    ) 
    if (response.ok) {
      deleteApplication(id)
    }
    else{
      throw new Error("Failed to delete application")
    }
  }

  

  // Load Applications on Mount
  useEffect(() => {
    getApplications()
  }, [])

  // UI
  return (
    <div className="Applications_class_map">
      {applications.map((application) => (
        <ApplicationCard
          key={application.id}
          id={application.id}
          company={application.company}
          status={application.status}
          onDelete={deleteData}
        />
      ))}

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
          <option value="Interviewing">Interviewing</option>
          <option value="Application Submitted">
            Application Submitted
          </option>
          <option value="Offer">Offer</option>
          <option value="Rejected">Rejected</option>
        </select>

        <br />

        <button onClick={addApplication}>
          Add application
        </button>

        <p>{statusInput}</p>
      </div>
    </div>
  )
}

export default App
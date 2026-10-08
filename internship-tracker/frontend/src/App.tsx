import './App.css'
import {useState, useEffect} from 'react'
type ApplicationCardProps = {
  id: Number;
  company: string;
  status: string;
  onDelete: (id: Number) => void;
}

function ApplicationCard(props: ApplicationCardProps){

  return(
    <div className = "title_card">
      <h1> Internship Tracker </h1>
      <div>
        <h2>Company: {props.company} </h2>
          <p className="status">Status: {props.status}</p>
           <p>Software Engineering Summer Scholar </p>

      </div>

    <button> View Application </button>
    <button onClick = {() => props.onDelete(props.id)}> Delete Application</button>
  
    </div>
  )

}

function App() {
  type Application = {
    id: number;
    company: string;
    status: string;
  }
  const [companyInput, setCompanyInput] = useState("")
  const [statusInput, setStatusInput] = useState("Interviewing")
  const [applications, setApplications] = useState<Application[]>([])

  const [idNum, setIDNum] = useState(applications.length + 1)

  function deleteApplication(id: number ){
    setApplications(
      applications.filter((application) => {
        return application.id != id })
      )
  }  

  useEffect(() => {getApplications()}, [])
  async function getApplications() {
    console.log("Getting applications...")
  
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/applications"
      )
  
      console.log("Response:", response)
  
      const data = await response.json()
      console.log("Data:", data)
  
      setApplications(data)
  
    } catch (error) {
      console.error("FETCH FAILED:", error)
    }
  }

  return (
    <div className = "Trial">
      {applications.map((application) =>{
        return (
        <ApplicationCard 
          id = {application.id}
          company = {application.company}
          status = {application.status}
          onDelete = {deleteApplication}
          />

      )})}
    <div>
      <h2> Add New Applications Here: </h2>
      <input 
        type = "text" 
        placeholder = "Company" 
        onChange={(event) => {setCompanyInput(event.target.value)}}/>
      <select
        onChange = {(event) => {setStatusInput(event.target.value)}} >
        <option value = "Interviewing">Interviewing</option>
        <option value = "Application Submitted">Application Submitted</option>
        <option value = "Offer">Offer</option>
        <option value = "Rejected"> Rejected</option>
      
      </select>
      <br></br>
      <button onClick={() => 
        {setApplications(
          [...applications,
            {id: idNum, 
            company: companyInput, 
            status: statusInput}])
        setIDNum(idNum + 1)
            }}>
      Add application
     </button>
    <p> {statusInput}</p>
    </div>
  
</div>
  )
}

export default App

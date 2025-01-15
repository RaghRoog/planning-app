import { useNavigate } from "react-router-dom"

export default function NoteCard({ data }){

    let navigate = useNavigate()

    function deleteNote(){
        let noteId = data.id
        fetch(`http://localhost:5016/api/notes/delete/${noteId}`, {
            method: "DELETE",
        })
        .then(response => {
            if (!response.ok) {                    
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            location.reload()
        })
        .catch(error => {
            console.error("Błąd:", error)
        })
    }

    function editNote(){
        sessionStorage.noteId = data.id
        sessionStorage.setItem('mode', 'edit')
        navigate('/add-edit-note')
    }

    return(
        <div className="card">
            <h4>Notatka:</h4>
            <p className="card-paragraph">{data.content}</p>
            <div className="btns-container">
                <button onClick={editNote} className="card-btn">EDYTUJ</button>
                <button onClick={deleteNote} className="card-btn">USUŃ</button>
            </div>
        </div>
    )
}
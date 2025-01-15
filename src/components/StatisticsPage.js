import { useState, useEffect } from "react";
import NavBar from "./NavBar";

export default function StatisticsPage() {
    const [type, setType] = useState("goal");
    const [status, setStatus] = useState("true");
    const [priority, setPriority] = useState("all");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [statistics, setStatistics] = useState(0);

    const fetchStatistics = async () => {

        const userId = sessionStorage.getItem("userId");
        if (!userId) {
            setError("Nie można znaleźć identyfikatora użytkownika.");
            return
        }

        try {
            let url = `http://localhost:5016/api/statistics/${type === "goal" ? "goals" : "tasks"}/${userId}`;
            const queryParams = new URLSearchParams({
                isCompleted: status,
                ...(type === "goal" && priority !== "all" ? { priority } : {}), 
                startDate,
                endDate,
            })

            url += `?${queryParams.toString()}`

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            })

            if (!response.ok) {
                throw new Error(response.status);
            }

            const data = await response.json();
            setStatistics(data);
        } catch (error) {
            console.log(error)
        } 
    }

    return (
        <>
            <NavBar />
            <div className="main">
                <h2>Statystyki</h2>
                <form style={{ display: "flex", flexDirection: "column", flexWrap: "wrap", gap: "1rem", alignItems: 'flex-start'}}>
                    <select value={type} onChange={(e) => setType(e.target.value)}>
                        <option value="goal">Cele</option>
                        <option value="task">Zadania</option>
                    </select>
                    <select value={status} onChange={(e) => setStatus(e.target.value)}>
                        <option value="true">Ukończone</option>
                        <option value="false">Nieukończone</option>
                    </select>
                    {type === "goal" && (
                        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                            <option value="High">Wysoki</option>
                            <option value="Med">Średni</option>
                            <option value="Low">Niski</option>
                        </select>
                    )}
                    <p>Początek</p>
                    <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}/>
                    <p>Koniec</p>
                    <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}/>
                    <button type="button" onClick={fetchStatistics}>Pokaż statystyki</button>
                </form>

                <h4 style={{marginTop: '12px'}}>Liczba elementów: {statistics}</h4>
            </div>
        </>
    );
}

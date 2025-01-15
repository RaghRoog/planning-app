
export default function Carousel({containerId, data, limit, filteredCompleted, Component}){

    function scrollCarousel(direction){
        let container = document.getElementById(containerId)
        let scrollAmount = container.children[0].offsetWidth + 14
        if(direction === 'left'){
            container.scrollBy({ left: -scrollAmount, behavior: 'smooth'})
        }else{
            container.scrollBy({ left: scrollAmount, behavior: 'smooth'})
        }
    }

    let filteredData = filteredCompleted != undefined 
        ? data.filter(d => d.isCompleted == filteredCompleted) : data

    filteredData = filteredData.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

    let limitedData = limit ? data.slice(0, limit) : data

    return(
        <div className="carousel">
            <button className="carousel-btn" onClick={() => scrollCarousel('left')}>{"<"}</button>
            <div id={containerId} className="carousel-items">
                {limitedData.map(d => (
                    <Component key={d.id} data={d}/>
                ))} 
            </div>
            <button className="carousel-btn" onClick={() => scrollCarousel('right')}>{">"}</button>
        </div>
    )
}
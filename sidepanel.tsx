import { useState } from "~node_modules/@types/react"

const SidePanel = () => {
    const [query, setQuery] = useState("")
    const [results, setResults] = useState([])
    const [loading, setLoading] = useState(false)

    const handleSearch = () => {
        setLoading(true)
        chrome.runtime.sendMessage({type: "CHECK_FACT", query}, (response) => {
            if (response.data && response.data.claims){
                setResults(response.data.claims)
            }else {
                setResults([])
            }
        })
    }
    return (
        
        <div>
            <h1>Hello World from sidebar</h1>
        </div>
    )
}

export default SidePanel
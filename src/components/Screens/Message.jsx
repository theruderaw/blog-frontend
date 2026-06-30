import { useEffect, useState } from 'react'
import Textfield from '../Common/Textfield'
import UserSelector from '../Common/UserSelector'
import { API_URL } from '../../config/api'

function Message() {
    const [email,setEmail] = useState('')
    const [name,setName] = useState('')
    const [text,setText] = useState('')
    const [receiverID,setReceiverID] = useState('')
    const [userList,setUserList] = useState([])

    useEffect(()=> {
        console.log("UseEffect")
        const fetchUsers = async () => {
            try {
                const response = await fetch(
                    `${API_URL}gen/users`
                )

                const data = await response.json()
                console.log(data)
                setUserList(data)
            } catch (error) {
                console.log(error)
            }
        }

        fetchUsers()
    },[])

    const handleSubmit = async (e) => {
        e.preventDefault()

        if(!receiverID|!email) return;
        console.log(receiverID)
        const body = {
            uuid : receiverID,
            sender_name : name ? name : "Anonymous Message",
            sender_email : email,
            message_text : text
        }
        try {
            const response = await fetch(`${API_URL}message/`, {
                    method: 'POST',
                    body: JSON.stringify(body),
                    headers : {
                        'Content-Type':'application/json',
                        'accept':'application/json'
                    }
                });

            const data = await response.json()
            console.log(data)
        } catch (error) {
            console.log(error)
        } finally {
            setText('')
        }
    }

    return (
        <form onSubmit={(e) => handleSubmit(e)}>
            <div className="container flex gap-4">
                <div className="email flex-1">
                    <Textfield 
                        type="email" 
                        labelText="Enter Email" 
                        placeholder="your@email.com" 
                        data = {email} 
                        setData={setEmail}
                    />
                </div>
                <div className="name flex-1">
                    <Textfield 
                        type="input" 
                        labelText="Enter Name" 
                        placeholder="Your name" 
                        data = {name} 
                        setData={setName}/>
                </div>
            </div>
            <br/>
            <div className="container gap-4">
                <Textfield
                    type="textarea"
                    data={text}
                    setData={setText}
                    labelText="Enter Message"
                />
            </div>
            <br/>
            <div className="container flex gap-4">
                <button 
                    className="px-6 py-3 bg-white text-black font-medium text-sm rounded"
                    type='submit'
                >
                    Submit
                </button>
                <UserSelector items={userList} onSelect={(e) => setReceiverID(e?.uuid)}/>
            </div>

        </form>
    )
}

export default Message
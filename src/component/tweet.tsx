import { styled } from "styled-components";
import { ITweet } from "./timeline";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { auth, db, storage } from "../firebase";
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useState } from "react";


const Wrapper = styled.div`
    display: grid;
    grid-template-columns: 3fr 1fr;
    padding: 20px;
    border: 1px solid rgba(255,255,255,0.5);
    border-radius: 15px;
`

const Column = styled.div`
    display: grid;
`

const Photo = styled.img`
    width: 100px;
    height: 100px;
    border-radius: 15px;
`

const UserName = styled.span`
    font-weight: 600;
    font-size: 15px;
`

const Payload = styled.p`
    margin:10px 0px;
    font-size: 18px;
`

const ButtonWrapper = styled.div`
    display: flex;
`

const PhotoWrapper = styled.div`
    display: grid;
    justify-items: center;
    
`

const DeleteButton = styled.button`
    background-color: tomato;
    color: white;
    font-weight: 600;
    border: 0;
    font-size: 12px;
    padding: 5px 10px;
    text-transform: uppercase;
    border-radius: 5px;
    margin-left: 5px;
    cursor: pointer;
`

const EditButton = styled.button`
    background-color: #1d9bf0;
    color: white;
    font-weight: 600;
    border: 0;
    font-size: 12px;
    padding: 5px 10px;
    text-transform: uppercase;
    border-radius: 5px;
    max-width: 50px;
    cursor: pointer;
`

const SaveButton = styled.button`
    background-color: #1d9bf0;
    color: white;
    font-weight: 600;
    border: 0;
    font-size: 12px;
    padding: 5px 10px;
    text-transform: uppercase;
    border-radius: 5px;
    cursor: pointer;
`

const EditTextArea = styled.textarea`
    margin:10px 0px;
    font-size: 18px;
    border: 2px solid #1d9bf0;
    background-color: black;
    color : white;
    border-radius: 5px;
    resize: none;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', 
                Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    overflow-y: hidden;
    &:focus {
        outline: none;
    }
`

const EditImage = styled.label`
    background-color: #1d9bf0;
    color: white;
    font-weight: 600;
    border: 0;
    font-size: 12px;
    padding: 5px 10px;
    text-transform: uppercase;
    border-radius: 5px;
    resize: none;
    overflow-x: none;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', 
                Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    overflow-y: hidden;
    &:focus {
        outline: none;
    }
`

const EditImageInput = styled.input`
    display: none;
`

export default function Tweet({username, photo, tweet, id, userId}: ITweet) {
    const user = auth.currentUser
    const [isEditing, setIsEditing] = useState(false)
    const [isImgEditing, setIsImgEditing] = useState(false)
    const [tweetToEdit, setTweetToEdit] = useState(tweet)
    
    const onDelete = async() => {
        const ok = confirm("Are you sure you want to delete this tweet?")

        if (!ok ||user?.uid !== userId) return

        try {
            await deleteDoc(doc(db, "tweets", id))

            if (photo) {
                const photoRef = ref(storage, `tweets/${user.uid}/${id}`)
                await (deleteObject(photoRef))
            }
        } catch (e) {
            console.log(e)
        }
    }

    const onEdit = () => {

        setIsEditing(true)
    }

    const onChange = (e : React.ChangeEvent<HTMLTextAreaElement>) => {
        setTweetToEdit(e.target.value)
    }

    const onSave = async () => {
        setIsEditing(false)

        if (!user || isEditing || tweetToEdit === "" || tweetToEdit.length > 180) return

        try {
            setIsEditing(true)

            const takenDoc = doc(db, "tweets", id)
            await updateDoc(takenDoc, {
                tweet : tweetToEdit
            })

        } catch (e) {
            console.log(e)
        } finally {
            setIsEditing(false)
        }
    }

    const onFileEdit = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const {files} = e?.target

        if (files === null) return

        const file = files[0]

        if (!user || isImgEditing) return

        if(file && file.size > 1024 * 1024) {
            return
        }

        try {
            setIsImgEditing(true)

            if (file) {
                const takenDoc = doc(db, "tweets", id)

                const locationRef = ref(storage, `tweets/${user.uid}/${takenDoc.id}`)
                
                const uploadResult = await uploadBytes(locationRef, file)
                const downloadURL = await getDownloadURL(uploadResult.ref)

                await updateDoc(takenDoc, {
                    photo: downloadURL
                })
            }

        } catch (e) {
            console.log(e)
        } finally {
            setIsImgEditing(false)
        }
    }

    return (
        <Wrapper>
            <Column>
                <UserName>{username}</UserName>
                { isEditing ? <EditTextArea onChange={onChange} value = {tweetToEdit}/>
                                : <Payload>{tweetToEdit}</Payload>
                }
                { user?.uid === userId ? 
                    <ButtonWrapper> 
                        { isEditing ? <SaveButton onClick={onSave}>Save</SaveButton>
                                    : <EditButton onClick={onEdit}>Edit</EditButton>
                        } 
                        <DeleteButton onClick={onDelete}>Delete</DeleteButton>
                    </ButtonWrapper>
                    : null
                }
            </Column>
            <Column>
                {photo ? 
                        <PhotoWrapper>
                            <Photo src={photo}></Photo>
                            <EditImage htmlFor={`editfile-${id}`}>{isImgEditing ? "Loading..."
                                                                         : "Edit photo"
                                                            }
                            </EditImage>
                            {/* 이미지면 어떤것도 상관없어 */}
                            <EditImageInput onChange = {onFileEdit} type="file" id = {`editfile-${id}`} accept="image/*" />
                        </PhotoWrapper> 
                        : null}
            </Column>
        </Wrapper>
    )
}
import { collection, limit, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { styled } from "styled-components";
import { db } from "../firebase";
import Tweet from "./tweet";
import { Unsubscribe } from "firebase/auth";

export interface ITweet {
    id: string;
    photo?: string;
    tweet: string;
    userId: string;
    username: string;
    createdAt: number;
}

const Wrapper = styled.div`
    display: flex;
    gap: 10px;
    flex-direction: column;
`

export default function TimeLine() {
    const [tweets, setTweets] = useState<ITweet[]>([])
    

    useEffect(() => {
        let unsubscribe : Unsubscribe | null = null

        const fetchTweets = async() => {
            const tweetsQuery = query(
                collection(db, "tweets"),
                orderBy("createdAt", "desc"),
                limit(25)
            )
            // const snapshot = await getDocs(tweetsQuery)
            // const tweets = snapshot.docs.map((doc) => {
            //     const {tweet, createdAt, userId, username, photo} = doc.data()
    
            //     return {
            //         tweet, createdAt, userId, username, photo,
            //         id: doc.id
            //     }
            // })
    
            unsubscribe = await onSnapshot(tweetsQuery, (snapshot) => {
                const tweets = snapshot.docs
                                // .filter((doc) => doc.data().username == auth.currentUser?.displayName)
                                    .map((doc) => {
                    const {tweet, createdAt, userId, username, photo} = doc.data()
        
                    return {
                        tweet, createdAt, userId, username, photo,
                        id: doc.id
                    }
                })
    
                setTweets(tweets)
            })
        }

        fetchTweets()

        return () => {
            // 이 컴포넌트가 언마운트 될 때 클린업이 실행된다 그래서 이것도 실행되면서 유저가 안볼때는 unsubscribe가 된다
            // tearDown or cleanUp 하게된다 useEffect는
            unsubscribe && unsubscribe()
        }

    }, [])

    return (
        <Wrapper>
            {tweets.map((tweet) => {
                return <Tweet key={tweet.id} {...tweet} />
        })}
        </Wrapper>
    )
}
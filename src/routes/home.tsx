import { styled } from "styled-components";
import PostTweetForm from "../component/post-tweet-form";
import TimeLine from "../component/timeline";

const Wrapper = styled.div`
    display: grid;
    gap: 50px;
    overflow-y: scroll;
    grid-template-rows: 1fr 5fr;
`

export default function Home() {    
    return (
        <Wrapper>
            <PostTweetForm />
            <TimeLine />
        </Wrapper>
    )
}
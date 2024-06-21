import { signInWithEmailAndPassword } from "firebase/auth"
import { useState } from "react"
import { auth } from "../firebase"
import { Link, useNavigate } from "react-router-dom"
import { FirebaseError } from "firebase/app"
import { Wrapper, Title, Input, Switcher, Error, Form } from "../component/auth-components"
import GithubButton from "../component/github-btx"

export default function Login() {
    const navigate = useNavigate()
    const [isLoading, setLoading] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    const onChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        const { target: {name, value} } = e

        switch(name) {
            case "email":
                setEmail(value)
                break
            case "password":
                setPassword(value)
                break
        }

    }
    
    const onSubmit = async (e : React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError("")

        console.log(name, email, password)

        if (isLoading || email === "" || password === "") return
        
        try {
            // create an account
            // set the name of the user
            // redirect to the homepage
            setLoading(true)

            await signInWithEmailAndPassword(auth, email, password)

            navigate("/")
        } catch(e) {
            //Set Error
            console.log(e)
            if (e instanceof FirebaseError) {
                setError(e.message)
            }
        }
        finally {
            setLoading(false)
        }

    }

    return (
        <Wrapper>
          <Title>Log into 𝕏</Title>
          <Form onSubmit={onSubmit}>
            <Input
              onChange={onChange}
              name="email"
              value={email}
              placeholder="Email"
              type="email"
              required
            />
            <Input
              onChange={onChange}
              value={password}
              name="password"
              placeholder="Password"
              type="password"
              required
            />
            <Input type="submit" value={isLoading ? "Loading..." : "Log in"} />
          </Form>
          {error !== "" ? <Error>{error}</Error> : null}
          <Switcher>
            Don't have an account?{" "}
            <Link to="/create-account">Create one &rarr;</Link>
          </Switcher>
          <GithubButton />
        </Wrapper>
      );
}
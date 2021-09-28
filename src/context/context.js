import React, { useState, useEffect } from 'react';
import mockUser from './mockData.js/mockUser';
import mockRepos from './mockData.js/mockRepos';
import mockFollowers from './mockData.js/mockFollowers';
import axios from 'axios';

const rootUrl = 'https://api.github.com';

const GithubContext = React.createContext();

const GithubProvider = ({ children }) => {
    const [githubUser, setGithubUser] = useState(mockUser)
    const [repos, setRepos] = useState(mockRepos)
    const [followers, setFollowers] = useState(mockFollowers)
    const [request, setRequest] = useState(0)
    const [isLoading, setIsLoading] = useState(false)

    const [error, setError] = useState({show:false, msg:""})

    const checkRequests = () => {
        axios(`${rootUrl}/rate_limit`)
            .then(({ data }) => {
                let { rate: { remaining } } = data
                setRequest(remaining)
                if (remaining === 0) {
                    toggleError(true, 'sorry you have exceeded your hourly rate limit!')
                }
            })
            .catch((err)=>console.log(err))
    }

    const searchGithubUser = async(user) => {
        toggleError()
        setIsLoading(true)
        const response = await axios(`${rootUrl}/users/${user}`)
            .catch((err) => console.log(err))
        if (response) {
            setGithubUser(response.data)
            const { login, followers_url } = response.data;
            
            await Promise.allSettled([
                axios(`${rootUrl}/users/${login}/repos?per_page=100`),
                axios(`${followers_url}?per_page=100`),
            ]).then((results) => {
                const [repos, followers] = results;
                const status = 'fulfilled'
                if (repos.status === status) {
                    console.log(repos.value.data);
                    setRepos(repos.value.data)
                }
                if (followers.status === status) {
                    console.log(followers.value.data);
                    setFollowers(followers.value.data)
                }
            }
            ).catch(err => console.log(err))
            // await axios(`${rootUrl}/users/${login}/repos?per_page=100`)
            //     .then(response => {
            //     setRepos(response.data)
            // })
            // await axios(`${followers_url}?per_page=100`)
            //     .then(response => {
            //     setFollowers(response.data)
            // })
            //repos
            // https://api.github.com/users/john-smilga/repos?per_page=100
            // followers
            // https://api.github.com/users/john-smilga/followers

        }
        else {
            toggleError(true,'there is no user with that username')
        }
        checkRequests()
        setIsLoading(false)
    }
    
    function toggleError(show = false, msg ='') {
        setError({show, msg})
    }
    
    useEffect(checkRequests,[])
    return (
        <GithubContext.Provider
            value={{ githubUser, repos, followers, request, error, searchGithubUser, isLoading }}>
            {children}
        </GithubContext.Provider>
    )
}

const GlobalGitHubContext = () => {
    return React.useContext(GithubContext)
}

export { GithubProvider, GlobalGitHubContext };



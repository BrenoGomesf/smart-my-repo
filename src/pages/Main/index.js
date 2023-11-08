import React, { useState, useCallback, useEffect } from "react"
import {Container, Form, SubmitButton, List, DeleteButton} from './styles'
import { FaGithub, FaPlus, FaSpinner, FaBars, FaTrash} from 'react-icons/fa'
import api from '../../services/api'
import { Link } from 'react-router-dom'
export default function Main(){
  const [repo, setRepo] = useState('')
  const [repoAll, setRepoAll] = useState([])
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    const repoStorage = localStorage.getItem('repos');
    const res = JSON.parse(repoStorage)
    if(res.length > 0){
       setRepoAll(res)
    }
  }, [])
//GUARDA

  useEffect(() => {
    localStorage.setItem('repos', JSON.stringify(repoAll))
  }, [repoAll])

  const handleSubmit = useCallback((e)=> {
    e.preventDefault()
    async function submit(){
      setLoading(true)
      setAlert(null)
      try {
        if(!repo){
          throw new Error("Voce precisa indicar um repository")
        }

        const hasRepo = repoAll.find(el => el.name === repo)

        if(hasRepo){
          throw new Error("Repository duplicated")
        }

        const response = await api.get(`https://api.github.com/repos/${repo}`)
        const data = {
          name: response.data.full_name,
        }
        setRepoAll([...repoAll, data])
        setRepo('')
      } catch (error) {
        setAlert(true);
        console.log(error)
      }finally{
        setLoading(false)
      }
    }
    submit()
  }, [ repo, repoAll]);

  
  function handleInputChange(e){
    setAlert(null)
    setRepo(e.target.value)
  }

  const handleDelete = useCallback((repo) => {
    const find = repoAll.filter(r => r.name !== repo);
    setRepoAll(find);
  }, [repoAll])

  return (
      <Container>
          <h1>
            <FaGithub size={15}/>
              Meus Repositorios
          </h1>
          
          <Form onSubmit={ handleSubmit} error={alert}>
            <input
             type="text" placeholder="Adicionar Repositorios"
             value={repo}
             onChange={handleInputChange}
             />

              <SubmitButton loading={loading ? 1 : 0}>
                  {
                    loading ? (
                      <FaSpinner color="#FFF" size={14}/>
                    ): (
                      <FaPlus color='#FFFF' size={14}/>
                    )}
               </SubmitButton>
            </Form>

            <List>
                      { repoAll.map( repo => (
                        <li key={repo.name}>
                            <span>
                              <DeleteButton onClick={()=> handleDelete(repo.name)}>
                                  <FaTrash size={14}/>
                              </DeleteButton>
                              {repo.name}</span>
                            <Link to={`/repo/${encodeURIComponent(repo.name)}`}>
                              <FaBars size={20}/>
                            </Link>
                        </li>
                      ))}
            </List>
        </Container>
  )
}
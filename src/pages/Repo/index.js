import React, {useState, useEffect} from "react"
import {Container, Owner, Loading, BackButton, IssuesList, PageAction, FilterList} from './styles'
import { FaArrowLeft } from 'react-icons/fa'
import api from '../../services/api'

 function Repo({match}){
  const [reposition, setReposition] = useState({});
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState([
    { states: 'all', label: 'Todas', active: true},
    { states: 'open', label: 'Abertas', active: false},
    { states: 'closed', label: 'Fechadas', active: false} 
  ]);
  const [filterIndex, setFilerIndex] = useState(1)
  useEffect(()=> {
    async function load(){
      setLoading(true)
      const nomeRepo = decodeURIComponent(match.params.name)

    const [repoData, issueData] =   await Promise.all([
        api.get(`https://api.github.com/repos/${nomeRepo}`),
        api.get(`https://api.github.com/repos/${nomeRepo}/issues`,{
          params:{
            state: filters.find( f => f.active).states,
            per_page: 5,
            page: page 
          }
        })
      ]);
      console.log(repoData.data)
      setReposition(repoData.data)
      setIssues(issueData.data)
      setLoading(false)
    }
    load()
  }, [match.params.name])


  useEffect(() =>{
    async function loadIsse(){
      const nomeRepo = decodeURIComponent(match.params.name)

      const response = await api.get(`https://api.github.com/repos/${nomeRepo}/issues`,{
        params:{
          state: filters[filterIndex].states,
          page,
          per_page: 5
        }
      })
      setIssues(response.data)
    }
    loadIsse()
  }, [match.params.name, page, filters[filterIndex].states, page, filters])
  function handlePage(action){
    setPage(action === 'back' ? page - 1 : page + 1)
  }
  function handleFilter(index){
    setFilerIndex(index)
  }

  if(loading == true){
    console.log('entrou aqui')
      return (
        <Loading>
         <h1>Carregando...</h1>
        </Loading>
      )
  }

  return (
    <Container>
      <BackButton to="/">
        <FaArrowLeft color="#0D2636"></FaArrowLeft>
      </BackButton>
      <Owner>
        <img src={reposition.owner?.avatar_url}
        alt={reposition.owner?.login} />
        <h1>{reposition.name}</h1>
        <p>{reposition.description}</p>
      </Owner>

      <FilterList active={filterIndex}>
        {filters.map((filter, index) => (
          <button
          type="button"
          key={filter.label}
          onClick={ () => handleFilter(index)}
          >{filter.label}</button>
        ))}
      </FilterList>

      <IssuesList>
        {issues.map(issue => (
          <li key={String(issue.id)}>
            <img src={issue.user.avatar_url} alt={issue.user.login}/>
            
            <div>
                <strong>
                  <a href={issue.html_url}>{issue.title}</a>
                  {issue.labels.map(label =>(
                    <span key={String(label.id)}>{label.name}</span>
                  ))}
                </strong>
                <p>{issue.user.login}</p>
            </div>
          </li>
        ))}
      </IssuesList>

      <PageAction>
        <button 
        type="button"
         onClick={() => {handlePage('back')}}
         disabled={page < 2}
         >
          Voltar
          </button>
        <button type="button" onClick={() => handlePage('next')}>
          Proxima
          </button>
      </PageAction>

      
    </Container>
  )
}
export default Repo;
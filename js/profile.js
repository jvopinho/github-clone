import { ProfileRender } from "./ProfileRender.js";

function setSection(sectionId) {
    const sections = document.querySelectorAll('.content-section')
    const navLinks = document.querySelectorAll('nav a')

    sections.forEach(section => {
        if (section.id === `${sectionId}-section`) {
            section.hidden = false
        } else {
            section.hidden = true
        }
    })

    navLinks.forEach(link => {
        if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active')
        } else {
            link.classList.remove('active')
        }
    })
}

const navLinks = document.querySelectorAll('nav a')
navLinks.forEach(link => {
    link.addEventListener('click', (event) => {
        const sectionId = link.getAttribute('href').substring(1)
        setSection(sectionId)
    })
})

setSection(window.location.hash.substring(1) || 'overview')

async function fetchUserProfile(userName) {
    try {
        const response = await fetch(`https://api.github.com/users/${userName}`)
        const userData = await response.json()

        ProfileRender.renderProfileInfos(userData)
    } catch (error) {
        alert('Erro ao buscar o perfil do usuário:', error)
    }
}

async function fetchReadme(userName) {
    try {
        const response = await fetch(`https://raw.githubusercontent.com/${userName}/${userName}/main/README.md`)
    
        const readmeText = await response.text()

        ProfileRender.renderProfileReadme(userName, readmeText)
    } catch (error) {
        console.error('Erro ao buscar o README.md:', error)
    }
}

async function fetchPinnedRepositories(userName) {
    try {
        const response = await fetch(`https://pinned.berrysauce.dev/get/${userName}`)
        const pinnedRepos = await response.json()
        
        ProfileRender.renderPinnedRepositories(userName, pinnedRepos)
    } catch (error) {
        console.error('Erro ao buscar os repositórios fixados:', error)
    }
}

fetchUserProfile('jvopinho')
fetchReadme('jvopinho')
fetchPinnedRepositories('jvopinho')